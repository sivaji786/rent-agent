<?php

namespace App\Models;

use CodeIgniter\Model;

class PropertyModel extends Model
{
    protected $table = 'properties';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = false; // We use UUIDs
    protected $returnType = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'id',
        'ownerId',
        'name',
        'address',
        'type',
        'totalUnits',
        'description'
    ];

    protected $useTimestamps = true;
    protected $createdField = 'createdAt';
    protected $updatedField = 'updatedAt';

    protected $validationRules = [
        'name' => 'required|max_length[255]',
        'address' => 'required|max_length[500]',
        'type' => 'in_list[residential,commercial,mixed_use]',
        'totalUnits' => 'required|integer|greater_than[0]'
    ];

    protected $validationMessages = [
        'name' => [
            'required' => 'Property name is required'
        ],
        'address' => [
            'required' => 'Property address is required'
        ],
        'totalUnits' => [
            'required' => 'Total units is required',
            'greater_than' => 'Total units must be at least 1'
        ]
    ];

    /**
     * Get properties for a specific owner
     */
    public function getByOwner(string $ownerId): array
    {
        return $this->where('ownerId', $ownerId)->findAll();
    }

    /**
     * Generate a unique ID for new properties
     */
    protected function generateId(): string
    {
        return uniqid('prop_', true);
    }

    /**
     * Before insert callback
     */
    protected function beforeInsert(array $data): array
    {
        if (empty($data['data']['id'])) {
            $data['data']['id'] = $this->generateId();
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
        $data['data']['updatedAt'] = date('Y-m-d H:i:s');
        return $data;
    }
}