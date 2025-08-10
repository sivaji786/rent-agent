<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        // Serve the React frontend
        return view('app');
    }
}
