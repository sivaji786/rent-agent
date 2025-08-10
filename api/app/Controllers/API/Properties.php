<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PropertyModel;
use App\Services\JwtService;

class Properties extends ResourceController
{
    protected $modelName = 'App\Models\PropertyModel';
    protected $format = 'json';

    private JwtService $jwtService;
    private PropertyModel $propertyModel;

    public function __construct()
    {
        $this->jwtService = new JwtService();
        $this->propertyModel = new PropertyModel();
    }

    /**
     * Get user from JWT token
     */
    private function getAuthenticatedUser()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $authHeader);
        return $this->jwtService->decode($token);
    }

    /**
     * List all properties for authenticated user
     */
    public function index()
    {
        try {
            $user = $this->getAuthenticatedUser();
            
            // For now, return all properties. Later add role-based filtering
            $properties = $this->propertyModel->findAll();
            
            return $this->respond($properties);
            
        } catch (\Exception $e) {
            return $this->fail('Unauthorized', 401);
        }
    }

    /**
     * Create a new property
     */
    public function store()
    {
        try {
            $user = $this->getAuthenticatedUser();
            
            $rules = [
                'name' => 'required|max_length[255]',
                'address' => 'required|max_length[500]',
                'type' => 'in_list[residential,commercial,mixed_use]',
                'totalUnits' => 'required|integer|greater_than[0]'
            ];

            if (!$this->validate($rules)) {
                return $this->fail($this->validator->getErrors(), 400);
            }

            $data = $this->request->getJSON(true);
            $data['ownerId'] = $user->user_id;

            $propertyId = $this->propertyModel->insert($data);
            
            if (!$propertyId) {
                return $this->fail('Failed to create property', 500);
            }

            $property = $this->propertyModel->find($propertyId);
            
            return $this->respond([
                'message' => 'Property created successfully',
                'property' => $property
            ], 201);
            
        } catch (\Exception $e) {
            return $this->fail('Unauthorized', 401);
        }
    }

    /**
     * Get a specific property
     */
    public function show($id = null)
    {
        try {
            $user = $this->getAuthenticatedUser();
            
            $property = $this->propertyModel->find($id);
            
            if (!$property) {
                return $this->fail('Property not found', 404);
            }

            return $this->respond($property);
            
        } catch (\Exception $e) {
            return $this->fail('Unauthorized', 401);
        }
    }

    /**
     * Update a property
     */
    public function update($id = null)
    {
        try {
            $user = $this->getAuthenticatedUser();
            
            $property = $this->propertyModel->find($id);
            
            if (!$property) {
                return $this->fail('Property not found', 404);
            }

            $rules = [
                'name' => 'max_length[255]',
                'address' => 'max_length[500]',
                'type' => 'in_list[residential,commercial,mixed_use]',
                'totalUnits' => 'integer|greater_than[0]'
            ];

            if (!$this->validate($rules)) {
                return $this->fail($this->validator->getErrors(), 400);
            }

            $data = $this->request->getJSON(true);
            
            if (!$this->propertyModel->update($id, $data)) {
                return $this->fail('Failed to update property', 500);
            }

            $property = $this->propertyModel->find($id);
            
            return $this->respond([
                'message' => 'Property updated successfully',
                'property' => $property
            ]);
            
        } catch (\Exception $e) {
            return $this->fail('Unauthorized', 401);
        }
    }

    /**
     * Delete a property
     */
    public function delete($id = null)
    {
        try {
            $user = $this->getAuthenticatedUser();
            
            $property = $this->propertyModel->find($id);
            
            if (!$property) {
                return $this->fail('Property not found', 404);
            }

            if (!$this->propertyModel->delete($id)) {
                return $this->fail('Failed to delete property', 500);
            }
            
            return $this->respond(['message' => 'Property deleted successfully']);
            
        } catch (\Exception $e) {
            return $this->fail('Unauthorized', 401);
        }
    }
}