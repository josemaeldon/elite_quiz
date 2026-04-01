<?php

class Database
{

    function create_tables($data)
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
            return false;
        }

        $dsn = "pgsql:host={$servername};port={$port};dbname={$database}";
        try {
            $pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5,
            ]);
        } catch (PDOException $e) {
            error_log('Installer: DB connection failed: ' . $e->getMessage());
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
            $pdo->exec($query);
        } catch (PDOException $e) {
            error_log('Installer: Schema execution failed: ' . $e->getMessage());
            return false;
        }

        return true;
    }
}
