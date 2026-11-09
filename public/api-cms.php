<?php
/**
 * S.A Treinamento — Persistência Flat-File JSON para o Painel CMS (/painel)
 * Compatível com qualquer hospedagem PHP (Apache / cPanel / FileZilla) sem precisar de banco MySQL.
 * Todos os dados editados no /painel ficam gravados no arquivo "dados-site.json" na mesma pasta.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/dados-site.json';

// GET: Retorna os dados atuais do site gravados no servidor
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        if ($content !== false && strlen(trim($content)) > 2) {
            echo $content;
            exit;
        }
    }
    echo json_encode(['status' => 'default']);
    exit;
}

// POST: Salva as alterações feitas no /painel diretamente em dados-site.json no servidor
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $decoded = json_decode($rawInput, true);

    if ($decoded === null || !is_array($decoded)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'JSON inválido']);
        exit;
    }

    // Se vier com { "action": "reset" }, remove o arquivo customizado para voltar ao padrão original
    if (isset($decoded['action']) && $decoded['action'] === 'reset') {
        if (file_exists($dataFile)) {
            @unlink($dataFile);
        }
        echo json_encode(['ok' => true, 'reset' => true]);
        exit;
    }

    // Grava o JSON formatado no servidor com trava de escrita (LOCK_EX)
    $written = file_put_contents(
        $dataFile,
        json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );

    if ($written === false) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'error' => 'Sem permissão de escrita na pasta. Verifique a permissão (CHMOD 755/775) no FileZilla.'
        ]);
        exit;
    }

    echo json_encode(['ok' => true, 'bytes' => $written]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Método não permitido']);
