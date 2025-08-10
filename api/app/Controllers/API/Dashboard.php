<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PropertyModel;
use App\Services\JwtService;

class Dashboard extends ResourceController
{
    protected $format = 'json';

    private JwtService $jwtService;
    private PropertyModel $propertyModel;

    public function __construct()
    {
        $this->jwtService = new JwtService();
        $this->propertyModel = new PropertyModel();
    }

    /**
     * Get dashboard statistics
     */
    public function stats()
    {
        try {
            $authHeader = $this->request->getHeaderLine('Authorization');
            $token = str_replace('Bearer ', '', $authHeader);
            $user = $this->jwtService->decode($token);
            
            // Get basic stats
            $totalProperties = $this->propertyModel->countAll();
            $totalUnits = $this->db->table('properties')->selectSum('totalUnits')->get()->getRow()->totalUnits ?? 0;
            
            $stats = [
                'totalRevenue' => 0, // Will be calculated from payments later
                'occupiedUnits' => '0', // Will be calculated from leases later
                'totalProperties' => $totalProperties,
                'totalUnits' => $totalUnits,
                'maintenanceRequests' => 0, // Will be calculated from maintenance_requests later
                'pendingPayments' => 0 // Will be calculated from payments later
            ];
            
            return $this->respond($stats);
            
        } catch (\Exception $e) {
            return $this->fail('Unauthorized', 401);
        }
    }
}