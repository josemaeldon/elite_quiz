<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Backup extends CI_Controller
{
    private $dbBackupDir;
    private $assetsBackupDir;
    private $tempDir;

    private $backup_items = [
        'images',
        'upload',
        'assets/google_service_account.json',
        'application/language'
    ];

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('isLoggedIn')) {
            redirect('/');
        }
        $this->load->database();

        $this->dbBackupDir = FCPATH . 'backups/db_data/';
        $this->assetsBackupDir = FCPATH . 'backups/assets_data/';
        $this->tempDir = FCPATH . 'backups/temp/';

        @ini_set('memory_limit', '-1');
        @set_time_limit(0);

        if (!is_dir($this->dbBackupDir)) mkdir($this->dbBackupDir, 0755, true);
        if (!is_dir($this->assetsBackupDir)) mkdir($this->assetsBackupDir, 0755, true);
        if (!is_dir($this->tempDir)) mkdir($this->tempDir, 0755, true);
    }

    /* ---------------- INDEX ---------------- */

    private function countAssetFiles()
    {
        $count = 0;
        foreach ($this->backup_items as $path) {
            $full = FCPATH . $path;
            if (is_file($full)) $count++;
            if (is_dir($full)) {
                $iterator = new RecursiveIteratorIterator(
                    new RecursiveDirectoryIterator($full, RecursiveDirectoryIterator::SKIP_DOTS)
                );
                foreach ($iterator as $file) {
                    if ($file->isFile()) $count++;
                }
            }
        }
        return $count;
    }

    private function getDirSize($path)
    {
        $size = 0;
        $full = FCPATH . $path;
        if (is_file($full)) return filesize($full);
        if (is_dir($full)) {
            $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($full, RecursiveDirectoryIterator::SKIP_DOTS));
            foreach ($iterator as $file) {
                $size += $file->getSize();
            }
        }
        return $size;
    }

    public function index()
    {
        $this->result['compatibility'] = [
            'mysqli' => function_exists('mysqli_connect'),
            'zip' => class_exists('ZipArchive'),
            'writable' => is_writable(FCPATH . 'backups'),
            'overall' => true
        ];

        // Disk Space & Data Size Logic
        $totalDataSize = 0;
        foreach ($this->backup_items as $item) {
            $totalDataSize += $this->getDirSize($item);
        }

        $freeSpace = disk_free_space(FCPATH);
        $requiredSpace = $totalDataSize * 1.5; // 50% margin

        $this->result['disk'] = [
            'free' => $this->formatSize($freeSpace),
            'required' => $this->formatSize($requiredSpace),
            'data' => $this->formatSize($totalDataSize),
            'low_space' => ($freeSpace < $requiredSpace),
            'diff' => $this->formatSize($requiredSpace - $freeSpace)
        ];

        $this->result['db_backups'] = $this->getBackups($this->dbBackupDir);
        $this->result['assets_backups'] = $this->getBackups($this->assetsBackupDir);

        // Add total asset files count
        $this->result['total_assets_files'] = $this->countAssetFiles();

        // Check for active sessions (for resume feature)
        $this->result['active_assets_session'] = file_exists($this->tempDir . 'assets_session.json');
        $this->result['active_db_session'] = file_exists($this->tempDir . 'db_session.json');

        $this->load->view('backup', $this->result);
    }

    private function getBackups($dir)
    {
        $files = [];
        if (!is_dir($dir)) return [];
        foreach (glob($dir . '*') as $file) {
            $filename = basename($file);
            $isValid = true;

            // Integrity Check
            if (pathinfo($filename, PATHINFO_EXTENSION) == 'zip') {
                $zip = new ZipArchive();
                if ($zip->open($file) !== TRUE) {
                    $isValid = false;
                } else {
                    $zip->close();
                }
            } elseif (pathinfo($filename, PATHINFO_EXTENSION) == 'sql') {
                if (filesize($file) == 0) {
                    $isValid = false;
                }
            }

            if (!$isValid) {
                @unlink($file); // Remove corrupted/partial file
                continue;
            }

            $files[] = [
                'name' => $filename,
                'size' => $this->formatSize(filesize($file)),
                'date' => date("Y-m-d H:i", filemtime($file)),
                'timestamp' => filemtime($file)
            ];
        }
        usort($files, fn($a, $b) => $b['timestamp'] - $a['timestamp']);
        return $files;
    }

    private function formatSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        for ($i = 0; $bytes > 1024; $i++) $bytes /= 1024;
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /* ---------------- DATABASE BACKUP ---------------- */

    public function start_db()
    {
        if (!has_permissions('update', 'backup_data')) {
            $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
            redirect('backup');
        } else {
            $tables = $this->db->query("SHOW TABLES")->result_array();
            $list = array_map(fn($t) => array_values($t)[0], $tables);

            $session = [
                'tables' => $list,
                'current_table' => 0,
                'offset' => 0,
                'file' => 'backup_' . date('Ymd_His') . '.sql',
                'start_time' => time()
            ];

            file_put_contents($this->tempDir . 'db_session.json', json_encode($session));

            echo json_encode(['status' => 'ok', 'total_tables' => count($list)]);
        }
    }

    public function process_db_chunk()
    {
        $sessionFile = $this->tempDir . 'db_session.json';
        if (!file_exists($sessionFile)) {
            echo json_encode(['status' => 'error', 'message' => 'DB session missing']);
            return;
        }

        $session = json_decode(file_get_contents($sessionFile), true);
        $tables = $session['tables'];
        $tableIndex = $session['current_table'];
        $offset = $session['offset'];

        if (!isset($tables[$tableIndex])) {
            $sqlFile = $this->tempDir . $session['file'];
            $zipFile = $session['file'] . '.zip';
            $zipPath = $this->dbBackupDir . $zipFile;

            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE) {
                $zip->addFile($sqlFile, basename($sqlFile));
                $zip->close();
                @unlink($sqlFile);
                @unlink($sessionFile);
                echo json_encode([
                    'done' => true,
                    'processed_tables' => count($tables),
                    'total_tables' => count($tables)
                ]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to create ZIP for database backup']);
            }
            return;
        }

        $table = $tables[$tableIndex];
        $limit = 500;

        $rows = $this->db->query("SELECT * FROM `$table` LIMIT $offset,$limit")->result_array();
        $file = fopen($this->tempDir . $session['file'], 'a');

        foreach ($rows as $row) {
            $vals = array_map([$this->db, 'escape'], $row);
            fwrite($file, "INSERT INTO `$table` VALUES(" . implode(',', $vals) . ");\n");
        }
        fclose($file);

        if (count($rows) < $limit) {
            $session['current_table']++;
            $session['offset'] = 0;
        } else {
            $session['offset'] += $limit;
        }

        file_put_contents($sessionFile, json_encode($session));

        $percent = round(($session['current_table'] / count($tables)) * 100);
        $elapsed = time() - $session['start_time'];

        $etd = ($session['current_table'] > 0) ? gmdate("H:i:s", round(($elapsed / $session['current_table']) * (count($tables) - $session['current_table']))) : 'Calculating...';

        echo json_encode([
            'percent' => $percent,
            'processed_tables' => $session['current_table'],
            'total_tables' => count($tables),
            'etd' => $etd
        ]);
    }

    public function cancel_db()
    {
        $sessionFile = $this->tempDir . 'db_session.json';
        if (file_exists($sessionFile)) {
            $session = json_decode(file_get_contents($sessionFile), true);
            $tempFile = $this->tempDir . $session['file'];
            if (file_exists($tempFile)) @unlink($tempFile);

            // Also check destination just in case it was moved halfway
            $destFile = $this->dbBackupDir . $session['file'];
            if (file_exists($destFile)) @unlink($destFile);

            @unlink($sessionFile);
        }
        echo json_encode(['status' => 'cancelled']);
    }

    public function start_assets()
    {
        if (!has_permissions('update', 'backup_data')) {
            $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
            redirect('backup');
        } else {
            @set_time_limit(0);
            @ini_set('memory_limit', '-1');

            // Cleanup any partial sessions first to ensure clean state
            $sessionFile = $this->tempDir . 'assets_session.json';
            if ($this->input->post('restart') == 'true' && file_exists($sessionFile)) {
                $this->cancel_assets();
            }

            // If session exists and not restarting, return status for resume
            if (file_exists($sessionFile)) {
                $session = json_decode(file_get_contents($sessionFile), true);
                echo json_encode([
                    "status" => "resume",
                    "total_files" => $session['total'],
                    "processed" => $session['processed'],
                    "zip" => $session['zip']
                ]);
                return;
            }

            // Collect all files. To stay memory efficient for discovery, we do one full scan 
            // but it's only a list of paths (strings).
            $files = [];
            foreach ($this->backup_items as $path) {
                $full = FCPATH . $path;
                if (is_file($full)) {
                    $files[] = $full;
                } elseif (is_dir($full)) {
                    $iterator = new RecursiveIteratorIterator(
                        new RecursiveDirectoryIterator($full, RecursiveDirectoryIterator::SKIP_DOTS),
                        RecursiveIteratorIterator::LEAVES_ONLY
                    );
                    foreach ($iterator as $file) {
                        if ($file->isFile()) {
                            $files[] = $file->getPathname();
                        }
                    }
                }
            }

            if (!$files) {
                echo json_encode(["status" => "error", "message" => "No files found for backup"]);
                return;
            }

            // Cleanup ANY old fragments or partial zips for safety
            $oldFragments = glob($this->tempDir . 'fragment_*.zip');
            foreach ($oldFragments as $f) @unlink($f);
            $oldAssetsTemp = glob($this->tempDir . 'assets_backup_*.zip');
            foreach ($oldAssetsTemp as $f) @unlink($f);

            // Unique ID for this backup run to prevent collisions
            $backupId = date("Ymd_His") . "_" . substr(md5(uniqid()), 0, 6);

            $session = [
                "id" => $backupId,
                "files" => $files,
                "processed" => 0,
                "total" => count($files),
                "final_zip" => "assets_backup_" . $backupId . ".zip",
                "chunks" => [],
                "start_time" => time()
            ];

            file_put_contents($sessionFile, json_encode($session));

            echo json_encode([
                "status" => "ok",
                "total_files" => count($files)
            ]);
        }
    }

    public function process_assets_chunk()
    {
        @set_time_limit(0);
        @ini_set('memory_limit', '-1');

        $sessionFile = $this->tempDir . 'assets_session.json';
        if (!file_exists($sessionFile)) {
            echo json_encode(["status" => "error", "message" => "Session missing"]);
            return;
        }

        $session = json_decode(file_get_contents($sessionFile), true);

        // Batch configuration
        $batchCount = 200; // Files per chunk
        $maxChunkSize = 100 * 1024 * 1024; // 100MB per fragment ZIP

        $files = array_slice($session['files'], $session['processed'], $batchCount);
        if (empty($files)) {
            $this->finalize_assets($session);
            return;
        }

        // Create a UNIQUE fragment for this request
        $fragmentName = 'fragment_' . $session['id'] . '_' . sprintf("%04d", count($session['chunks'])) . '.zip';
        $fragmentPath = $this->tempDir . $fragmentName;

        $zip = new ZipArchive();
        if ($zip->open($fragmentPath, ZipArchive::CREATE) !== TRUE) {
            echo json_encode(["status" => "error", "message" => "Cannot create ZIP fragment"]);
            return;
        }

        $currentFile = "";
        foreach ($files as $file) {
            if (file_exists($file)) {
                $local = str_replace(FCPATH, '', $file);
                $zip->addFile($file, $local);
                $session['processed']++;
                $currentFile = $local;
            }
        }
        $zip->close();

        // Track the chunk
        $session['chunks'][] = $fragmentPath;
        file_put_contents($sessionFile, json_encode($session));

        $percent = round(($session['processed'] / $session['total']) * 100);

        // Calculate ETD
        $elapsed = time() - $session['start_time'];
        $remainingFiles = $session['total'] - $session['processed'];
        $etd = ($session['processed'] > 0) ? gmdate("H:i:s", (int)(($elapsed / $session['processed']) * $remainingFiles)) : 'Calculating...';

        // Check if finished
        if ($session['processed'] >= $session['total']) {
            $this->finalize_assets($session);
            return;
        }

        echo json_encode([
            "percent" => $percent,
            "processed" => $session['processed'],
            "total" => $session['total'],
            "current_file" => $currentFile,
            "status" => "zipping",
            "etd" => $etd
        ]);
    }

    private function finalize_assets(&$session)
    {
        $session['status'] = 'merging';
        $session['merged_chunks'] = 0;
        $sessionFile = $this->tempDir . 'assets_session.json';
        file_put_contents($sessionFile, json_encode($session));

        echo json_encode([
            "done" => false,
            "status" => "merging",
            "total_chunks" => count($session['chunks']),
            "processed_chunks" => 0
        ]);
    }

    public function merge_assets_chunks()
    {
        @set_time_limit(0);
        @ignore_user_abort(true);
        @ini_set('memory_limit', '-1');

        $sessionFile = $this->tempDir . 'assets_session.json';
        if (!file_exists($sessionFile)) {
            echo json_encode(["status" => "error", "message" => "Session missing"]);
            return;
        }

        $session = json_decode(file_get_contents($sessionFile), true);
        $tempFinalPath = $this->tempDir . $session['final_zip'];
        $destPath = $this->assetsBackupDir . $session['final_zip'];

        // Dynamic Batch Sizing: As the final ZIP grows, merging becomes slower I/O wise.
        // We reduce batch size for larger archives to keep request time under control.
        $currentFinalSize = file_exists($tempFinalPath) ? filesize($tempFinalPath) : 0;
        $batchSize = 5;
        if ($currentFinalSize > 1024 * 1024 * 1024) $batchSize = 2; // > 1GB
        if ($currentFinalSize > 3 * 1024 * 1024 * 1024) $batchSize = 1; // > 3GB

        $chunksToProcess = array_slice($session['chunks'], $session['merged_chunks'], $batchSize);

        if (empty($chunksToProcess)) {
            // All fragments merged, verify and move
            $verify = new ZipArchive();
            if ($verify->open($tempFinalPath) === TRUE) {
                $verify->close();
                rename($tempFinalPath, $destPath);
                @unlink($sessionFile);
                echo json_encode([
                    "done" => true,
                    "status" => "completed",
                    "file" => $session['final_zip'],
                    "processed" => $session['total'],
                    "total" => $session['total']
                ]);
            } else {
                @unlink($tempFinalPath);
                echo json_encode(["status" => "error", "message" => "Final ZIP integrity check failed"]);
            }
            return;
        }

        $finalZip = new ZipArchive();
        $mode = ($session['merged_chunks'] == 0) ? ZipArchive::CREATE : ZipArchive::CHECKCONS;

        if ($finalZip->open($tempFinalPath, $mode) !== TRUE) {
            echo json_encode(["status" => "error", "message" => "Cannot open final ZIP for merging"]);
            return;
        }

        foreach ($chunksToProcess as $chunkPath) {
            if (file_exists($chunkPath)) {
                $chunkZip = new ZipArchive();
                if ($chunkZip->open($chunkPath) === TRUE) {
                    for ($i = 0; $i < $chunkZip->numFiles; $i++) {
                        $stat = $chunkZip->statIndex($i);

                        // Memory Safe: If file is larger than 10MB, extract to temp first instead of string buffer
                        if ($stat['size'] > 10 * 1024 * 1024) {
                            $tmpExtract = $this->tempDir . 'extract_' . md5($stat['name']);
                            if ($chunkZip->extractTo($this->tempDir, $stat['name'])) {
                                $finalZip->addFile($this->tempDir . '/' . $stat['name'], $stat['name']);
                                // We can't safely unlink immediately as addFile only adds on close()
                                // ZipArchive will handle it if we close and reopen, but for now we skip deletion
                                // until session cleanup to be safe.
                            }
                        } else {
                            $stream = $chunkZip->getStream($stat['name']);
                            if ($stream) {
                                $finalZip->addFromString($stat['name'], stream_get_contents($stream));
                                fclose($stream);
                            }
                        }
                    }
                    $chunkZip->close();
                    @unlink($chunkPath);
                }
            }
            $session['merged_chunks']++;
        }
        $finalZip->close();

        // Final cleanup of any extracted files after close/save
        $extracted = glob($this->tempDir . 'extract_*');
        foreach ($extracted as $ex) @unlink($ex);

        file_put_contents($sessionFile, json_encode($session));

        echo json_encode([
            "done" => false,
            "status" => "merging",
            "total_chunks" => count($session['chunks']),
            "processed_chunks" => $session['merged_chunks']
        ]);
    }

    /* Cancel Assets Backup */
    public function cancel_assets()
    {
        $sessionFile = $this->tempDir . 'assets_session.json';

        if (file_exists($sessionFile)) {
            $session = json_decode(file_get_contents($sessionFile), true);
            // Delete all fragments
            if (isset($session['chunks'])) {
                foreach ($session['chunks'] as $chunk) {
                    if (file_exists($chunk)) @unlink($chunk);
                }
            }
            // Delete partial final zip in temp
            if (isset($session['final_zip'])) {
                @unlink($this->tempDir . $session['final_zip']);
                @unlink($this->assetsBackupDir . $session['final_zip']);
            }
            @unlink($sessionFile);
        } else {
            // Fallback: cleanup all fragments and partial assets in temp anyway
            $files = glob($this->tempDir . 'fragment_*.zip');
            foreach ($files as $f) @unlink($f);
            $files = glob($this->tempDir . 'assets_backup_*.zip');
            foreach ($files as $f) @unlink($f);
        }

        echo json_encode(["status" => "cancelled"]);
    }

    /* ---------------- DELETE BACKUP ---------------- */

    public function delete_backup()
    {
        $file = $this->input->post('file');
        $type = $this->input->post('type');
        $path = ($type == 'db') ? $this->dbBackupDir . $file : $this->assetsBackupDir . $file;

        if (file_exists($path)) {
            unlink($path);
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'File not found']);
        }
    }
}
