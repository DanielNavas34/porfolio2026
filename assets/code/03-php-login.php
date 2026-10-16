<?php
// login.php
require_once 'config/database.php';
require_once 'includes/security.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$error = '';
// Umbrales separados para evitar bloquear redes compartidas (CG-NAT)
$max_intentos_email = 5;
$max_intentos_ip = 20;
$ip = $_SERVER['REMOTE_ADDR'];
$mensaje_bloqueo = "Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente, inténtelo de nuevo en unos minutos.";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Comprobamos si el token viene en el POST antes de verificarlo para evitar el Fatal Error de PHP
    if (!isset($_POST['csrf_token']) || empty($_POST['csrf_token']) || !verifyCSRFToken($_POST['csrf_token'])) {
        die("Error de validación CSRF. Por favor, recarga la página y vuelve a intentarlo.");
    }

    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $db = getDBConnection();

    // 1. Validar el formato del email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Credenciales incorrectas.";
    } else {
        // 2. Control de Fuerza Bruta y Password Spraying (solo contamos los últimos 5 minutos)
        $stmt_ip = $db->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip = :ip AND fecha_intento >= (NOW() - INTERVAL 5 MINUTE)");
        $stmt_ip->execute(['ip' => $ip]);
        $fallos_ip = $stmt_ip->fetchColumn();

        $stmt_email = $db->prepare("SELECT COUNT(*) FROM login_attempts WHERE email = :email AND fecha_intento >= (NOW() - INTERVAL 5 MINUTE)");
        $stmt_email->execute(['email' => $email]);
        $fallos_email = $stmt_email->fetchColumn();

        // Si supera CUALQUIERA de los umbrales, muere con el mensaje unificado
        if ($fallos_ip >= $max_intentos_ip || $fallos_email >= $max_intentos_email) {
            die($mensaje_bloqueo);
        }

        // 3. Consulta de los datos del usuario
        $stmt = $db->prepare("SELECT id, nombre, password, rol, activo, email_verificado, tipo_perfil FROM usuarios WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        // 4. Prevención de Timing Attacks (Tiempo de respuesta constante)
        $dummy_hash = '$2y$10$usesomesillystringfore2uDLvq1Dp/kMwHQI.e.T9.T/1y4Dq';
        $password_valida = false;

        if ($user) {
            $password_valida = password_verify($password, $user['password']);
        } else {
            password_verify($password, $dummy_hash);
        }

        if ($user && $password_valida) {
            // Login exitoso: Borramos los fallos específicos de este usuario desde esta IP
            $db->prepare("DELETE FROM login_attempts WHERE ip = :ip AND email = :email")->execute(['ip' => $ip, 'email' => $email]);

            if (!$user['email_verificado']) {
                $_SESSION['email_rescate'] = $email;
                header("Location: registro.php");
                exit;
            } elseif (!$user['activo']) {
                $error = "Tu cuenta está desactivada. Contacta con la administración del club.";
            } else {
                session_regenerate_id(true);
                $_SESSION['usuario_id'] = $user['id'];
                $_SESSION['nombre'] = $user['nombre'];
                $_SESSION['rol'] = $user['rol'];
                $_SESSION['tipo_perfil'] = $user['tipo_perfil'];

                // 5. Prevención estricta de Open Redirect
                if (isset($_SESSION['redirect_after_login'])) {
                    $url_destino = $_SESSION['redirect_after_login'];
                    unset($_SESSION['redirect_after_login']);

                    $parsed = parse_url($url_destino);
                    if (empty($parsed['scheme']) && empty($parsed['host']) && strpos($url_destino, '//') === false) {
                        header("Location: " . $url_destino);
                    } else {
                        header("Location: usuario/dashboard.php");
                    }
                } elseif ($user['rol'] === 'admin') {
                    header("Location: admin/dashboard.php");
                } elseif ($user['tipo_perfil'] === 'solo_torneo') {
                    header("Location: usuario/mis_torneos.php");
                } else {
                    header("Location: usuario/dashboard.php");
                }
                exit;
            }
        } else {
            // Login fallido: Insertamos el fallo
            $sql_fail = "INSERT INTO login_attempts (ip, email) VALUES (:ip, :email)";
            $db->prepare($sql_fail)->execute(['ip' => $ip, 'email' => $email]);

            if (($fallos_ip + 1) >= $max_intentos_ip || ($fallos_email + 1) >= $max_intentos_email) {
                $error = $mensaje_bloqueo;
            } else {
                $error = "Credenciales incorrectas.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="assets/css/style.css?v=<?= filemtime('assets/css/style.css') ?>">
</head>
<body class="bg-tennis">
    <div class="auth-container glass-overlay">
        <form id="loginForm" method="POST" action="login.php" class="auth-form modern-form">
            <div class="form-header">
                <h2>Acceso a la Liga</h2>
                <p>Introduce tus credenciales para continuar</p>
            </div>

            <?php if ($error): ?>
                <div class="alert alert-error"><?= sanitizeOutput($error) ?></div>
            <?php endif; ?>

            <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">

            <div class="form-group modern-input">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" required autocomplete="username">
            </div>

            <div class="form-group modern-input">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-primary btn-block">Entrar</button>
        </form>
    </div>
</body>
</html>
