# JAMB CBT Practice Engine - Offline Local Server (Windows Native)
# Powered by Rila Solutions
# Runs 100% offline without Node.js, Python, or Internet connection.

$port = 5000
$baseDir = Join-Path $PSScriptRoot "dist"

if (-not (Test-Path $baseDir)) {
    Write-Host "[ERROR] 'dist' folder not found. Please ensure the app is extracted completely." -ForegroundColor Red
    Pause
    exit
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    $port = 5050
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Host "========================================================" -ForegroundColor Green
Write-Host "     JAMB CBT PRACTICE EXAM ENGINE - OFFLINE PRO       " -ForegroundColor Green
Write-Host "               Powered by Rila Solutions               " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Server running at: http://localhost:$port/" -ForegroundColor Cyan
Write-Host "Opening your browser now... (Keep this window open while practicing)" -ForegroundColor White
Write-Host ""

# Launch Edge or default browser in app mode
$url = "http://localhost:$port/"
Start-Process $url

$mimeMap = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".json" = "application/json; charset=utf-8"
    ".webmanifest" = "application/manifest+json"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($path) -or $path -eq "/") {
            $path = "index.html"
        }

        $filePath = Join-Path $baseDir $path

        # If file not found, fallback to index.html (SPA routing)
        if (-not (Test-Path $filePath)) {
            $filePath = Join-Path $baseDir "index.html"
        }

        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
        $response.ContentType = $contentType
        $response.AddHeader("Cache-Control", "no-cache")

        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
    } catch {
        # continue handling requests
    }
}
