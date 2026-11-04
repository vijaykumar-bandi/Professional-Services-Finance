<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FirmLedger</title>
    @php(app(Illuminate\Foundation\Vite::class)->useHotFile(env('VITE_HOT_FILE', public_path('hot'))))
    @vite(['resources/css/app.css', 'resources/js/app.ts'])
</head>
<body><div id="app"></div></body>
</html>
