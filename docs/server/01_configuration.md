# Server Configuration Guide

## Table of Contents

1. [Security Notice](#1-security-notice)
2. [Active Server Credentials (REMOVE BEFORE COMMIT!)](#2-active-server-credentials-remove-before-commit)
3. [Initial Server Setup](#3-initial-server-setup)
4. [Nginx Installation & Configuration](#4-nginx-installation--configuration)
5. [PHP Installation & Configuration](#5-php-installation--configuration)
6. [MySQL Installation & Configuration](#6-mysql-installation--configuration)
7. [Composer Installation](#7-composer-installation)
8. [Node.js & NPM Installation](#8-nodejs--npm-installation)
9. [Laravel Project Setup](#9-laravel-project-setup)
10. [Git Configuration](#10-git-configuration)
11. [Nginx Server Blocks](#11-nginx-server-blocks)
12. [SSL Configuration](#12-ssl-configuration)
13. [File Upload Limits](#13-file-upload-limits)
14. [Maintenance Commands](#14-maintenance-commands)
15. [Git Troubleshooting](#15-git-troubleshooting)
16. [Queue Workers & Supervisor](#16-queue-workers--supervisor)
17. [Cron Jobs Setup](#17-cron-jobs-setup)
18. [Common Issues & Solutions](#18-common-issues--solutions)
19. [Summary](#19-summary)

---

## 1. Security Notice

**CRITICAL: This document contains sensitive credentials**

**Best practices:**
- **Never commit real credentials to Git** - Use environment variables or secret management
- **Rotate passwords regularly** - Change passwords every 90 days
- **Use SSH keys instead of passwords** - More secure than password authentication
- **Restrict SSH access** - Use fail2ban, disable root login after setup
- **Store credentials securely** - Use password managers (1Password, LastPass, Bitwarden)
- **Enable 2FA where possible** - Add extra security layer
- **Review access regularly** - Remove unused accounts

**Recommended:** Replace all credentials in this document with placeholders before committing to version control.

---

### Version Recommendations (Updated February 2026)

**Software versions mentioned in this guide:**

| Software    | Recommended Version | Why                                    |
|-------------|---------------------|----------------------------------------|
| PHP         | 8.3 or 8.4          | PHP 8.2 nearing EOL (Dec 2025)         |
| Node.js     | 20.x LTS            | Long-term support until Apr 2026       |
| nvm         | 0.40.1+             | Latest stable release                  |
| Composer    | Latest (2.7+)       | Always use latest for security patches |
| MySQL       | 8.0+                | Latest stable LTS version              |
| Nginx       | Latest stable       | Install from Ubuntu repos              |

**Important:**
- Software versions change frequently - always check official documentation for latest releases
- Before upgrading production servers, test in staging environment first
- Check Laravel compatibility before updating PHP versions
- Replace version numbers in commands (e.g., `php8.3-fpm`) with your installed version

---

## 2. Server Credentials Template

**Store real credentials in a password manager (1Password, Bitwarden, etc.) — never in this file.**

Use this template as a reference for what to record securely.

---

### Production Server Template

**Server Access:**
```bash
# SSH Connection
Host: YOUR_SERVER_IP
User: root
Password: YOUR_SSH_PASSWORD   # prefer SSH keys over passwords

# SSH Command
ssh root@YOUR_SERVER_IP
```

**Database Configuration:**
```sql
-- MySQL Commands (run after: sudo mysql)
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON *.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE your_database_name;
SHOW DATABASES;
EXIT;
```

**Laravel .env Configuration:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

**Server Details (fill in your own):**
- **IP Address:** YOUR_SERVER_IP
- **OS:** Ubuntu 24.04 LTS (Noble)
- **Hostname:** your-server-hostname
- **Database Name:** your_database_name
- **Database User:** your_db_user
- **Project Path:** /var/www/html
- **GitHub Repo:** https://github.com/your-org/your-repo.git
- **Project Name:** YourProject

**Quick Connect:**
```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Connect to MySQL
mysql -u your_db_user -p your_database_name
```

**Credential Security Checklist:**
1. Store all credentials in a password manager
2. Use SSH keys instead of passwords where possible
3. Never commit credentials to Git
4. Rotate passwords every 90 days

---

### Checking Installed Versions

**Before starting, check what's already installed:**

```bash
# Check PHP version
php -v

# Check Node.js version
node -v

# Check NPM version
npm -v

# Check Composer version
composer --version

# Check MySQL version
mysql --version

# Check Nginx version
nginx -v

# Check Ubuntu version
lsb_release -a
```

---

### Upgrade Guidance

**Upgrading PHP versions:**

```bash
# List installed PHP versions
dpkg -l | grep php | awk '{print $2}'

# Install new PHP version (e.g., 8.4)
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.4-fpm php8.4-common php8.4-cli

# Switch default PHP version
sudo update-alternatives --config php

# Update Nginx to use new PHP-FPM socket
sudo nano /etc/nginx/sites-available/default
# Change: fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;

# Restart services
sudo systemctl restart php8.4-fpm
sudo systemctl restart nginx
```

**Upgrading Node.js with nvm:**

```bash
# List installed versions
nvm list

# Install new version
nvm install 20  # or 22 for latest

# Use new version
nvm use 20

# Set as default
nvm alias default 20

# Remove old version (optional)
nvm uninstall 18
```

**Upgrading Composer:**

```bash
# Self-update to latest version
composer self-update

# Or update to specific version
composer self-update --2
```

---

## 3. Initial Server Setup

### UFW Firewall Configuration

**Purpose:** Secure server by controlling incoming/outgoing traffic.

**Step 1: Enable Nginx HTTP**

```bash
# Update package list
sudo apt-get update

# Stop Apache if running
sudo service apache2 stop

# List available UFW applications
sudo ufw app list

# Allow Nginx HTTP traffic
sudo ufw allow 'Nginx HTTP'

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

---

### Open Required Ports

```bash
# Allow SSH (port 22) - CRITICAL: Do this before enabling firewall
sudo ufw allow 22

# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443)
sudo ufw allow 443/tcp

# Reload firewall to apply changes
sudo ufw reload
```

**Warning:** Always allow SSH (port 22) before enabling UFW, or you'll be locked out!

---

## 4. Nginx Installation & Configuration

### Installation

```bash
# Update package list
sudo apt-get update

# Install Nginx
sudo apt install nginx

# Verify Nginx is running
sudo systemctl status nginx
```

---

### File Upload Size Configuration

**Problem:** Default Nginx limits file uploads to 1MB.

**Solution:** Increase `client_max_body_size` in Nginx configuration.

```bash
# Edit Nginx main config
sudo nano /etc/nginx/nginx.conf

# Add inside http block:
http {
    client_max_body_size 50M;
    # ... other settings
}

# Test configuration
sudo nginx -t

# Reload Nginx
sudo nginx -s reload
sudo systemctl restart nginx
```

---

## 5. PHP Installation & Configuration

### PHP 8.2 Installation

```bash
# Install required extensions
sudo apt-get install php8.2-mbstring php8.2-xml composer unzip

# Install additional extensions
sudo apt install php8.2-{gd,zip,mysql,oauth,yaml,fpm,mbstring,memcache,curl,xml}

# Install OAuth extension
sudo apt-get install php-oauth
```

---

### PHP 8.3 Installation

```bash
# Install required extensions
sudo apt-get install php8.3-mbstring php8.3-xml composer unzip

# Install additional extensions
sudo apt install php8.3-{gd,zip,mysql,oauth,yaml,fpm,mbstring,memcache,curl,xml}

# Install OAuth extension
sudo apt-get install php-oauth
```

---

### PHP 8.4 Installation (Latest)

```bash
# Add PHP repository (if not already added)
sudo apt-get update
sudo apt-get install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update

# Install required extensions
sudo apt-get install php8.4-mbstring php8.4-xml composer unzip

# Install additional extensions
sudo apt install php8.4-{gd,zip,mysql,oauth,yaml,fpm,mbstring,memcache,curl,xml}

# Install OAuth extension
sudo apt-get install php-oauth
```

---

### PHP Upload Limits Configuration

**Purpose:** Increase PHP file upload limits to match Nginx.

```bash
# Edit PHP FPM configuration (adjust version as needed: 8.2, 8.3, or 8.4)
sudo nano /etc/php/8.3/fpm/php.ini

# Find and update these values:
upload_max_filesize = 40M
post_max_size = 50M
max_execution_time = 300
memory_limit = 256M

# Restart PHP-FPM (adjust version: php8.2-fpm, php8.3-fpm, or php8.4-fpm)
sudo systemctl restart php8.3-fpm
```

**Important Notes:**
- `post_max_size` should be larger than `upload_max_filesize` to handle form data
- Replace `8.3` with your installed PHP version (8.2, 8.3, or 8.4)
- Check your PHP version with: `php -v`

---

### PHP Version Comparison

| Version | Release Date | EOL Date    | Status      | Recommended For          |
|---------|--------------|-------------|-------------|--------------------------|
| PHP 8.2 | Dec 2022     | Dec 2025    | ⚠️ Near EOL | Legacy production apps   |
| PHP 8.3 | Nov 2023     | Nov 2026    | ✅ Active   | Stable production apps   |
| PHP 8.4 | Nov 2024     | Nov 2027    | ✅ Latest   | New projects, latest features |

**Recommendation:** Use PHP 8.3 or 8.4 for new projects. PHP 8.2 reaches end-of-life in December 2025.

---

## 6. MySQL Installation & Configuration

### Installation

```bash
# Update package list
sudo apt update

# Install MySQL Server (installs latest version from Ubuntu repos)
sudo apt install mysql-server

# Check installed version
mysql --version

# Secure installation (set root password, remove test database, etc.)
sudo mysql_secure_installation
```

**MySQL Versions:**

| Version     | Release Date | Status        | Notes                           |
|-------------|--------------|---------------|---------------------------------|
| MySQL 8.0   | Apr 2018     | ✅ LTS        | Recommended for new projects    |
| MySQL 8.4   | Apr 2024     | ✅ Innovation | Latest features (test first)    |
| MySQL 9.0   | 2025+        | 🔄 Future     | Next major release              |

**Note:** Ubuntu repos typically provide MySQL 8.0 LTS. For latest versions, use official MySQL APT repository.

**Secure Installation Prompts:**
- Set root password: Yes (choose strong password)
- Remove anonymous users: Yes
- Disallow root login remotely: Yes
- Remove test database: Yes
- Reload privilege tables: Yes

---

### Creating Database & User

```bash
# Login to MySQL as root
sudo mysql

# Create new user
CREATE USER 'tripz'@'localhost' IDENTIFIED BY 'your_secure_password';

# Grant all privileges
GRANT ALL PRIVILEGES ON *.* TO 'tripz'@'localhost';

# Apply changes
FLUSH PRIVILEGES;

# Create database
CREATE DATABASE tripz_db;

# List all databases
SHOW DATABASES;

# Exit MySQL
EXIT;
```

---

### Import Database from SQL File

```bash
# Import SQL dump into database
mysql -u destination -p laravel_atrix < laravel_atrix.sql

# You'll be prompted for password
# The database 'laravel_atrix' must exist before importing
```

---

### Uninstalling MySQL (if needed)

**Warning:** This will delete all databases and data!

```bash
# Remove MySQL packages
sudo apt remove --purge mysql-server
sudo apt purge mysql-server
sudo apt autoremove
sudo apt autoclean

# Remove database configuration
sudo apt remove dbconfig-mysql

# Remove MySQL directories
sudo rm -rf /etc/mysql /var/lib/mysql

# Complete purge (if above doesn't work)
sudo apt purge mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-*
```

---

## 7. Composer Installation

**Composer** - PHP dependency manager for installing Laravel packages.

```bash
# Download Composer installer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

# Verify installer SHA-384 hash (get latest hash from https://getcomposer.org/download/)
# This hash changes with each Composer release - check official site for current hash
EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"

if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
    echo 'ERROR: Invalid installer checksum'
    rm composer-setup.php
    exit 1
fi

# Run Composer installer
php composer-setup.php

# Remove installer
php -r "unlink('composer-setup.php');"

# Move Composer to global location (optional)
sudo mv composer.phar /usr/local/bin/composer

# Verify installation
composer --version
```

**Alternative (simpler method):**

```bash
# Download and install Composer directly
curl -sS https://getcomposer.org/installer | php

# Move to global location
sudo mv composer.phar /usr/local/bin/composer

# Verify installation
composer --version
```

---

## 8. Node.js & NPM Installation

**Node.js** - JavaScript runtime for running build tools (Vite, Webpack).

**NPM** - Node Package Manager for installing JavaScript dependencies.

```bash
# Update package list
sudo apt update

# Install Node.js
sudo apt install nodejs

# Verify Node.js installation
node -v

# Install NPM
sudo apt install npm

# Verify NPM installation
npm -v

# Install project dependencies (run inside project directory)
npm install
```

**Recommended:** Use nvm (Node Version Manager) for easier version management:

```bash
# Install nvm (check https://github.com/nvm-sh/nvm for latest version)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh

# Install latest LTS version (Node 20.x as of 2026)
nvm install --lts

# Or install specific LTS version
nvm install 20    # Node 20.x LTS (Iron)
nvm install 22    # Node 22.x LTS (if available)

# Use specific version
nvm use 20

# Set default version
nvm alias default 20

# Verify installation
node -v
npm -v
```

**Node.js LTS Versions:**

| Version  | Code Name | Release Date | EOL Date    | Status      |
|----------|-----------|--------------|-------------|-------------|
| Node 18  | Hydrogen  | Apr 2022     | Apr 2025    | ⚠️ Near EOL |
| Node 20  | Iron      | Oct 2023     | Apr 2026    | ✅ Active   |
| Node 22  | (TBD)     | Oct 2024     | Apr 2027    | ✅ Latest   |

**Recommendation:** Use Node 20 (LTS) for production applications.

---

## 9. Laravel Project Setup

### Cloning Project from GitHub

```bash
# Navigate to web root
cd /var/www/html

# Remove default Nginx page
rm index.nginx-debian.html

# Clone repository
git clone https://github.com/Anwar-Barakat/school-entertainments.git

# Navigate to project
cd edcare-project
```

---

### Edcare Project Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Set correct ownership (www-data is Nginx user)
sudo chown -R www-data:www-data /var/www/html/edcare-project/storage

# Set correct permissions for storage
sudo chmod -R 775 /var/www/html/edcare-project/storage

# Set permissions for PHP sessions
sudo chmod -R 777 /var/lib/php/sessions

# Create symbolic link for storage
php artisan storage:link

# Build frontend assets
npm run build

# Regenerate autoload files
composer dump-autoload

# Run database migrations
php artisan migrate
```

**For IP-based access (no domain):**

```bash
# Edit .env file
nano .env

# Add this line:
SESSION_SECURE_COOKIE=false
```

---

### TRIPZ Project Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Set storage ownership
sudo chown -R www-data:www-data /var/www/tripz/tripz/storage
sudo chmod -R 775 /var/www/tripz/tripz/storage

# Set PHP sessions permissions
sudo chmod -R 777 /var/lib/php/sessions

# Set CSV upload directory permissions
sudo chown -R www-data:www-data /var/www/tripz/tripz/storage/app
sudo chmod -R 775 /var/www/tripz/tripz/storage/app

sudo chown -R www-data:www-data /var/www/tripz/tripz/storage/app/csv_uploads
sudo chmod -R 775 /var/www/tripz/tripz/storage/app/csv_uploads

chmod 644 /var/www/tripz/tripz/storage/app/csv_uploads
chmod 755 /var/www/tripz/tripz/storage/app/csv_uploads

# Create symbolic link for storage
php artisan storage:link

# Build frontend assets
npm run build

# Regenerate autoload files
composer dump-autoload

# Run database migrations
php artisan migrate
```

**For IP-based access:**

```bash
# Edit .env and add:
SESSION_SECURE_COOKIE=false
```

---

### Laravel Permissions Explained

| Permission | Meaning                          | Who Can Access           |
|------------|----------------------------------|--------------------------|
| 755        | rwxr-xr-x (owner full, others read/execute) | Directories    |
| 644        | rw-r--r-- (owner write, others read)        | Files          |
| 775        | rwxrwxr-x (owner+group full, others read/execute) | Shared dirs |
| 777        | rwxrwxrwx (everyone full access) | Temporary only (insecure) |

**Owner:** www-data (Nginx/PHP-FPM user)
**Group:** www-data

---

## 10. Git Configuration

### Mark Directory as Safe

**Problem:** Git refuses to work in directory owned by different user.

**Solution:** Add directory to Git safe list.

```bash
# Add directory to safe list
git config --global --add safe.directory /var/www/html/Submissions

# Verify
git config --global --get-all safe.directory
```

---

## 11. Nginx Server Blocks

### Single Project Configuration (HTTP Only)

**File:** `/etc/nginx/sites-available/default`

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/tripz/tripz/public;
    index index.php;

    server_name YOUR_SERVER_IP;

    location / {
        # Try to serve file, then directory, then Laravel router
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Let's Encrypt challenge directory
    location ^~ /.well-known/acme-challenge/ {
        allow all;
        default_type "text/plain";
        try_files $uri =404;
    }

    # PHP processing
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

**Key directives:**
- `root` - Document root (Laravel public directory)
- `index` - Default file to serve
- `server_name` - Domain or IP address
- `try_files` - Laravel routing fallback
- `fastcgi_pass` - PHP-FPM socket path

---

## 12. SSL Configuration

### HTTPS with SSL Certificates

**File:** `/etc/nginx/sites-available/tripz.me`

```nginx
# Redirect www to non-www (HTTP)
server {
    listen 80;
    server_name www.tripz.me;
    return 301 https://tripz.me$request_uri;
}

# Redirect www to non-www (HTTPS)
server {
    listen 443 ssl http2;
    server_name www.tripz.me;

    ssl_certificate /etc/ssl/tripz_me.pem;
    ssl_certificate_key /etc/ssl/tripz.me.key;

    return 301 https://tripz.me$request_uri;
}

# Main HTTPS server block
server {
    listen 443 ssl http2;
    server_name tripz.me;

    root /var/www/tripz/tripz/public;
    index index.php;

    # SSL certificates
    ssl_certificate /etc/ssl/tripz_me.pem;
    ssl_certificate_key /etc/ssl/tripz.me.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # GZIP compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ^~ /.well-known/acme-challenge/ {
        allow all;
        default_type "text/plain";
        try_files $uri =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

**SSL Best Practices:**
- `http2` - Enable HTTP/2 for better performance
- `HSTS header` - Force HTTPS for 1 year
- `gzip` - Compress responses (faster page loads)
- Redirect www to non-www (or vice versa, be consistent)

---

### SSL Certificate Locations

| File Type         | Path                        | Purpose                |
|-------------------|-----------------------------|------------------------|
| Certificate       | /etc/ssl/tripz_me.pem       | Public certificate     |
| Private Key       | /etc/ssl/tripz.me.key       | Private key (keep secure) |
| Chain (optional)  | /etc/ssl/ca-bundle.crt      | Intermediate certs     |

**Security:** Private keys should have 600 permissions (readable only by root).

```bash
chmod 600 /etc/ssl/tripz.me.key
```

---

## 13. File Upload Limits

### Complete Upload Configuration

**Problem:** 413 Request Entity Too Large when uploading files.

**Solution:** Configure limits in both Nginx and PHP.

---

### Nginx Configuration

```bash
# Edit Nginx main config
nano /etc/nginx/nginx.conf

# Add inside http block:
http {
    client_max_body_size 100M;
}

# Test configuration
sudo nginx -t

# Reload Nginx
sudo nginx -s reload
sudo systemctl restart nginx
```

---

### PHP Configuration

```bash
# Edit PHP-FPM config
sudo nano /etc/php/8.3/fpm/php.ini

# Update these values:
upload_max_filesize = 100M
post_max_size = 110M
max_execution_time = 300
memory_limit = 256M

# Restart PHP-FPM
sudo systemctl restart php8.3-fpm
```

---

### Recommended Upload Limits

| File Type        | Nginx Limit | PHP upload_max | PHP post_max | Use Case           |
|------------------|-------------|----------------|--------------|---------------------|
| Images           | 10M         | 10M            | 15M          | Photo uploads       |
| Documents        | 25M         | 25M            | 30M          | PDF, Word files     |
| Videos           | 100M        | 100M           | 110M         | Short video clips   |
| Large files      | 500M        | 500M           | 510M         | Video courses, etc. |

**Rule:** `post_max_size` should be slightly larger than `upload_max_filesize`.

---

## 14. Maintenance Commands

### Nginx Commands

```bash
# Test configuration syntax
sudo nginx -t

# Reload configuration (graceful, no downtime)
sudo nginx -s reload
sudo systemctl reload nginx

# Restart Nginx (brief downtime)
sudo systemctl restart nginx

# Stop Nginx
sudo systemctl stop nginx

# Start Nginx
sudo systemctl start nginx

# Check Nginx status
sudo systemctl status nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

### PHP-FPM Commands

```bash
# Restart PHP-FPM (adjust version as needed)
sudo systemctl restart php8.3-fpm

# Reload PHP-FPM
sudo systemctl reload php8.3-fpm

# Check PHP-FPM status
sudo systemctl status php8.3-fpm

# View PHP-FPM error log
sudo tail -f /var/log/php8.3-fpm.log
```

---

### System Reload Sequence

**After configuration changes:**

```bash
# 1. Test Nginx config
sudo nginx -t

# 2. Reload systemd daemon (if needed)
systemctl daemon-reload

# 3. Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.3-fpm

# 4. Reload firewall
sudo ufw reload
```

---

## 15. Git Troubleshooting

### Remove Git Lock File

**Problem:** `fatal: Unable to create '.git/index.lock': File exists`

**Cause:** Previous Git operation crashed, leaving lock file.

**Solution:**

```bash
# Find Git processes
ps aux | grep git

# Remove lock file
rm -f .git/index.lock

# Now you can run Git commands
git add -A -- .
```

---

### Undo Last Commit

**Remove last commit completely (lose changes):**

```bash
git reset --hard HEAD~1
```

**Remove last commit but keep changes:**

```bash
git reset HEAD~
```

**Undo last commit, keep changes staged:**

```bash
git reset --soft HEAD~1
```

---

### Pull with Existing Commits

**Problem:** Remote has commits you don't have locally.

**Solution:**

```bash
# Pull without rebase
git pull --tags origin master --no-rebase

# Alternative: Pull with rebase
git pull --rebase origin master
```

---

### Git Reset Comparison

| Command              | Commit History | Staging Area | Working Directory |
|----------------------|----------------|--------------|-------------------|
| git reset --soft     | ✅ Reset       | ✅ Keep      | ✅ Keep           |
| git reset (--mixed)  | ✅ Reset       | ❌ Reset     | ✅ Keep           |
| git reset --hard     | ✅ Reset       | ❌ Reset     | ❌ Reset          |

---

## 16. Queue Workers & Supervisor

**Supervisor** - Process manager that keeps queue workers running.

**Purpose:** Automatically restart queue workers if they crash.

---

### Install Supervisor

```bash
# Update packages
sudo apt-get update

# Install Supervisor
sudo apt-get install supervisor

# Start Supervisor
sudo systemctl start supervisor

# Enable on boot
sudo systemctl enable supervisor
```

---

### Queue Worker Configuration

**File:** `/etc/supervisor/conf.d/queue-worker.conf`

```ini
[program:queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/tripz/tripz/artisan queue:work --sleep=3 --tries=3 --timeout=90
autostart=true
autorestart=true
user=root
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/tripz/tripz/storage/logs/worker.log
```

**Configuration explained:**
- `process_name` - Process identifier format
- `command` - Command to run
- `autostart` - Start on Supervisor boot
- `autorestart` - Restart if crashes
- `user` - User to run as (use www-data in production)
- `numprocs` - Number of worker processes
- `stdout_logfile` - Log file location

---

### Reverb Worker Configuration

**Purpose:** Run Laravel Reverb WebSocket server.

**File:** `/etc/supervisor/conf.d/queue-worker.conf` (add to same file)

```ini
[program:reverb-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/tripz/tripz/artisan reverb:start
autostart=true
autorestart=true
user=root
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/tripz/tripz/storage/logs/reverb.log
```

---

### Scheduled Task Workers

**Purpose:** Run Laravel artisan commands on-demand via Supervisor.

**Note:** `autostart=false` - These don't run automatically, triggered by cron.

```ini
[program:update-booking-status]
command=php /var/www/tripz/tripz/artisan app:update-booking-status-to-completed
autostart=false
autorestart=false
user=root
redirect_stderr=true
stdout_logfile=/var/www/tripz/tripz/storage/logs/update-booking-status.log

[program:update-reservation-status]
command=php /var/www/tripz/tripz/artisan app:update-reservation-status-to-completed
autostart=false
autorestart=false
user=root
redirect_stderr=true
stdout_logfile=/var/www/tripz/tripz/storage/logs/update-reservation-status.log

[program:truncate-telescope-tables]
command=php /var/www/tripz/tripz/artisan app:truncate-telescope-tables-command
autostart=false
autorestart=false
user=root
redirect_stderr=true
stdout_logfile=/var/www/tripz/tripz/storage/logs/truncate-telescope-tables.log
```

---

### Supervisor Management Commands

```bash
# Read new configuration files
sudo supervisorctl reread

# Apply configuration changes
sudo supervisorctl update

# Start all queue workers
sudo supervisorctl start queue-worker:*

# Start specific program
sudo supervisorctl start reverb-worker

# Stop program
sudo supervisorctl stop queue-worker:*

# Restart program
sudo supervisorctl restart queue-worker:*

# View status
sudo supervisorctl status

# View logs
sudo supervisorctl tail -f queue-worker

# Restart Supervisor
sudo systemctl restart supervisor
```

---

## 17. Cron Jobs Setup

**Purpose:** Schedule tasks to run automatically at specific times.

---

### Edit Root Crontab

```bash
# Edit crontab for root user
sudo crontab -e

# Select editor (nano recommended for beginners)
```

---

### Cron Schedule Configuration

```cron
# Run daily at 1:00 AM - Update booking status
0 1 * * * supervisorctl start update-booking-status

# Run daily at 1:00 AM - Update reservation status
0 1 * * * supervisorctl start update-reservation-status

# Run daily at 1:00 AM - Truncate Telescope tables
0 1 * * * supervisorctl start truncate-telescope-tables
```

---

### Cron Syntax Explained

```
* * * * * command
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0 and 7 = Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Examples:**

| Schedule           | Cron Expression  | Meaning                        |
|--------------------|------------------|--------------------------------|
| Every minute       | * * * * *        | Run every minute               |
| Every hour         | 0 * * * *        | Run at minute 0 of every hour  |
| Daily at midnight  | 0 0 * * *        | Run at 00:00 every day         |
| Daily at 1 AM      | 0 1 * * *        | Run at 01:00 every day         |
| Every Monday 9 AM  | 0 9 * * 1        | Run Mondays at 09:00           |
| First of month     | 0 0 1 * *        | Run at 00:00 on 1st of month   |

---

### Verify Cron Jobs

```bash
# List cron jobs for current user
crontab -l

# List cron jobs for root
sudo crontab -l

# View cron log
grep CRON /var/log/syslog

# Test cron job manually
supervisorctl start update-booking-status
```

---

## 18. Common Issues & Solutions

### Issue: 413 Request Entity Too Large

**Cause:** File upload exceeds Nginx or PHP limits.

**Solution:**

```bash
# Increase Nginx limit
sudo nano /etc/nginx/nginx.conf
# Add: client_max_body_size 100M;

# Increase PHP limits
sudo nano /etc/php/8.3/fpm/php.ini
# Update: upload_max_filesize = 100M
# Update: post_max_size = 110M

# Restart services
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl restart php8.3-fpm
```

---

### Issue: 502 Bad Gateway

**Cause:** PHP-FPM not running or socket path incorrect.

**Solution:**

```bash
# Check PHP-FPM status
sudo systemctl status php8.3-fpm

# Restart PHP-FPM
sudo systemctl restart php8.3-fpm

# Verify socket path in Nginx config
# Should match: /var/run/php/php8.3-fpm.sock
```

---

### Issue: 500 Internal Server Error

**Cause:** Laravel error (check logs for details).

**Solution:**

```bash
# View Laravel logs
tail -f /var/www/tripz/tripz/storage/logs/laravel.log

# View Nginx error log
sudo tail -f /var/log/nginx/error.log

# Common fixes:
# 1. Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 2. Fix permissions
sudo chown -R www-data:www-data storage
sudo chmod -R 775 storage
```

---

### Issue: Storage Link Not Working

**Cause:** Symbolic link not created or broken.

**Solution:**

```bash
# Remove existing link
rm public/storage

# Recreate symbolic link
php artisan storage:link

# Verify link exists
ls -la public/storage
```

---

### Issue: Composer Install Fails

**Cause:** Memory limit too low.

**Solution:**

```bash
# Temporarily increase memory limit
php -d memory_limit=-1 /usr/local/bin/composer install

# Or update php.ini
sudo nano /etc/php/8.3/cli/php.ini
# Update: memory_limit = 512M
```

---

### Issue: Queue Jobs Not Processing

**Cause:** Queue worker not running.

**Solution:**

```bash
# Check Supervisor status
sudo supervisorctl status

# Restart queue worker
sudo supervisorctl restart queue-worker:*

# View worker logs
sudo supervisorctl tail -f queue-worker

# Manually run queue
php artisan queue:work --tries=3
```

---

### Issue: Database Connection Failed

**Cause:** Wrong credentials or MySQL not running.

**Solution:**

```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Test connection
mysql -u username -p database_name

# Verify .env credentials
cat .env | grep DB_
```

---

### Debugging Checklist

When troubleshooting server issues:

1. **Check service status**
   ```bash
   sudo systemctl status nginx
   sudo systemctl status php8.3-fpm
   sudo systemctl status mysql
   ```

2. **View error logs**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   tail -f storage/logs/laravel.log
   ```

3. **Test configurations**
   ```bash
   sudo nginx -t
   php artisan config:cache
   ```

4. **Check permissions**
   ```bash
   ls -la storage/
   ls -la bootstrap/cache/
   ```

5. **Verify environment**
   ```bash
   php artisan about
   php -v
   composer --version
   ```

---

## 19. Summary

### Server Stack

**Web Server:**
- **Nginx** - High-performance web server and reverse proxy
- Handles static files, SSL/TLS, request routing

**Application Server:**
- **PHP-FPM 8.3/8.4** - FastCGI Process Manager for PHP
- Executes PHP code (Laravel)
- **Recommended:** PHP 8.3 (stable) or PHP 8.4 (latest)

**Database:**
- **MySQL 8.0+** - Relational database management system
- Stores application data
- **Recommended:** MySQL 8.0 LTS

**JavaScript Runtime:**
- **Node.js 20.x LTS** - JavaScript runtime for build tools
- **NPM** - Package manager for JavaScript dependencies
- Managed via nvm (Node Version Manager)

**Process Manager:**
- **Supervisor** - Keeps queue workers running
- Auto-restarts on crash

**Task Scheduler:**
- **Cron** - Runs scheduled tasks
- Triggers Supervisor programs

---

### Configuration Flow

**Initial Setup:**
1. UFW firewall (ports 22, 80, 443)
2. Nginx installation (latest stable)
3. PHP 8.3 or 8.4 + extensions (recommended: 8.3 for stability)
4. MySQL 8.0+ installation + database
5. Composer latest version (PHP dependencies)
6. Node.js 20.x LTS + NPM (frontend assets via nvm)

**Laravel Setup:**
1. Clone repository
2. Copy .env file
3. Set permissions (www-data:www-data)
4. Generate app key
5. Install dependencies (composer, npm)
6. Run migrations
7. Build assets

**Production Optimization:**
1. Configure Nginx server block
2. SSL certificates (HTTPS)
3. Supervisor (queue workers)
4. Cron jobs (scheduled tasks)
5. Monitoring & logging

---

### File Locations Reference

| Type               | Location                              | Purpose                    |
|--------------------|---------------------------------------|----------------------------|
| Nginx config       | /etc/nginx/nginx.conf                 | Main configuration         |
| Nginx sites        | /etc/nginx/sites-available/           | Virtual host configs       |
| Nginx logs         | /var/log/nginx/                       | Access & error logs        |
| PHP config         | /etc/php/8.3/fpm/php.ini              | PHP settings               |
| PHP-FPM logs       | /var/log/php8.3-fpm.log               | PHP-FPM errors             |
| MySQL config       | /etc/mysql/my.cnf                     | MySQL settings             |
| Supervisor config  | /etc/supervisor/conf.d/               | Worker configurations      |
| Crontab            | /var/spool/cron/crontabs/root         | Scheduled tasks            |
| Laravel project    | /var/www/                             | Application code           |
| Laravel logs       | storage/logs/laravel.log              | Application errors         |
| SSL certificates   | /etc/ssl/                             | HTTPS certificates         |

---

### Essential Commands Quick Reference

**Nginx:**
```bash
sudo nginx -t                    # Test config
sudo systemctl restart nginx     # Restart
sudo tail -f /var/log/nginx/error.log  # View errors
```

**PHP-FPM:**
```bash
sudo systemctl restart php8.3-fpm     # Restart
php -v                                # Check version
```

**MySQL:**
```bash
sudo systemctl restart mysql     # Restart
mysql -u user -p database        # Connect
```

**Laravel:**
```bash
php artisan migrate              # Run migrations
php artisan cache:clear          # Clear cache
php artisan queue:work           # Run queue worker
composer install                 # Install dependencies
npm run build                    # Build assets
```

**Supervisor:**
```bash
sudo supervisorctl status        # View status
sudo supervisorctl restart all   # Restart all
sudo supervisorctl tail -f program  # View logs
```

**Git:**
```bash
git pull origin main             # Pull changes
rm -f .git/index.lock            # Remove lock file
git reset --hard HEAD~1          # Undo last commit
```

---

### Security Best Practices

**Server Security:**
- ✅ Use SSH keys instead of passwords
- ✅ Disable root SSH login after initial setup
- ✅ Install fail2ban to prevent brute force
- ✅ Keep packages updated (sudo apt update && sudo apt upgrade)
- ✅ Use firewall (UFW) to restrict ports
- ✅ Regular security audits

**Application Security:**
- ✅ Use strong database passwords
- ✅ Never commit .env to Git
- ✅ Set proper file permissions (www-data)
- ✅ Enable HTTPS with valid SSL certificate
- ✅ Keep Laravel and dependencies updated
- ✅ Validate and sanitize user input

**Credential Management:**
- ✅ Use environment variables for secrets
- ✅ Rotate passwords regularly
- ✅ Use password manager for storage
- ✅ Limit GitHub token scope
- ✅ Revoke unused access tokens
- ✅ Enable 2FA on critical accounts

---

### Monitoring & Maintenance

**Daily:**
- Check error logs for issues
- Monitor disk space usage
- Verify queue workers running

**Weekly:**
- Review application logs
- Check for failed cron jobs
- Update dependencies (security patches)

**Monthly:**
- Database backup verification
- SSL certificate expiration check
- Review user access and permissions
- Update PHP/Node.js versions if needed

**Backup Strategy:**
- Database: Daily automated backups
- Files: Weekly incremental backups
- Configuration: Version control (Git)
- Test restore procedure regularly
