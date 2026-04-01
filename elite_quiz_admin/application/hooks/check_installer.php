<?php

class Check_installer {

    function check_for_installer() {
        if (file_exists(FCPATH . 'install/index.php')) {
            $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
            $host   = $_SERVER['SERVER_NAME'];
            $base   = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
            header('Location: ' . $scheme . '://' . $host . $base . '/install/');
            exit();
        }
    }

}
