<?php
// error_reporting(0);
$db_config_path = '../application/config/database.php';

// Block access if already installed (flag persists on the Docker volume)
if (file_exists('/var/lib/elite_quiz_admin/.installed')) {
    header('Location: /');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST) {

    require_once('taskClass.php');
    require_once('includes/databaseLibrary.php');

    $core = new Core();
    $database = new Database();

    $admin_username   = trim($_POST['admin_username'] ?? '');
    $admin_password   = $_POST['admin_password'] ?? '';
    $admin_confirm    = $_POST['admin_confirm_password'] ?? '';

    if (!empty($_POST['hostname']) && !empty($_POST['username']) && !empty($_POST['database'])) {
        if (empty($admin_username)) {
            $message = $core->show_message('error', 'Admin username is required.');
        } elseif (strlen($admin_username) > 12) {
            $message = $core->show_message('error', 'Admin username must be at most 12 characters.');
        } elseif (!preg_match('/^[a-zA-Z0-9_]+$/', $admin_username)) {
            $message = $core->show_message('error', 'Admin username may only contain letters, numbers, and underscores.');
        } elseif (empty($admin_password)) {
            $message = $core->show_message('error', 'Admin password is required.');
        } elseif (strlen($admin_password) < 6) {
            $message = $core->show_message('error', 'Admin password must be at least 6 characters.');
        } elseif ($admin_password !== $admin_confirm) {
            $message = $core->show_message('error', 'Admin passwords do not match.');
        } else {
            $overwrite_db = $_POST['overwrite_db'] ?? '';

            // Check whether the target database already contains tables
            $db_has_tables = $database->database_has_tables($_POST);

            if ($db_has_tables === true && $overwrite_db === '') {
                // Database already exists – ask the user what to do
                $db_exists_prompt = true;
                $message = $core->show_message('warning', 'A database already exists at the specified location. Please choose how to proceed below.');
            } else {
                if ($core->write_config($_POST) == false) {
                    $message = $core->show_message('error', "The database configuration file could not be written, please chmod application/config/database.php file to 755");
                }

                if ($overwrite_db === 'keep') {
                    // Keep the existing database as-is; only the config needs to be written
                } else {
                    // 'replace' or fresh install – import the schema
                    $overwrite = ($overwrite_db === 'replace');
                    if ($database->create_tables($_POST, $overwrite) == false) {
                        $message = $core->show_message('error', "The database could not be created, make sure your the host, username, password, database name is correct.");
                    }
                }

                if ($core->checkFile() == false) {
                    $message = $core->show_message('error', "File application/config/database.php is Empty");
                }
                if (!isset($message)) {
                    $urlWb = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                    $urlWb = str_replace('install/index.php', '', $urlWb);
                    $urlWb = str_replace('install/', '', $urlWb);
                    $core->delete_directory('../install/');
?>
                <script type="text/javascript">
                    $('#install_form').hide();
                </script>
<?php
                    $type = 'success';
                    $message = $core->show_message('success', 'Congrats! Installation is successful. Please wait redirecting you to the main page in seconds.. .');
                    header('Refresh:5; url=' . $urlWb);
                }
            }
        }
    } else {
        $message = $core->show_message('error', 'The host, username, password, database name required.');
    }
}
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Installer</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="assets/style.css" rel="stylesheet">
</head>

<body class="bg-theme">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-9 py-4">
                <div class="card p-3">
                    <h3 class="text-center">Elite Quiz Installer</h3>
                    <hr>
                    <?php
                    if (is_writable($db_config_path)) {
                        if (isset($message)) {
                            if (isset($type) && $type == 'success') {
                    ?>
                                <div class="alert alert-success alert-dismissible" role="alert">
                                    <?= $message; ?>
                                </div>
                            <?php } elseif (isset($db_exists_prompt) && $db_exists_prompt) { ?>
                                <div class="alert alert-warning" role="alert">
                                    <strong>Database Already Exists</strong><br>
                                    <?= $message; ?>
                                </div>
                                <form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                                    <?php foreach (['hostname','port','database','username','password','admin_username','admin_password','admin_confirm_password'] as $field): ?>
                                        <input type="hidden" name="<?= htmlspecialchars($field); ?>" value="<?= htmlspecialchars($_POST[$field] ?? ''); ?>">
                                    <?php endforeach; ?>
                                    <div class="form-group">
                                        <div class="form-check mb-2">
                                            <input class="form-check-input" type="radio" name="overwrite_db" id="overwrite_keep" value="keep" checked>
                                            <label class="form-check-label" for="overwrite_keep">
                                                <strong>Keep existing database</strong> — preserve all current data and only write the configuration file.
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="overwrite_db" id="overwrite_replace" value="replace">
                                            <label class="form-check-label" for="overwrite_replace">
                                                <strong>Replace with new database</strong> — <span class="text-danger">drop all existing data</span> and import a fresh schema.
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Continue</button>
                                </form>
                            <?php } else { ?>
                                <div class="alert alert-danger alert-dismissible" role="alert">
                                    <?= $message; ?>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                        <?php
                            }
                        }
                        ?>
                        <form class="" id="install_form" method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                            <div id="wizard_verticle" class="form_wizard wizard_horizontal">
                                <ul class="list-unstyled wizard_steps">
                                    <li><a href="#step-1"><span class="step_no">1</span></a></li>
                                    <li><a href="#step-2"><span class="step_no">2</span></a></li>
                                    <li><a href="#step-3"><span class="step_no">3</span></a></li>
                                </ul>

                                <div id="step-1">
                                    <div class="col-md-12">
                                        <h5 class="text-center">Check Server Requirement</h5>
                                        <div class="form-group border p-2">
                                            <?php
                                            $value1 = 8.1;
                                            $value2 = 8.2;
                                            $current = phpversion();
                                            $current_major_minor = (float) substr($current, 0, 3);
                                            ?>
                                            <label class="control-label">PHP Version (>= <?= $value1; ?> & <= <?= $value2; ?>)</label>
                                                    <label class="checkboxone">
                                                        <input type="checkbox" disabled value="<?= ($value1 <= $current_major_minor && $current_major_minor <= $value2) ? '1' : '0' ?>" name="php_version" <?= ($value1 <= $current_major_minor && $current_major_minor <= $value2) ? 'checked' : '' ?> required>
                                                        <label class="checkboxInput"> </label>
                                                    </label>
                                        </div>
                                        <div class="form-group border p-2">
                                            <?php $openssl_extension = extension_loaded('openssl'); ?>
                                            <label class="control-label">OpenSSL PHP Extension</label>
                                            <label class="checkboxone">
                                                <input type="checkbox" disabled value="<?= ($openssl_extension) ? '1' : '0' ?>" name="openssl_extension" <?= ($openssl_extension) ? 'checked' : '' ?> required>
                                                <label class="checkboxInput"> </label>
                                            </label>
                                        </div>
                                        <div class="form-group border p-2">
                                            <?php $zip_extension = extension_loaded('zip'); ?>
                                            <label class="control-label">ZipArchive Extension</label>
                                            <label class="checkboxone">
                                                <input type="checkbox" disabled value="<?= ($zip_extension) ? '1' : '0' ?>" name="zip_extension" <?= ($zip_extension) ? 'checked' : '' ?> required>
                                                <label class="checkboxInput"> </label>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div id="step-2">
                                    <div class="col-md-12">
                                        <div class="outer_div">
                                            <div class="form-group row">
                                                <div class="col-md-12">
                                                    <div class="check_server_req">
                                                        <h6>Database Connection</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <label>Database Hostname <small class="text-danger">*</small></label>
                                                    <input name="hostname" type="text" id="hostname" value="localhost" class="form-control" required placeholder="Your Hostname" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label>Database Port <small class="text-danger">*</small></label>
                                                    <input name="port" type="number" id="port" value="5432" class="form-control" required placeholder="5432" />
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <label>Database Name <small class="text-danger">*</small></label>
                                                    <input name="database" type="text" id="database" class="form-control" required placeholder="Your Database Name" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label>Database Username <small class="text-danger">*</small></label>
                                                    <input name="username" type="text" id="username" class="form-control" required placeholder="Your Username" />
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <label>Database Password</label>
                                                    <input name="password" type="password" id="password" class="form-control" placeholder="Your Password" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="step-3">
                                    <div class="col-md-12">
                                        <div class="outer_div">
                                            <div class="form-group row">
                                                <div class="col-md-12">
                                                    <div class="check_server_req">
                                                        <h6>Create Super Administrator</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-12">
                                                    <label>Admin Username <small class="text-danger">*</small></label>
                                                    <input name="admin_username" type="text" id="admin_username" class="form-control" required maxlength="12" pattern="[a-zA-Z0-9_]+" placeholder="e.g. admin" />
                                                    <small class="text-muted">Maximum 12 characters. Letters, numbers, and underscores only.</small>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <label>Password <small class="text-danger">*</small></label>
                                                    <input name="admin_password" type="password" id="admin_password" class="form-control" required minlength="6" placeholder="Minimum 6 characters" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label>Confirm Password <small class="text-danger">*</small></label>
                                                    <input name="admin_confirm_password" type="password" id="admin_confirm_password" class="form-control" required minlength="6" placeholder="Repeat your password" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </form>
                    <?php
                    } else {
                    ?>
                        <p class="alert alert-danger">
                            Please make the application/config/database.php file writable.<br>
                            <strong>Example</strong>:<br />
                            <code>chmod 755 application/config/database.php</code>
                        </p>
                    <?php
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="assets/jquery.smartWizard.js"></script>
    <script src="assets/smartWizard-validation.js"></script>

    <script type="text/javascript">
        $(document).ready(function() {
            $("body").on("contextmenu", function(e) {
                return false;
            });

            // Client-side password confirmation check before submit
            $('#install_form').on('submit', function(e) {
                var pw = $('#admin_password').val();
                var confirm = $('#admin_confirm_password').val();
                if (pw && confirm && pw !== confirm) {
                    e.preventDefault();
                    alert('Admin passwords do not match.');
                    return false;
                }
            });
        });
        $(document).keydown(function(e) {
            if (e.keyCode == 123) {
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
                return false;
            }
            if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
                return false;
            }
            if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
                return false;
            }
        });
        $(document).ready(function() {
            $('body').bind('selectstart', function(e) {
                e.preventDefault();
            });
        });
    </script>


</body>

</html>
