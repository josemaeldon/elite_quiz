<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Backup Data</title>

    <?php include 'include.php'; ?>
</head>

<body>
    <div id="app">
        <div class="main-wrapper">
            <?php include 'header.php'; ?>
            <div class="main-content">
                <section class="section">
                    <div class="section-header">
                        <h1>Backup Data</h1>
                    </div>
                    <div class="section-body">
                        <!-- System Notice Banner -->
                        <div class="row">
                            <div class="col-12 mb-3">
                                <div class="card shadow" style="border: 2px solid #dc3545;">
                                    <div class="card-header" style="background:#dc3545;">
                                        <h4 class="text-white mb-0">
                                            <i class="fas fa-exclamation-triangle mr-2"></i>
                                            Important Notice — Please Read Before Proceeding
                                        </h4>
                                    </div>
                                    <div class="card-body py-3" style="background:#fff8f8;">
                                        <ul class="mb-3 pl-4 text-dark" style="line-height: 2.1; font-size: 0.97rem;">
                                            <li>This is the <strong>major update</strong> for Elite Quiz on CodeIgniter. Before installing any new update, <strong>take a full backup of your data first</strong>.</li>
                                            <li>It is strongly recommended to <strong>download the backup to your local storage</strong> before proceeding with any new setup or code update.</li>
                                            <li>If you perform a new installation <strong>without a backup</strong> and lose your data, <strong>we will not be responsible</strong> for any data loss.</li>
                                            <li>If you have a valid backup and something is missing after an update, we will <strong>guide and assist you</strong>.</li>
                                            <li>If you face any issues with this backup tool, please <strong>manually backup data</strong> (images, upload, assets/firebase configuration file, application/language) via your panel.</li>
                                        </ul>
                                        <div class="alert alert-danger mb-3" style="font-size: 0.97rem; border-left: 4px solid #a71d2a;">
                                            <i class="fas fa-ban mr-2"></i>
                                            <strong>Without a backup, we will not do anything for data.</strong> Any new installation done without a backup is entirely <u>at your own risk</u>.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- System Dashboard -->
                        <div class="row">
                            <div class="col-12">
                                <div class="card mb-4">
                                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                                        <h4 class="text-primary"><i class="fas fa-tachometer-alt mr-2"></i> Infrastructure & Health</h4>
                                        <div class="badge badge-light border"><i class="fas fa-clock mr-1"></i> <?= date('H:i') ?></div>
                                    </div>
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <!-- Compatibility Badges -->
                                            <div class="col-md-4 border-right">
                                                <h6 class="font-weight-bold text-muted mb-3 small text-uppercase">Infrastructure Compatibility</h6>
                                                <div class="d-flex flex-wrap">
                                                    <div class="mr-3 mb-3 p-2 border rounded bg-white text-center shadow-sm" style="min-width: 100px;">
                                                        <i class="fas fa-database mb-1 <?= $compatibility['mysqli'] ? 'text-success' : 'text-danger' ?>"></i>
                                                        <div class="small font-weight-bold">MySQLi</div>
                                                        <span class="badge badge-<?= $compatibility['mysqli'] ? 'success' : 'danger' ?> p-1" style="font-size: 10px;"><?= $compatibility['mysqli'] ? 'Active' : 'Missing' ?></span>
                                                    </div>
                                                    <div class="mr-3 mb-3 p-2 border rounded bg-white text-center shadow-sm" style="min-width: 100px;">
                                                        <i class="fas fa-file-archive mb-1 <?= $compatibility['zip'] ? 'text-success' : 'text-danger' ?>"></i>
                                                        <div class="small font-weight-bold">ZipArchive</div>
                                                        <span class="badge badge-<?= $compatibility['zip'] ? 'success' : 'danger' ?> p-1" style="font-size: 10px;"><?= $compatibility['zip'] ? 'Ready' : 'Missing' ?></span>
                                                    </div>
                                                    <div class="mr-3 mb-3 p-2 border rounded bg-white text-center shadow-sm" style="min-width: 100px;">
                                                        <i class="fas fa-key mb-1 <?= $compatibility['writable'] ? 'text-success' : 'text-danger' ?>"></i>
                                                        <div class="small font-weight-bold">Permissions</div>
                                                        <span class="badge badge-<?= $compatibility['writable'] ? 'success' : 'danger' ?> p-1" style="font-size: 10px;"><?= $compatibility['writable'] ? 'Writable' : 'Locked' ?></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Disk Utilization -->
                                            <div class="col-md-3 border-right text-center">
                                                <h6 class="font-weight-bold text-muted mb-3 small text-uppercase">Disk Utilization</h6>
                                                <?php
                                                $used_bytes = floatval(str_replace(['GB', 'MB', 'KB', 'B', ' '], '', $disk['data']));
                                                $free_bytes = floatval(str_replace(['GB', 'MB', 'KB', 'B', ' '], '', $disk['free']));
                                                $total = $used_bytes + $free_bytes;
                                                $percent = ($total > 0) ? round(($used_bytes / $total) * 100) : 0;
                                                ?>
                                                <div class="h4 font-weight-bold mb-1"><?= $percent ?>%</div>
                                                <div class="progress mb-2" style="height: 10px;">
                                                    <div class="progress-bar bg-primary" role="progressbar" style="width: <?= $percent ?>%"></div>
                                                </div>
                                                <div class="small text-muted"><?= $disk['free'] ?> Available</div>
                                            </div>

                                            <!-- Metric Summary -->
                                            <div class="col-md-5">
                                                <h6 class="font-weight-bold text-muted mb-3 small text-uppercase">Storage Metrics</h6>
                                                <div class="row no-gutters">
                                                    <div class="col-6 mb-3 px-2">
                                                        <div class="p-2 border-left border-primary" style="background: #f8fafc;">
                                                            <div class="text-muted small">Payload Size</div>
                                                            <div class="h6 mb-0 font-weight-bold"><?= $disk['data'] ?></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 mb-3 px-2">
                                                        <div class="p-2 border-left border-info" style="background: #f8fafc;">
                                                            <div class="text-muted small">Buffer Required</div>
                                                            <div class="h6 mb-0 font-weight-bold"><?= $disk['required'] ?></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <?php if ($disk['low_space']): ?>
                                                    <div class="alert alert-danger py-2 small mb-0 d-flex align-items-center">
                                                        <i class="fas fa-exclamation-triangle mr-2"></i>
                                                        <span><strong>System Alert:</strong> Cleanup required! Free up at least <?= $disk['diff'] ?>.</span>
                                                    </div>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <!-- Database Backup Card -->
                            <div class="col-md-6">
                                <div class="card card-primary">
                                    <div class="card-header border-bottom text-center">
                                        <i class="fas fa-database text-primary mr-2"></i>
                                        <h4 class="font-weight-bold">Database Backup</h4><small>Standard SQL export for database synchronization.</small>
                                    </div>
                                    <div class="card-body">
                                        <button id="startDbBackup" class="btn btn-primary btn-block btn-lg mb-4" <?= ($disk['low_space'] || !$compatibility['mysqli'] || !$compatibility['writable']) ? 'disabled' : '' ?>>
                                            <i class="fas fa-rocket mr-2"></i> <?= ($disk['low_space']) ? 'Insufficient Space' : 'Start Database Backup' ?>
                                        </button>

                                        <div id="dbProgressArea" style="display:none" class="mb-4">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="font-weight-bold small text-primary">Status: Processing...</span>
                                                <span id="dbPercent" class="badge badge-primary">0%</span>
                                            </div>
                                            <div class="progress mb-3" style="height: 10px;">
                                                <div id="dbBar" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" style="width: 0%;"></div>
                                            </div>

                                            <div id="dbConsole" class="p-3 bg-dark text-white rounded mb-3" style="font-family: monospace; font-size: 0.8rem; height: 120px; overflow-y: auto;">
                                                <div class="log-entry">[<?= date('H:i:s') ?>] System ready for export...</div>
                                            </div>

                                            <div class="d-flex justify-content-between align-items-center mt-3">
                                                <small id="dbStatus" class="text-muted small">Waiting...</small>
                                                <button id="cancelDbBackup" class="btn btn-link text-danger p-0 small font-weight-bold text-uppercase">Cancel Process</button>
                                            </div>
                                        </div>

                                        <div id="dbMessage" class="mb-3"></div>

                                        <h6 class="font-weight-bold text-muted small text-uppercase mb-3 mt-4">History</h6>
                                        <div class="table-responsive">
                                            <table class="table table-sm table-hover mb-0">
                                                <tbody id="dbBackupList">
                                                    <?php if (!empty($db_backups)): ?>
                                                        <?php foreach ($db_backups as $index => $backup): ?>
                                                            <tr id="row-db-<?= str_replace('.', '-', $backup['name']) ?>">
                                                                <td class="px-0">
                                                                    <div class="d-flex justify-content-between align-items-center">
                                                                        <div class="d-flex align-items-center">
                                                                            <div class="p-2 mr-3 text-primary">
                                                                                <i class="fas fa-file-code fa-lg"></i>
                                                                            </div>
                                                                            <div>
                                                                                <span class="font-weight-bold text-dark d-block"><?= $backup['name'] ?><?php if ($index === 0): ?><span class="badge badge-info ml-2" style="font-size: 10px; padding: 2px 6px;">Latest</span><?php endif; ?></span>
                                                                                <small class="text-muted"><?= $backup['date'] ?> <span class="mx-1">•</span> <?= $backup['size'] ?></small>
                                                                            </div>
                                                                        </div>
                                                                        <div class="btn-group history-actions">
                                                                            <a href="<?= base_url('backups/db_data/' . $backup['name']) ?>" class="btn btn-outline-success border-0" title="Download" download><i class="fas fa-cloud-download-alt"></i></a>
                                                                            <button type="button" class="btn btn-outline-danger border-0" title="Delete" onclick="deleteBackup('<?= $backup['name'] ?>', 'db')"><i class="fas fa-trash-alt"></i></button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        <?php endforeach; ?>
                                                    <?php else: ?>
                                                        <tr>
                                                            <td class="text-center py-4 text-muted">No database backups found</td>
                                                        </tr>
                                                    <?php endif; ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Assets Backup Card -->
                            <div class="col-md-6">
                                <div class="card card-primary">
                                    <div class="card-header border-bottom text-center">
                                        <i class="fas fa-file-archive text-primary mr-2"></i>
                                        <h4 class="font-weight-bold">Assets Backup</h4> <small>File repository compression and archiving.</small>
                                    </div>
                                    <div class="card-body">
                                        <button id="startAssetsBackup" class="btn btn-primary btn-block btn-lg mb-4" <?= ($disk['low_space'] || !$compatibility['zip'] || !$compatibility['writable']) ? 'disabled' : '' ?>>
                                            <i class="fas fa-archive mr-2"></i> <?= ($disk['low_space']) ? 'Insufficient Space' : 'Start Assets Backup' ?>
                                        </button>

                                        <?php if ($active_assets_session): ?>
                                            <div id="resumePrompt" class="alert alert-info py-2 small mb-4 border-0 shadow-sm" style="border-radius: 10px;">
                                                <div class="d-flex align-items-center">
                                                    <i class="fas fa-history mr-2 fa-lg"></i>
                                                    <div>Interrupted session detected.</div>
                                                    <div class="ml-auto">
                                                        <button class="btn btn-sm btn-info py-1 px-3" onclick="startAssetsBackup(false)">Resume</button>
                                                        <button class="btn btn-sm btn-light border py-1 ml-1 px-3" onclick="startAssetsBackup(true)">Reset</button>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php endif; ?>

                                        <div id="assetsProgressArea" style="display:none" class="mb-4">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="font-weight-bold small text-primary">Status: Syncing...</span>
                                                <span id="assetsPercent" class="badge badge-primary">0%</span>
                                            </div>
                                            <div class="progress mb-3" style="height: 10px;">
                                                <div id="assetsBar" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" style="width: 0%;"></div>
                                            </div>

                                            <div id="assetsConsole" class="p-3 bg-dark text-white rounded mb-3" style="font-family: monospace; font-size: 0.8rem; height: 120px; overflow-y: auto;">
                                                <div class="log-entry">[<?= date('H:i:s') ?>] Archive engine initialized...</div>
                                            </div>

                                            <div class="d-flex justify-content-between align-items-center mt-3">
                                                <small id="assetsStatus" class="text-muted small">Waiting...</small>
                                                <button id="cancelAssetsBackup" class="btn btn-link text-danger p-0 small font-weight-bold text-uppercase">Cancel Process</button>
                                            </div>
                                        </div>
                                        <div id="assetsMessage" class="mb-3"></div>

                                        <h6 class="font-weight-bold text-muted small text-uppercase mb-3 mt-4">History</h6>
                                        <div class="table-responsive">
                                            <table class="table table-sm table-hover mb-0">
                                                <tbody id="assetsBackupList">
                                                    <?php if (!empty($assets_backups)): ?>
                                                        <?php foreach ($assets_backups as $index => $backup): ?>
                                                            <tr id="row-assets-<?= str_replace('.', '-', $backup['name']) ?>">
                                                                <td class="px-0">
                                                                    <div class="d-flex justify-content-between align-items-center">
                                                                        <div class="d-flex align-items-center">
                                                                            <div class="p-2 mr-3 text-primary">
                                                                                <i class="fas fa-box-open fa-lg"></i>
                                                                            </div>
                                                                            <div>
                                                                                <span class="font-weight-bold text-dark d-block"><?= $backup['name'] ?><?php if ($index === 0): ?><span class="badge badge-info ml-2" style="font-size: 10px; padding: 2px 6px;">Latest</span><?php endif; ?></span>
                                                                                <small class="text-muted"><?= $backup['date'] ?> <span class="mx-1">•</span> <?= $backup['size'] ?></small>
                                                                            </div>
                                                                        </div>
                                                                        <div class="btn-group history-actions">
                                                                            <a href="<?= base_url('backups/assets_data/' . $backup['name']) ?>" class="btn btn-outline-success border-0" title="Download" download><i class="fas fa-cloud-download-alt"></i></a>
                                                                            <button type="button" class="btn btn-outline-danger border-0" title="Delete" onclick="deleteBackup('<?= $backup['name'] ?>', 'assets')"><i class="fas fa-trash-alt"></i></button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        <?php endforeach; ?>
                                                    <?php else: ?>
                                                        <tr>
                                                            <td class="text-center py-4 text-muted">No asset backups found</td>
                                                        </tr>
                                                    <?php endif; ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    <?php include 'footer.php'; ?>
    <script>
        let running = false;
        let dbRunning = false;
        let processTimer = null;

        function addLog(consoleId, message, status = 'info') {
            const consoleObj = document.getElementById(consoleId);
            if (!consoleObj) return;
            const time = new Date().toLocaleTimeString();
            const entry = `<div class="log-entry">
                <span class="timestamp">[${time}]</span> 
                <span class="status-${status}">${message}</span>
            </div>`;
            consoleObj.insertAdjacentHTML('beforeend', entry);
            consoleObj.scrollTop = consoleObj.scrollHeight;
        }

        function toggleHistoryActions(disable) {
            if (disable) {
                $(".history-actions a, .history-actions button").addClass("disabled").css("pointer-events", "none").css("opacity", "0.5");
            } else {
                $(".history-actions a, .history-actions button").removeClass("disabled").css("pointer-events", "auto").css("opacity", "1");
            }
        }

        // Warning when leaving page during backup
        window.onbeforeunload = function(e) {
            if (running || dbRunning) {
                e.preventDefault();
                e.returnValue = '';
                return 'Backup is in progress. Are you sure you want to leave?';
            }
        };

        // Database Backup Logic
        $("#startDbBackup").click(function() {
            Swal.fire({
                title: 'Start database backup?',
                text: "Recommended before any updates. This will generate a chunked SQL dump.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, start!'
            }).then((result) => {
                if (result.isConfirmed) {
                    toggleHistoryActions(true);
                    $("#startDbBackup").prop("disabled", true).addClass("btn-progress").html('<i class="fas fa-spinner fa-spin mr-2"></i> Initializing...');
                    $("#startAssetsBackup").prop("disabled", true);
                    $("#dbProgressArea").fadeIn()
                    $("#dbMessage").html("")
                    $("#dbStatus").html("Initializing database export...")
                    addLog('dbConsole', 'Handshake initiated with SQL Engine...', 'info');

                    $.post("<?= site_url('backup/start_db') ?>", function(res) {
                        if (res.status === "error") {
                            $("#dbMessage").html('<div class="alert alert-danger">' + res.message + '</div>')
                            $("#startDbBackup").removeClass("btn-progress").html('<i class="fas fa-rocket mr-2"></i> Start Database Backup').prop("disabled", false);
                            $("#dbProgressArea").hide()
                            addLog('dbConsole', 'ERROR: ' + res.message, 'danger');
                            return
                        }
                        dbRunning = true
                        addLog('dbConsole', 'Payload metadata received. Total Tables: ' + res.total_tables, 'ok');
                        processDbChunk()
                    }, "json").fail(function() {
                        $("#dbMessage").html('<div class="alert alert-danger">Failed to start DB backup.</div>')
                        $("#startDbBackup").removeClass("btn-progress").html('<i class="fas fa-rocket mr-2"></i> Initiate DB Payload').prop("disabled", false);
                        addLog('dbConsole', 'CRITICAL ERROR: Connection failure.', 'danger');
                    })
                }
            })
        })

        function processDbChunk() {
            if (!dbRunning) return

            $.post("<?= site_url('backup/process_db_chunk') ?>", function(res) {
                if (res.status === "error") {
                    dbRunning = false
                    $("#dbMessage").html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle mr-2"></i>' + res.message + '</div>')
                    $("#startDbBackup").removeClass("btn-progress").html('<i class="fas fa-rocket mr-2"></i> Initiate DB Payload').prop("disabled", false);
                    $("#dbProgressArea").fadeOut()
                    addLog('dbConsole', 'PROCESS HALTED: ' + res.message, 'danger');
                    return
                }

                if (res.status === "cancelled") {
                    dbRunning = false
                    $("#dbMessage").html('<div class="alert alert-warning">Database backup cancelled.</div>')
                    $("#startDbBackup").removeClass("btn-progress").html('<i class="fas fa-rocket mr-2"></i> Start Database Backup').prop("disabled", false);
                    $("#dbProgressArea").fadeOut()
                    addLog('dbConsole', 'CANCELLED: Session terminated by user.', 'info');
                    return
                }

                let percent = res.percent || 0
                $("#dbBar").css("width", percent + "%")
                $("#dbPercent").html(percent + "%")
                $("#dbStatus").html("Exporting tables... " + res.processed_tables + " / " + res.total_tables + " (ETD: " + (res.etd || '...') + ")");

                if (res.last_table) {
                    addLog('dbConsole', `Exported: ${res.last_table} (${percent}%)`, 'ok');
                }

                if (res.done) {
                    dbRunning = false
                    $("#dbStatus").html('<i class="fas fa-check-circle mr-1"></i> Completed!')
                    addLog('dbConsole', 'FINALIZING: Payload secured. Success.', 'ok');
                    $("#dbMessage").html('<div class="alert alert-success d-flex align-items-center"><i class="fas fa-check-circle mr-2 fa-lg"></i> <div><strong>Success!</strong> Database backup finished safely!</div></div>')
                    setTimeout(() => window.location.reload(), 1500)
                    return
                }

                let delay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
                setTimeout(processDbChunk, delay);
            }, "json").fail(function() {
                dbRunning = false
                $("#dbMessage").html('<div class="alert alert-danger d-flex align-items-center"><i class="fas fa-times-circle mr-2 fa-lg"></i> <div><strong>Error!</strong> Connection lost during DB backup.</div></div>')
                $("#startDbBackup").removeClass("btn-progress").html('<i class="fas fa-rocket mr-2"></i> Start Database Backup').prop("disabled", false);
                addLog('dbConsole', 'RETRY FAILED: Connection lost.', 'danger');
            })
        }

        $("#cancelDbBackup").click(function() {
            let btn = $(this);
            Swal.fire({
                title: 'Terminate process?',
                text: "Partial payload will be purged. Are you sure?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, terminate'
            }).then((result) => {
                if (result.isConfirmed) {
                    dbRunning = false;
                    btn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin"></i>')
                    addLog('dbConsole', 'Aborting process... Sanitizing environment.', 'info');
                    $.post("<?= site_url('backup/cancel_db') ?>", function() {
                        window.location.reload();
                    })
                }
            })
        })

        // Assets Backup Logic
        $("#startAssetsBackup").click(function() {
            Swal.fire({
                title: 'Initiate Asset Backup?',
                text: "This will archive the repository. For large datasets, this may take several minutes.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Start Archive'
            }).then((result) => {
                if (result.isConfirmed) {
                    startAssetsBackup(true);
                }
            })
        });

        function startAssetsBackup(restart = true) {
            toggleHistoryActions(true);
            $("#startAssetsBackup").prop("disabled", true).addClass("btn-progress").html('<i class="fas fa-spinner fa-spin mr-2"></i> Processing...');
            $("#startDbBackup").prop("disabled", true);
            $("#resumePrompt").hide();
            $("#assetsProgressArea").show();
            $("#assetsBar").css("width", "0%");
            $("#assetsPercent").html("0%");
            $("#assetsStatus").html(restart ? "Initializing..." : "Resuming...");
            $("#assetsMessage").html("");
            running = true;

            addLog('assetsConsole', restart ? 'Starting fresh archive session...' : 'Resuming previous archive session...', 'info');

            $.post("<?= site_url('backup/start_assets') ?>", {
                restart: restart
            }, function(res) {
                if (res.status === "error") {
                    Swal.fire({
                        title: 'Backup Error',
                        text: res.message,
                        icon: 'error'
                    });
                    $("#startAssetsBackup").removeClass("btn-progress").html('<i class="fas fa-archive mr-2"></i> Start Assets Backup').prop("disabled", false);
                    $("#assetsProgressArea").hide();
                    running = false;
                    toggleHistoryActions(false);
                    addLog('assetsConsole', 'ERROR: ' + res.message, 'danger');
                    return;
                }

                addLog('assetsConsole', `Scan complete. Total files: ${res.total_files}`, 'ok');
                processAssets();
            }, "json").fail(function() {
                $("#assetsMessage").html('<div class="alert alert-danger">Failed to communicate with sync manager.</div>');
                $("#startAssetsBackup").removeClass("btn-progress").html('<i class="fas fa-archive mr-2"></i> Start Assets Backup').prop("disabled", false);
                running = false;
                addLog('assetsConsole', 'CRITICAL ERROR: API unreachable.', 'danger');
            });
        }

        function processAssets() {
            if (!running) return;

            $.post("<?= site_url('backup/process_assets_chunk') ?>", function(res) {
                if (res.status === "error") {
                    running = false;
                    $("#assetsMessage").html('<div class="alert alert-danger"><i class="fas fa-exclamation-circle mr-2"></i>' + res.message + '</div>');
                    $("#startAssetsBackup").removeClass("btn-progress").html('<i class="fas fa-archive mr-2"></i> Initiate Asset Backup').prop("disabled", false);
                    addLog('assetsConsole', 'BACKUP HALTED: ' + res.message, 'danger');
                    return;
                }

                if (res.status === "merging") {
                    addLog('assetsConsole', 'Phasing complete. Starting master merge...', 'info');
                    pollMergeChunks();
                    return;
                }

                if (res.done) {
                    handleAssetsComplete(res);
                    return;
                }

                let percent = res.percent || 0;
                $("#assetsBar").css("width", percent + "%");
                $("#assetsPercent").html(percent + "%");
                $("#assetsStatus").html(`Processing: ${res.processed} / ${res.total} (ETD: ${res.etd || '...'})`);

                if (res.current_file) {
                    let folder = res.current_file.split('/')[0];
                    if (window.lastFolder !== folder) {
                        addLog('assetsConsole', `Syncing folder: ${folder}...`, 'info');
                        window.lastFolder = folder;
                    }
                }

                let delay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
                setTimeout(processAssets, delay);
            }, "json").fail(function() {
                setTimeout(processAssets, 2000);
                $("#assetsStatus").html('<span class="text-warning">Uplink unstable, retrying...</span>');
                addLog('assetsConsole', 'Uplink unstable, retrying connection...', 'info');
            });
        }

        $("#cancelAssetsBackup").click(function() {
            let btn = $(this);
            Swal.fire({
                title: 'Abort Backup?',
                text: "Partial fragments will be discarded. Are you sure?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, Abort'
            }).then((result) => {
                if (result.isConfirmed) {
                    running = false;
                    btn.prop("disabled", true).html('<i class="fas fa-spinner fa-spin"></i>')
                    addLog('assetsConsole', 'Aborting backup session...', 'info');
                    $.post("<?= site_url('backup/cancel_assets') ?>", function() {
                        window.location.reload();
                    })
                }
            })
        })

        let mergeRetryCount = 0;

        function pollMergeChunks() {
            if (!running) return;
            $("#assetsStatus").html('Finalizing: Merging fragments...');

            $.ajax({
                url: "<?= site_url('backup/merge_assets_chunks') ?>",
                type: 'POST',
                dataType: 'json',
                success: function(res) {
                    mergeRetryCount = 0;

                    if (res.status === "error") {
                        running = false;
                        $("#assetsMessage").html('<div class="alert alert-danger">Merge Error: ' + res.message + '</div>');
                        $("#startAssetsBackup").removeClass("btn-progress").html('<i class="fas fa-archive mr-2"></i> Initiate Asset Backup').prop("disabled", false);
                        addLog('assetsConsole', 'MERGE ERROR: ' + res.message, 'danger');
                        return;
                    }

                    if (res.done) {
                        handleAssetsComplete(res);
                        return;
                    }

                    let mergePercent = Math.round((res.processed_chunks / res.total_chunks) * 100);
                    addLog('assetsConsole', `Merging fragment ${res.processed_chunks} of ${res.total_chunks} (${mergePercent}%)`, 'info');

                    let delay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
                    setTimeout(pollMergeChunks, delay);
                },
                error: function(xhr) {
                    if (xhr.status === 503 || xhr.status === 504 || xhr.status === 500) {
                        mergeRetryCount++;
                        if (mergeRetryCount <= 5) {
                            $("#assetsStatus").html(`Server busy (503), retrying in 5s... (${mergeRetryCount}/5)`);
                            addLog('assetsConsole', `Server busy (503), retry ${mergeRetryCount}/5...`, 'info');
                            setTimeout(pollMergeChunks, 3000);
                            return;
                        }
                    }
                    setTimeout(pollMergeChunks, 3000);
                }
            });
        }

        function handleAssetsComplete(res) {
            running = false;
            $("#assetsBar").css("width", "100%");
            $("#assetsPercent").html("100%");
            $("#assetsStatus").html('<i class="fas fa-check-circle mr-1"></i> Completed!');
            addLog('assetsConsole', 'BACKUP COMPLETE: Repository archived successfully.', 'ok');
            $("#assetsMessage").html('<div class="alert alert-success d-flex align-items-center"><i class="fas fa-check-circle mr-2 fa-lg"></i> <div><strong>Success!</strong> Repository sync finalized safely!</div></div>');
            setTimeout(() => window.location.reload(), 2000);
        }

        function deleteBackup(filename, type) {
            Swal.fire({
                title: 'Delete Backup Entry?',
                text: "This will permanently remove the ZIP payload!",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, Delete Payload'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.post("<?= site_url('backup/delete_backup') ?>", {
                        file: filename,
                        type: type
                    }, function(res) {
                        if (res.status === "success") {
                            window.location.reload();
                        } else {
                            Swal.fire('Registry Error', res.message, 'error');
                        }
                    }, "json")
                }
            })
        }

        // Refresh after download to keep disk info in sync
        $(document).on("click", ".download-backup", function() {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });
    </script>
</body>

</html>