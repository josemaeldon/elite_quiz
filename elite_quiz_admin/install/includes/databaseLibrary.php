<?php

class Database
{

    private function connect($data)
    {
        $servername = $data['hostname'];
        $username   = $data['username'];
        $password   = $data['password'];
        $database   = $data['database'];
        $port       = isset($data['port']) && $data['port'] !== '' ? (int) $data['port'] : 5432;

        // Basic validation to prevent DSN injection
        if (!preg_match('/^[a-zA-Z0-9._\-]+$/', $servername) ||
            !preg_match('/^[a-zA-Z0-9_\-]+$/', $database) ||
            $port < 1 || $port > 65535) {
            return null;
        }

        $dsn = "pgsql:host={$servername};port={$port};dbname={$database}";
        try {
            $pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5,
            ]);
            return $pdo;
        } catch (PDOException $e) {
            error_log('Installer: DB connection failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Returns true if the target database already has tables, false otherwise.
     * Returns null if the connection could not be established.
     */
    function database_has_tables($data)
    {
        $pdo = $this->connect($data);
        if ($pdo === null) {
            return null;
        }

        try {
            $stmt = $pdo->query(
                "SELECT COUNT(*) FROM information_schema.tables
                  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
            );
            $count = (int) $stmt->fetchColumn();
            return $count > 0;
        } catch (PDOException $e) {
            error_log('Installer: table check failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Creates the database tables and the initial admin account.
     *
     * @param array $data      Form data (hostname, username, password, database, port, admin_*)
     * @param bool  $overwrite When true, the existing schema is dropped before import.
     */
    function create_tables($data, $overwrite = false)
    {
        $pdo = $this->connect($data);
        if ($pdo === null) {
            return false;
        }

        $schemaFile = '../database/postgres_schema.sql';
        if (!file_exists($schemaFile)) {
            // No schema file available; connection verified, config will be written
            return true;
        }

        $query = file_get_contents($schemaFile);
        if ($query === false) {
            return false;
        }

        try {
            if ($overwrite) {
                $pdo->exec("DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;");
            }
            $pdo->exec($query);
        } catch (PDOException $e) {
            error_log('Installer: Schema execution failed: ' . $e->getMessage());
            return false;
        }

        // Insert the super administrator account
        $admin_username = substr(trim($data['admin_username'] ?? ''), 0, 12);
        $admin_password = $data['admin_password'] ?? '';
        if ($admin_username !== '' && $admin_password !== '') {
            // Allow only alphanumeric characters and underscores for the username
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $admin_username)) {
                error_log('Installer: invalid admin username characters');
                return false;
            }
            $admin_pass_hash = password_hash($admin_password, PASSWORD_DEFAULT);
            $now = date('Y-m-d H:i:s');
            $stmt = $pdo->prepare(
                "INSERT INTO tbl_authenticate (auth_username, auth_pass, role, permissions, status, language, created)
                 VALUES (:username, :pass, 'admin', '', 1, 'english', :created)"
            );
            $stmt->execute([
                ':username' => $admin_username,
                ':pass'     => $admin_pass_hash,
                ':created'  => $now,
            ]);
        }

        return true;
    }
}
