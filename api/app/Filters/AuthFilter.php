<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Services\JwtService;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $jwtService = new JwtService();
        
        $authHeader = $request->getHeaderLine('Authorization');
        if (empty($authHeader)) {
            return services('response')->setStatusCode(401)->setJSON([
                'error' => 'Unauthorized',
                'message' => 'No authorization header provided'
            ]);
        }

        $token = str_replace('Bearer ', '', $authHeader);
        
        try {
            $decoded = $jwtService->decode($token);
            $request->user = $decoded;
            return null;
        } catch (\Exception $e) {
            return services('response')->setStatusCode(401)->setJSON([
                'error' => 'Unauthorized',
                'message' => 'Invalid or expired token'
            ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing to do here
    }
}