<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();

// API Routes
$routes->group('api', ['namespace' => 'App\Controllers\API'], static function ($routes) {
    
    // Auth routes
    $routes->group('auth', static function ($routes) {
        $routes->post('login', 'Auth::login');
        $routes->post('register', 'Auth::register');
        $routes->post('logout', 'Auth::logout');
        $routes->get('user', 'Auth::user');
        $routes->post('forgot-password', 'Auth::forgotPassword');
        $routes->post('reset-password', 'Auth::resetPassword');
        $routes->get('verify-reset-token/(:segment)', 'Auth::verifyResetToken/$1');
    });

    // Protected routes (require authentication)
    $routes->group('', ['filter' => 'auth'], static function ($routes) {
        
        // Properties
        $routes->group('properties', static function ($routes) {
            $routes->get('', 'Properties::index');
            $routes->post('', 'Properties::store');
            $routes->get('(:segment)', 'Properties::show/$1');
            $routes->put('(:segment)', 'Properties::update/$1');
            $routes->delete('(:segment)', 'Properties::delete/$1');
        });

        // Dashboard
        $routes->get('dashboard/stats', 'Dashboard::stats');
        
    });
});

// Frontend routes (serve React app)
$routes->get('/', 'Home::index');
$routes->get('(:any)', 'Home::index');
