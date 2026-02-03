# Vending Machine Dispenser - Tauri Desktop App

A desktop application built with Tauri and vanilla JavaScript for a vending machine game.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)

### First Time Setup

Run the automated setup:

```bash
setup-tauri.bat
```

Or manually:

```bash
# Install dependencies
npm install

# Create application icons
powershell -ExecutionPolicy Bypass -File create-icons.ps1
```

### Development Mode

```bash
npm run dev
```

This starts the Tauri application with hot-reload enabled.

### Build for Production

```bash
npm run build
```

The built application will be in `src-tauri/target/release/bundle/`

## 📁 Project Structure

```
vending-machine-dispenser/
├── src/                    # Frontend source files
│   ├── index.html         # Main entry point
│   ├── pages/             # Game pages (instruction, game, finish, etc.)
│   ├── assets/            # Assets
│   │   ├── css/          # Stylesheets
│   │   ├── js/           # JavaScript files
│   │   ├── images/       # Images
│   │   ├── audio/        # Sound effects
│   │   ├── fonts/        # Custom fonts
│   │   └── dutch/        # Language-specific assets
│   └── vendor/           # Third-party libraries (Phaser.js)
├── src-tauri/            # Tauri Rust backend
│   ├── src/
│   │   └── main.rs       # Rust entry point
│   ├── Cargo.toml        # Rust dependencies
│   ├── tauri.conf.json   # Tauri configuration
│   ├── build.rs          # Build script
│   └── icons/            # Application icons
├── package.json          # Node.js dependencies and scripts
├── create-icons.ps1      # Icon generation script
├── setup-tauri.bat       # Automated setup script
└── README.md            # This file
```

## 🎮 Features

- Full-screen kiosk mode support
- Interactive game with falling objects (apples, bananas, carrots, eggs, milk)
- Score tracking with individual item counters
- Multi-language support (English/Malay and Chinese)
- Audio feedback for interactions
- Runs as standalone desktop application (no web server needed)

## ⚙️ Configuration

### Tauri Configuration

Edit `src-tauri/tauri.conf.json` to customize:

**Window Settings:**

```json
{
  "app": {
    "windows": [
      {
        "title": "Vending Machine Dispenser",
        "width": 1920,
        "height": 1080,
        "fullscreen": false,
        "resizable": true,
        "decorations": true
      }
    ]
  }
}
```

**For Kiosk Mode (fullscreen, no decorations):**

```json
{
  "fullscreen": true,
  "resizable": false,
  "decorations": false
}
```

### Application Icons

**Option 1: Automatic (from existing image):**

```bash
cargo tauri icon path/to/your/icon.png
```

**Option 2: PowerShell script (placeholder icons):**

```bash
powershell -ExecutionPolicy Bypass -File create-icons.ps1
```

**Option 3: Manual:**
Place PNG/ICO files in `src-tauri/icons/`:

- `32x32.png` (32×32)
- `128x128.png` (128×128)
- `128x128@2x.png` (256×256)
- `icon.png` (512×512)
- `icon.ico` (Windows)
- `icon.icns` (macOS)

## 📦 Building for Distribution

### Windows

```bash
npm run build
```

Output: `src-tauri/target/release/bundle/msi/` (installer) or `/nsis/` (setup.exe)

### Portable Executable

Find `.exe` in: `src-tauri/target/release/`

### macOS

```bash
npm run build
```

Output: `src-tauri/target/release/bundle/macos/` (.app bundle)

### Linux

```bash
npm run build
```

Output: `src-tauri/target/release/bundle/` (.deb, .AppImage, or .rpm)

## 🔧 Scripts

| Command                 | Description             |
| ----------------------- | ----------------------- |
| `npm run dev`           | Start development mode  |
| `npm run build`         | Build production bundle |
| `npm run tauri`         | Run Tauri CLI commands  |
| `setup-tauri.bat`       | First-time setup wizard |
| `start-tauri-kiosk.bat` | Run in kiosk mode       |

## 🎯 Tauri Advantages

- ✅ **Lightweight**: Much smaller than Electron (~3-5 MB vs 100+ MB)
- ✅ **Fast**: Better performance using native WebView
- ✅ **Secure**: Built with Rust, sandboxed environment
- ✅ **Cross-platform**: Windows, macOS, Linux from same codebase
- ✅ **No server needed**: Runs as standalone desktop app
- ✅ **Easy distribution**: Single executable or installer

## 🐛 Troubleshooting

### Error: "npm run dev" fails

**Check prerequisites:**

```bash
node --version   # Should be v20+
rustc --version  # Should show Rust version
```

**Reinstall dependencies:**

```bash
npm install
```

### Error: Missing icons

Run:

```bash
powershell -ExecutionPolicy Bypass -File create-icons.ps1
```

### First build is very slow

The first Rust compilation takes 5-10 minutes as it compiles all dependencies. Subsequent builds are much faster (seconds).

### Port already in use (dev mode)

Change port in `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "devUrl": "http://localhost:8081"
  }
}
```

## 📚 Resources

- [Tauri Documentation](https://tauri.app/)
- [Tauri Configuration Reference](https://tauri.app/v1/api/config/)
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Rust Documentation](https://doc.rust-lang.org/)

## 🔄 Migration from Web Version

This project was converted from a web-based application (XAMPP/Apache) to a Tauri desktop application:

**Removed:**

- ❌ PHP backend files
- ❌ Apache/MySQL dependencies
- ❌ Dispenser logging system
- ❌ Web server requirement

**Added:**

- ✅ Tauri Rust backend
- ✅ Standalone executable
- ✅ Native OS integration
- ✅ Desktop distribution

The game logic, UI, and assets remain unchanged!

## 📄 License

MIT
