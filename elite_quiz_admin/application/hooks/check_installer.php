<?php

class Check_installer {

    function check_for_installer() {
        if (file_exists(FCPATH . 'install/index.php')) {
            // If the system is already installed, skip the installer redirect.
            // This handles cases where an update package re-extracts the install/ directory.
            if (file_exists(PERSISTENT_DIR . '/.installed')) {
                return;
            }
            $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
            $host   = $_SERVER['SERVER_NAME'];
            $base   = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
            header('Location: ' . $scheme . '://' . $host . $base . '/install/');
            exit();
        }
    }

}
