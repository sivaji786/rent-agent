<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'email',
        'firstName',
        'lastName',
        'profileImageUrl',
        'passwordHash',
        'authProvider',
        'role',
        'resetToken',
        'resetTokenExpiry'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'createdAt';
    protected $updatedField = 'updatedAt';

    protected $validationRules = [
        'email' => 'required|valid_email|is_unique[users.email,id,{id}]',
        'role' => 'in_list[admin,manager,owner,tenant,staff]'
    ];

    protected $validationMessages = [
        'email' => [
            'required' => 'Email is required',
            'valid_email' => 'Please provide a valid email address',
            'is_unique' => 'This email is already registered'
        ]
    ];

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->first();
    }

    /**
     * Find user by reset token
     */
    public function findByResetToken(string $token): ?array
    {
        return $this->where('resetToken', $token)
                   ->where('resetTokenExpiry >', date('Y-m-d H:i:s'))
                   ->first();
    }

    /**
     * Clear reset token
     */
    public function clearResetToken(string $userId): bool
    {
        return $this->update($userId, [
            'resetToken' => null,
            'resetTokenExpiry' => null
        ]);
    }

    /**
     * Generate a unique ID for new users
     */
    protected function generateId(): string
    {
        return uniqid('user_', true);
    }

    /**
     * Before insert callback
     */
    protected function beforeInsert(array $data): array
    {
        if (!empty($data['data']['password'])) {
            $data['data']['passwordHash'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
            unset($data['data']['password']);
        }

        $data['data']['createdAt'] = date('Y-m-d H:i:s');
        $data['data']['updatedAt'] = date('Y-m-d H:i:s');

        return $data;
    }

    /**
     * Before update callback
     */
    protected function beforeUpdate(array $data): array
    {
        if (!empty($data['data']['password'])) {
            $data['data']['passwordHash'] = password_hash($data['data']['password'], PASSWORD_DEFAULT);
            unset($data['data']['password']);
        }

        $data['data']['updatedAt'] = date('Y-m-d H:i:s');

        return $data;
    }
}