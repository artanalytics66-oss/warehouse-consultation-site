<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Auth');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Настройки подключения к MySQL
$host = '127.0.0.1';
$port = 3310;
$dbname = 'u3333975_default';
$username = 'u3333975_default';
$password = 'LIGa8tM1562U8Jxs';

// Подключение к БД
try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$adminAuth = $_SERVER['HTTP_X_ADMIN_AUTH'] ?? '';

// Проверка авторизации для POST/PUT/DELETE
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    if ($adminAuth !== 'admin66L:123QWE!asd') {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// Обработка методов
try {
    if ($method === 'GET') {
        // Получить все статьи
        $stmt = $pdo->query('SELECT * FROM blog_articles ORDER BY created_at DESC');
        $articles = $stmt->fetchAll();
        echo json_encode($articles, JSON_UNESCAPED_UNICODE);
        
    } elseif ($method === 'POST') {
        // Создать статью
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare('INSERT INTO blog_articles (title, category, short_description, full_content, image_url) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['title'],
            $data['category'],
            $data['short_description'],
            $data['full_content'],
            $data['image_url'] ?? ''
        ]);
        
        $id = $pdo->lastInsertId();
        http_response_code(201);
        echo json_encode(['id' => $id, 'message' => 'Article created'], JSON_UNESCAPED_UNICODE);
        
    } elseif ($method === 'PUT') {
        // Обновить статью
        $data = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $pdo->prepare('UPDATE blog_articles SET title=?, category=?, short_description=?, full_content=?, image_url=? WHERE id=?');
        $stmt->execute([
            $data['title'],
            $data['category'],
            $data['short_description'],
            $data['full_content'],
            $data['image_url'] ?? '',
            $data['id']
        ]);
        
        echo json_encode(['message' => 'Article updated'], JSON_UNESCAPED_UNICODE);
        
    } elseif ($method === 'DELETE') {
        // Удалить статью
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Article ID required'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $stmt = $pdo->prepare('DELETE FROM blog_articles WHERE id=?');
        $stmt->execute([$id]);
        
        echo json_encode(['message' => 'Article deleted'], JSON_UNESCAPED_UNICODE);
        
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
