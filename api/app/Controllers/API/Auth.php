<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Services\JwtService;

class Auth extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format = 'json';

    private JwtService $jwtService;
    private UserModel $userModel;

    public function __construct()
    {
        $this->jwtService = new JwtService();
        $this->userModel = new UserModel();
    }

    /**
     * Register a new user
     */
    public function register()
    {
        $rules = [
            'email' => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[8]',
            'firstName' => 'max_length[255]',
            'lastName' => 'max_length[255]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        
        $userData = [
            'email' => $data['email'],
            'password' => $data['password'], // Will be hashed in model
            'firstName' => $data['firstName'] ?? null,
            'lastName' => $data['lastName'] ?? null,
            'authProvider' => 'manual',
            'role' => 'tenant'
        ];

        $userId = $this->userModel->insert($userData);
        if (!$userId) {
            return $this->fail('Failed to create user', 500);
        }

        $user = $this->userModel->find($userId);
        if (!$user) {
            return $this->fail('User creation failed', 500);
        }
        unset($user['passwordHash']); // Don't return password hash

        $token = $this->jwtService->encode([
            'user_id' => $user['id'], 
            'email' => $user['email'],
            'iss' => 'prolits-api',
            'aud' => 'prolits-client'
        ]);

        return $this->respond([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    /**
     * Login user
     */
    public function login()
    {
        $rules = [
            'email' => 'required|valid_email',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || !password_verify($data['password'], $user['passwordHash'])) {
            return $this->fail('Invalid email or password', 401);
        }

        unset($user['passwordHash']); // Don't return password hash
        
        $token = $this->jwtService->encode(['user_id' => $user['id'], 'email' => $user['email']]);

        return $this->respond([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (empty($authHeader)) {
            return $this->fail('No authorization header provided', 401);
        }

        $token = str_replace('Bearer ', '', $authHeader);
        
        try {
            $decoded = $this->jwtService->decode($token);
            $user = $this->userModel->find($decoded->user_id);
            
            if (!$user) {
                return $this->fail('User not found', 404);
            }

            unset($user['passwordHash']);
            return $this->respond($user);
            
        } catch (\Exception $e) {
            return $this->fail('Invalid or expired token', 401);
        }
    }

    /**
     * Logout user (client-side token removal)
     */
    public function logout()
    {
        return $this->respond(['message' => 'Logged out successfully']);
    }

    /**
     * Forgot password - send reset token
     */
    public function forgotPassword()
    {
        $rules = ['email' => 'required|valid_email'];
        
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || $user['authProvider'] !== 'manual') {
            // Don't reveal if user exists for security
            return $this->respond(['message' => 'If the email exists, a reset link has been sent']);
        }

        $resetToken = bin2hex(random_bytes(32));
        $expiry = date('Y-m-d H:i:s', time() + 24 * 3600); // 24 hours

        $this->userModel->update($user['id'], [
            'resetToken' => $resetToken,
            'resetTokenExpiry' => $expiry
        ]);

        // In production, send actual email. For now, log to console
        log_message('info', "Password reset token for {$data['email']}: {$resetToken}");
        
        return $this->respond(['message' => 'If the email exists, a reset link has been sent']);
    }

    /**
     * Verify reset token
     */
    public function verifyResetToken($token)
    {
        $user = $this->userModel->findByResetToken($token);
        
        if (!$user) {
            return $this->fail('Invalid or expired reset token', 400);
        }

        return $this->respond(['message' => 'Reset token is valid', 'valid' => true]);
    }

    /**
     * Reset password with token
     */
    public function resetPassword()
    {
        $rules = [
            'token' => 'required',
            'password' => 'required|min_length[8]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $data = $this->request->getJSON(true);
        $user = $this->userModel->findByResetToken($data['token']);

        if (!$user) {
            return $this->fail('Invalid or expired reset token', 400);
        }

        // Update password and clear reset token
        $this->userModel->update($user['id'], [
            'password' => $data['password'], // Will be hashed in model
            'resetToken' => null,
            'resetTokenExpiry' => null
        ]);

        return $this->respond(['message' => 'Password reset successful']);
    }
}