<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    DB::select('select 1');

    return response()->json([
        'status' => 'ok',
        'releaseId' => env('RELEASE_ID', 'local'),
    ]);
});

foreach (glob(__DIR__.'/api/*.php') ?: [] as $routeFile) {
    require $routeFile;
}
