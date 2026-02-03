# Simple icon placeholder creation script
# This creates basic PNG icons for Tauri

$iconDir = "src-tauri\icons"

# Create a simple colored square for placeholder icons
function Create-PlaceholderIcon {
    param($size, $filename)
    
    $imagePath = Join-Path $iconDir $filename
    
    # Using PowerShell to create a simple colored bitmap
    Add-Type -AssemblyName System.Drawing
    
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with blue background
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(74, 144, 226))
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # Add text "VM"
    $font = New-Object System.Drawing.Font("Arial", [int]($size / 4), [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $graphics.DrawString("VM", $font, $textBrush, $rect, $format)
    
    $bitmap.Save($imagePath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created $filename ($size x $size)"
}

Write-Host "Creating placeholder icons for Tauri..."

Create-PlaceholderIcon 32 "32x32.png"
Create-PlaceholderIcon 128 "128x128.png"
Create-PlaceholderIcon 256 "128x128@2x.png"
Create-PlaceholderIcon 512 "icon.png"

Write-Host "`nPlaceholder icons created successfully!"
Write-Host "Note: For production, replace these with proper icons using:"
Write-Host "  cargo tauri icon path/to/your/icon.png"
