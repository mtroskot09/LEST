<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo e(config('app.name', 'LEST')); ?></title>
    <link rel="stylesheet" href="<?php echo e(asset('assets/index-BvsYfqPT.css')); ?>">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="<?php echo e(asset('assets/index-B7jNW3_O.js')); ?>"></script>
</body>
</html>
<?php /**PATH /Users/mtroskot09/DIV/lest/laravel/resources/views/app.blade.php ENDPATH**/ ?>