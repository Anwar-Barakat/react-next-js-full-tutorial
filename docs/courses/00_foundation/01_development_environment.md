# Development Environment Setup

Setting up your development environment properly is crucial for a smooth learning experience. This lecture will guide you through installing all the necessary tools for full-stack web development.

---

## Learning Objectives

- Install and configure Visual Studio Code
- Install Git for version control
- Install Node.js and npm
- Install PHP and Composer
- Install MySQL database
- Verify all installations
- Configure your terminal/shell

---

## Prerequisites

- A computer with Windows, macOS, or Linux
- Administrator/sudo access to install software
- Stable internet connection
- About 1-2 hours for complete setup

---

## Why Proper Setup Matters

A well-configured development environment:
- ✅ Prevents common beginner errors
- ✅ Increases productivity with proper tools
- ✅ Matches industry standards
- ✅ Makes debugging easier
- ✅ Enables you to follow along with lectures

---

## Part 1: Visual Studio Code (Code Editor)

### What is VS Code?

Visual Studio Code (VS Code) is a free, powerful code editor created by Microsoft. It's the most popular editor for web development because it:
- Has excellent syntax highlighting
- Supports thousands of extensions
- Includes built-in Git integration
- Has intelligent code completion
- Works on all operating systems

### Installation

**macOS**:
1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Click "Download for Mac"
3. Open the downloaded `.dmg` file
4. Drag VS Code to Applications folder
5. Launch VS Code from Applications

**Windows**:
1. Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Click "Download for Windows"
3. Run the installer
4. Follow the wizard (use default options)
5. Check "Add to PATH" option
6. Launch VS Code

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install software-properties-common apt-transport-https wget
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
sudo apt update
sudo apt install code
```

### Essential Extensions

Install these extensions by clicking the Extensions icon (or Cmd/Ctrl+Shift+X):

1. **ESLint** - JavaScript linting
2. **Prettier** - Code formatter
3. **PHP Intelephense** - PHP support
4. **Laravel Blade Snippets** - Laravel templating
5. **ES7+ React/Redux/React-Native snippets** - React shortcuts
6. **Tailwind CSS IntelliSense** - Tailwind autocomplete
7. **GitLens** - Enhanced Git integration
8. **Auto Rename Tag** - HTML/JSX tag helper
9. **Bracket Pair Colorizer** - Visual bracket matching
10. **Live Server** - Development server for HTML/CSS/JS

### Recommended Settings

Open settings (Cmd/Ctrl + ,) and configure:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "files.autoSave": "afterDelay",
  "terminal.integrated.fontSize": 14
}
```

---

## Part 2: Git (Version Control)

### What is Git?

Git is a version control system that:
- Tracks changes to your code
- Allows collaboration with others
- Enables reverting to previous versions
- Is essential for professional development

### Installation

**macOS**:
```bash
# Install using Homebrew (install Homebrew first if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install git
```

**Windows**:
1. Download from [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Run installer
3. Use default options (or "Use Git from Git Bash only")
4. Select "Use Windows default console window"

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install git
```

### Verification

```bash
git --version
# Should output: git version 2.x.x
```

### Configuration

Set up your identity (used in commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name to main
git config --global init.defaultBranch main

# Improve git output colors
git config --global color.ui auto
```

### Create GitHub Account

1. Go to [https://github.com](https://github.com)
2. Sign up for a free account
3. Verify your email
4. Optional: Apply for GitHub Student Developer Pack for free tools

---

## Part 3: Node.js & npm

### What is Node.js?

Node.js is a JavaScript runtime that allows JavaScript to run outside the browser. We use it for:
- Running React and Next.js
- Package management with npm
- Build tools and bundlers
- Development servers

### Installation

**macOS & Windows**:
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** (Long Term Support) version
3. Run the installer
4. Use default options
5. npm comes bundled with Node.js

**Linux (Ubuntu/Debian)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Verification

```bash
node --version
# Should output: v20.x.x or later

npm --version
# Should output: 10.x.x or later
```

### Global Packages

Install useful global packages:

```bash
# Create React App, Vite (build tools)
npm install -g create-react-app vite

# TypeScript compiler
npm install -g typescript

# Nodemon (auto-restart server)
npm install -g nodemon
```

---

## Part 4: PHP

### What is PHP?

PHP is a server-side scripting language used for:
- Backend logic in web applications
- Laravel framework (our main backend framework)
- Database interactions
- API development

### Installation

**macOS**:
```bash
# Using Homebrew
brew install php

# Verify
php --version
```

**Windows**:
1. Download from [https://windows.php.net/download/](https://windows.php.net/download/)
2. Extract to `C:\php`
3. Add `C:\php` to PATH:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment Variables
   - Edit PATH, add `C:\php`
4. Copy `php.ini-development` to `php.ini`

**Linux (Ubuntu/Debian)**:
```bash
sudo apt update
sudo apt install php php-cli php-mbstring php-xml php-zip php-mysql php-curl
```

### Verification

```bash
php --version
# Should output: PHP 8.2.x or later
```

### Enable Extensions

Edit `php.ini` and uncomment (remove `;` from):
```ini
extension=mysqli
extension=pdo_mysql
extension=mbstring
extension=curl
extension=openssl
extension=fileinfo
```

---

## Part 5: Composer (PHP Package Manager)

### What is Composer?

Composer is to PHP what npm is to JavaScript. It manages PHP dependencies and is essential for Laravel.

### Installation

**macOS & Linux**:
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

**Windows**:
1. Download from [https://getcomposer.org/download/](https://getcomposer.org/download/)
2. Run `Composer-Setup.exe`
3. Follow the installer wizard

### Verification

```bash
composer --version
# Should output: Composer version 2.x.x
```

---

## Part 6: MySQL (Database)

### What is MySQL?

MySQL is a relational database management system. You'll use it to:
- Store application data
- Practice SQL queries
- Learn database design
- Build real-world applications

### Installation Options

**Option 1: MySQL Server (Recommended for beginners)**

**macOS**:
```bash
brew install mysql
brew services start mysql
```

**Windows**:
1. Download MySQL Installer from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
2. Run installer
3. Choose "Developer Default"
4. Set root password (remember this!)

**Linux**:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Option 2: XAMPP/MAMP (All-in-one, easier)**

- **XAMPP** (Windows/Linux/Mac): [https://www.apachefriends.org/](https://www.apachefriends.org/)
- **MAMP** (Mac): [https://www.mamp.info/](https://www.mamp.info/)

Includes: Apache, MySQL, PHP in one package.

### Verification

```bash
mysql --version
# Should output: mysql Ver 8.x.x
```

### Initial Setup

```bash
# Start MySQL (if not running)
# macOS
brew services start mysql

# Linux
sudo service mysql start

# Windows - use Services app

# Login to MySQL
mysql -u root -p
# Enter password when prompted

# Inside MySQL shell
CREATE DATABASE test_db;
SHOW DATABASES;
EXIT;
```

### GUI Tools (Optional but Recommended)

**TablePlus** (macOS/Windows) - [https://tableplus.com/](https://tableplus.com/)
- Beautiful interface
- Free for basic use

**MySQL Workbench** (All platforms) - [https://www.mysql.com/products/workbench/](https://www.mysql.com/products/workbench/)
- Official MySQL tool
- Free

**phpMyAdmin** - Comes with XAMPP/MAMP
- Web-based interface

---

## Part 7: Terminal/Command Line

### Why Learn Terminal?

The terminal/command line is essential for:
- Running development servers
- Using Git
- Installing packages
- Running build tools
- Deploying applications

### Recommended Terminals

**macOS**:
- Built-in Terminal (good)
- iTerm2 (better) - [https://iterm2.com/](https://iterm2.com/)
- Warp (modern) - [https://www.warp.dev/](https://www.warp.dev/)

**Windows**:
- PowerShell (built-in, good)
- Windows Terminal (better) - Install from Microsoft Store
- Git Bash (comes with Git)
- **WSL2** (best for web dev) - Windows Subsystem for Linux

**Linux**:
- Default terminal is fine
- Terminator (advanced)
- Tilix (modern)

### Basic Commands to Know

```bash
# Navigate directories
cd folder_name       # Change directory
cd ..                # Go up one level
pwd                  # Print working directory
ls                   # List files (macOS/Linux)
dir                  # List files (Windows)

# File operations
mkdir folder_name    # Create directory
touch file.txt       # Create file (macOS/Linux)
echo. > file.txt     # Create file (Windows)
rm file.txt          # Delete file
cp file.txt copy.txt # Copy file
mv file.txt new.txt  # Move/rename file

# Clear screen
clear                # macOS/Linux
cls                  # Windows
```

---

## Part 8: Web Browsers

### Essential Browsers for Development

Install both for testing:

1. **Google Chrome** - [https://www.google.com/chrome/](https://www.google.com/chrome/)
   - Best DevTools
   - React Developer Tools extension
   - Most popular browser

2. **Mozilla Firefox** - [https://www.mozilla.org/firefox/](https://www.mozilla.org/firefox/)
   - Excellent DevTools
   - Good for testing
   - Privacy-focused

### Browser Extensions for Development

**Chrome/Firefox**:
- React Developer Tools
- Redux DevTools
- JSON Formatter
- Wappalyzer (detect technologies)
- ColorZilla (color picker)

---

## Verification Checklist

Run these commands to verify everything is installed:

```bash
# VS Code
code --version

# Git
git --version

# Node.js and npm
node --version
npm --version

# PHP
php --version

# Composer
composer --version

# MySQL
mysql --version
```

All should output version numbers without errors.

---

## Creating Your First Project Folder

Let's create a structured folder for course projects:

```bash
# Navigate to your home directory
cd ~

# Create a projects folder
mkdir web-dev-course
cd web-dev-course

# Create subfolders
mkdir html-css
mkdir javascript
mkdir php
mkdir laravel
mkdir react
mkdir nextjs
mkdir capstone

# Verify
ls
```

---

## Setting Up a Test Project

Let's verify everything works by creating a simple test:

### Test 1: HTML File

```bash
cd ~/web-dev-course/html-css
code index.html
```

In `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Environment Test</title>
</head>
<body>
  <h1>My Development Environment Works!</h1>
  <p>VS Code is set up correctly.</p>
</body>
</html>
```

Open with Live Server extension (right-click → "Open with Live Server")

### Test 2: JavaScript with Node

```bash
cd ~/web-dev-course/javascript
code test.js
```

In `test.js`:
```javascript
console.log('Node.js is working!');
console.log('Node version:', process.version);
```

Run:
```bash
node test.js
```

### Test 3: PHP

```bash
cd ~/web-dev-course/php
code test.php
```

In `test.php`:
```php
<?php
echo "PHP is working!\n";
echo "PHP version: " . phpversion() . "\n";
```

Run:
```bash
php test.php
```

### Test 4: Git

```bash
cd ~/web-dev-course
git init
git status
```

Should show "Initialized empty Git repository"

---

## Common Installation Issues & Solutions

### Issue: "command not found"

**Cause**: Software not in PATH

**Solution**:
- **macOS/Linux**: Add to `.bash_profile` or `.zshrc`
- **Windows**: Add to Environment Variables → PATH

### Issue: Permission denied

**Cause**: Need administrator rights

**Solution**:
- **macOS/Linux**: Use `sudo` before command
- **Windows**: Run terminal as Administrator

### Issue: Port already in use

**Cause**: Another service using the same port

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use a different port
```

### Issue: MySQL won't start

**Solution**:
```bash
# macOS
brew services restart mysql

# Linux
sudo service mysql restart

# Windows
# Use Services app to restart MySQL
```

---

## Hands-On Exercise

Create a simple project that uses multiple tools:

1. Create a folder `hello-world`
2. Initialize Git
3. Create `index.html` with some content
4. Create `script.js` that logs to console
5. Create `test.php` that echoes a message
6. Commit everything to Git

```bash
mkdir hello-world
cd hello-world
git init
touch index.html script.js test.php
# Add content to files
git add .
git commit -m "Initial commit"
git log
```

---

## Assignment

**Objective**: Ensure your development environment is fully functional

**Tasks**:
1. Install all required software (VS Code, Git, Node.js, PHP, Composer, MySQL)
2. Install recommended VS Code extensions
3. Create your course projects folder structure
4. Run all verification commands and take screenshots
5. Create a test project using HTML, JavaScript, and PHP
6. Initialize Git and make your first commit
7. Submit screenshots showing:
   - All version commands working
   - VS Code with extensions installed
   - A successful test project running

**Submission**: Share screenshots in the course Discord/LMS

**Evaluation Criteria**:
- All software installed correctly (50%)
- Proper folder structure created (20%)
- Test projects working (20%)
- Git initialized and first commit made (10%)

---

## Common Mistakes & Troubleshooting

**Mistake 1**: Installing wrong PHP version
- **Solution**: Ensure PHP 8.2+ for best Laravel compatibility

**Mistake 2**: Forgetting to add to PATH
- **Solution**: Software won't work from terminal if not in PATH

**Mistake 3**: Using system Python/Ruby instead of project-specific
- **Solution**: Not critical for this course, but good to know

**Mistake 4**: Not restarting terminal after installation
- **Solution**: Close and reopen terminal for PATH changes to apply

---

## Summary

- ✅ VS Code is your code editor with powerful extensions
- ✅ Git tracks code changes and enables collaboration
- ✅ Node.js runs JavaScript outside the browser
- ✅ PHP is our server-side language
- ✅ Composer manages PHP packages
- ✅ MySQL stores application data
- ✅ Terminal is essential for development tasks
- ✅ Proper setup prevents future headaches

---

## Next Steps

1. ✅ Complete this setup
2. ✅ Verify all installations work
3. → Proceed to [Git Basics](./02_git_basics.md)
4. → Familiarize yourself with VS Code interface
5. → Practice terminal commands

---

## Additional Resources

- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Git Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [PHP Manual](https://www.php.net/manual/en/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Command Line Crash Course](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line)

---

**Your environment is ready! Time to start coding. 🚀**
