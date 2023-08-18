<?php
require 'vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require 'PrivateChat.php'; // Include the PrivateChat.php file

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new PrivateChat()
        )
    ),
    8089
);

$server->run();
