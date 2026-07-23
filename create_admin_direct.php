<?php
/**
 * Direct admin creation script - không cần composer/framework
 * Usage: php create_admin_direct.php
 */

// Database connection from env vars
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbPort = getenv('DB_PORT') ?: 3306;
$dbName = getenv('DB_DATABASE') ?: 'forge';
$dbUser = getenv('DB_USERNAME') ?: 'root';
$dbPass = getenv('DB_PASSWORD') ?: '';

try {
    // Connect to MySQL
    $pdo = new PDO(
        "mysql:host={$dbHost};port={$dbPort};dbname={$dbName}",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Hash password using bcrypt (Laravel's default)
    $email = 'admin@luxefashion.com';
    $password = 'Admin@123456';
    $name = 'Admin User';
    $phone = '0123456789';
    
    // Use password_hash for bcrypt (Laravel compatible)
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();
    
    if ($existing) {
        // Update existing
        $stmt = $pdo->prepare(
            "UPDATE users SET is_admin = 1, password = ?, updated_at = NOW() WHERE email = ?"
        );
        $stmt->execute([$hashedPassword, $email]);
        echo "✅ Admin user updated!\n";
    } else {
        // Create new
        $stmt = $pdo->prepare(
            "INSERT INTO users (name, email, password, phone, is_admin, email_verified_at, created_at, updated_at) 
             VALUES (?, ?, ?, ?, 1, NOW(), NOW(), NOW())"
        );
        $stmt->execute([$name, $email, $hashedPassword, $phone]);
        echo "✅ Admin user created!\n";
    }
    
    echo "Email: {$email}\n";
    echo "Password: {$password}\n";
    echo "Phone: {$phone}\n";
    echo "Name: {$name}\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>

