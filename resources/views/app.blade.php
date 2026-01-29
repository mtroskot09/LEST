<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'LEST') }}</title>
    <link rel="stylesheet" href="{{ asset('assets/index-BvsYfqPT.css') }}">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="{{ asset('assets/index-B7jNW3_O.js') }}"></script>
</body>
</html>
