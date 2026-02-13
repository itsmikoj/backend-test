export const getDeferredDeepLinkHTML = (
  storeUrl: string,
  deepLinkUrl: string,
  appName: string
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting to ${appName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      border: 4px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 4px solid white;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .message {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    .sub-message {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  </style>
  <script>
    // Intentar abrir la app
    window.location.href = "${deepLinkUrl}";
    
    // Si no abre en 2.5 segundos, ir a la store
    setTimeout(function() {
      window.location.href = "${storeUrl}";
    }, 2500);
  </script>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <div class="message">Opening ${appName}...</div>
    <div class="sub-message">If the app doesn't open, you'll be redirected to the store</div>
  </div>
</body>
</html>
  `;
};