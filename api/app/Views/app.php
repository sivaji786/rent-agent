<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prolits - Property Management</title>
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <?php if (ENVIRONMENT === 'development'): ?>
        <script type="module" src="http://localhost:5173/@vite/client"></script>
        <script type="module" src="http://localhost:5173/src/main.tsx"></script>
    <?php else: ?>
        <!-- Production assets will be served by Vite build -->
        <link rel="stylesheet" href="/assets/index.css">
        <script type="module" src="/assets/index.js"></script>
    <?php endif; ?>
</head>
<body>
    <div id="root"></div>
</body>
</html>