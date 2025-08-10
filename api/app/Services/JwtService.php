<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JwtService
{
    private string $key;
    private string $algorithm = 'HS256';
    private int $ttl = 3600; // 1 hour

    public function __construct()
    {
        $this->key = env('JWT_SECRET_KEY', 'your-super-secret-jwt-key-change-this-in-production');
        $this->ttl = (int) env('JWT_TIME_TO_LIVE', 3600);
    }

    /**
     * Generate a JWT token for a user
     */
    public function encode(array $payload): string
    {
        $payload['iat'] = time(); // Issued at
        $payload['exp'] = time() + $this->ttl; // Expiration
        
        return JWT::encode($payload, $this->key, $this->algorithm);
    }

    /**
     * Decode and validate a JWT token
     */
    public function decode(string $token): object
    {
        try {
            return JWT::decode($token, new Key($this->key, $this->algorithm));
        } catch (Exception $e) {
            throw new Exception('Invalid or expired token: ' . $e->getMessage());
        }
    }

    /**
     * Generate a refresh token (longer TTL)
     */
    public function encodeRefresh(array $payload): string
    {
        $payload['iat'] = time();
        $payload['exp'] = time() + (7 * 24 * 3600); // 7 days
        $payload['type'] = 'refresh';
        
        return JWT::encode($payload, $this->key, $this->algorithm);
    }
}