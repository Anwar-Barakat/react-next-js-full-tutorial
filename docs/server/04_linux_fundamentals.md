# Linux Fundamentals for Developers

A comprehensive guide covering Linux essentials, file system navigation, permissions, shell commands, networking, scripting, and system administration for full-stack developers.

---

## Table of Contents

1. [What is Linux?](#1-what-is-linux)
2. [Why Developers Use Linux](#2-why-developers-use-linux)
3. [Linux Distributions](#3-linux-distributions)
4. [Linux File System Structure](#4-linux-file-system-structure)
5. [Navigating the File System](#5-navigating-the-file-system)
6. [File and Directory Operations](#6-file-and-directory-operations)
7. [File Permissions (chmod, chown, rwx)](#7-file-permissions-chmod-chown-rwx)
8. [Users and Groups](#8-users-and-groups)
9. [Text Processing Commands](#9-text-processing-commands)
10. [Process Management](#10-process-management)
11. [Package Management](#11-package-management)
12. [SSH and Remote Access](#12-ssh-and-remote-access)
13. [Networking Commands](#13-networking-commands)
14. [Environment Variables and PATH](#14-environment-variables-and-path)
15. [Shell Scripting Basics](#15-shell-scripting-basics)
16. [Disk and Memory Management](#16-disk-and-memory-management)
17. [Cron Jobs](#17-cron-jobs)
18. [Common Linux Interview Questions](#18-common-linux-interview-questions)

---

## 1. What is Linux?

**Linux** is a free, open-source operating system kernel originally created by **Linus Torvalds** in 1991. He was a 21-year-old Finnish computer science student who wanted a free alternative to the proprietary UNIX operating system. What started as a personal project quickly grew into one of the most important pieces of software ever written.

**Key facts about Linux:**

- **Open-source** — anyone can view, modify, and distribute the source code
- **Kernel-based** — Linux is technically a kernel (the core of an OS), not a full operating system. When people say "Linux," they usually mean a Linux distribution (kernel + tools + desktop environment)
- **UNIX-like** — Linux was inspired by UNIX and follows many of the same design principles, but it is not derived from the UNIX codebase
- **Multi-user and multi-tasking** — multiple users can work on the system simultaneously, and the system can run multiple processes at once
- **Stable and secure** — Linux powers the majority of the world's servers because of its reliability

**Linux vs UNIX:**

| Feature | Linux | UNIX |
|---------|-------|------|
| **Cost** | Free and open-source | Mostly proprietary (Solaris, AIX, HP-UX) |
| **Source code** | Publicly available | Restricted to vendors |
| **Development** | Community-driven | Vendor-driven |
| **Hardware support** | Runs on almost anything | Tied to specific hardware |
| **Examples** | Ubuntu, Fedora, Arch | macOS (BSD-based), Solaris, AIX |

**Where Linux runs:**

- **Servers** — over **96%** of the world's top 1 million servers run Linux
- **Cloud** — AWS, Google Cloud, and Azure all default to Linux instances
- **Android** — the world's most popular mobile OS is built on the Linux kernel
- **IoT devices** — routers, smart TVs, embedded systems
- **Supercomputers** — 100% of the top 500 supercomputers run Linux
- **Containers** — Docker and Kubernetes are Linux-native technologies

> **Think of it like this:** If operating systems were cars, Windows would be a consumer sedan (easy to drive, widely used), macOS would be a luxury car (polished but expensive), and Linux would be a custom-built race car (you choose every part, and it dominates the professional circuit).

**In short:** Linux is a free, open-source operating system kernel that powers nearly all servers, cloud platforms, Android devices, and supercomputers. As a developer, understanding Linux is not optional — it is essential.

---

## 2. Why Developers Use Linux

If you are a developer working on web applications, backend services, or anything that gets deployed to production, you will almost certainly interact with Linux. Here is why it matters:

**Most servers run Linux:**

- When you deploy a Laravel app, a Next.js project, or a Python API, it almost always ends up on a Linux server
- Services like DigitalOcean, AWS EC2, Linode, and Hetzner all default to Ubuntu or other Linux distributions
- Understanding Linux means you can confidently manage your own production servers

**Required for DevOps, Cloud, and Backend work:**

- **Docker** containers run on the Linux kernel
- **Kubernetes** orchestration is Linux-native
- **CI/CD pipelines** (GitHub Actions, GitLab CI) run on Linux runners
- Cloud certifications (AWS, GCP, Azure) expect Linux proficiency

**Native support for development tools:**

- Programming languages like Python, Ruby, Node.js, PHP, Go, and Rust work natively on Linux
- Build tools, compilers, and package managers are designed for Linux first
- Many open-source tools only support Linux or work best on it

**Package managers make life easier:**

```bash
# Install Node.js, Git, and Nginx in one command on Ubuntu
sudo apt install nodejs git nginx

# Install multiple PHP extensions
sudo apt install php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml
```

**It is free:**

- No licensing costs for the operating system
- No activation keys or subscription fees
- You can run as many Linux servers as you want at zero OS cost

**Customizability and control:**

- You control every aspect of the system — no forced updates, no telemetry, no bloatware
- Minimal resource usage means more CPU and RAM for your applications
- You can strip down a Linux server to only the essential services

**In short:** Developers use Linux because it powers production servers, supports all major development tools natively, is free, and gives you complete control over your environment. If you want to be a well-rounded developer, Linux skills are non-negotiable.

---

## 3. Linux Distributions

A **Linux distribution** (or "distro") is a complete operating system built around the Linux kernel. Each distribution packages the kernel with different software, package managers, desktop environments, and philosophies.

> **Think of it like this:** The Linux kernel is the engine. A distribution is the complete car — engine plus body, seats, dashboard, and paint job. Different distros are different car models built around the same engine.

**Major Linux distributions:**

**Ubuntu:**

- **Based on:** Debian
- **Package manager:** `apt` (Advanced Package Tool)
- **Best for:** Beginners, web servers, cloud deployments
- **Why it is popular:** Largest community, excellent documentation, Long Term Support (LTS) releases every 2 years
- **Current LTS:** Ubuntu 24.04 LTS

```bash
# Check Ubuntu version
lsb_release -a

# Update system packages
sudo apt update && sudo apt upgrade -y
```

**CentOS / Rocky Linux / AlmaLinux:**

- **Based on:** Red Hat Enterprise Linux (RHEL)
- **Package manager:** `dnf` (formerly `yum`)
- **Best for:** Enterprise environments, production servers
- **Why it matters:** CentOS was the free version of RHEL. After CentOS shifted to CentOS Stream, Rocky Linux and AlmaLinux emerged as 1:1 RHEL-compatible replacements

```bash
# Check Rocky Linux version
cat /etc/rocky-release

# Update system packages
sudo dnf update -y
```

**Debian:**

- **Based on:** Independent (one of the oldest distros)
- **Package manager:** `apt`
- **Best for:** Stability-critical servers, minimal setups
- **Why it matters:** Ubuntu is based on Debian. Debian prioritizes stability over cutting-edge features, making it a rock-solid choice for production

**Arch Linux:**

- **Based on:** Independent
- **Package manager:** `pacman`
- **Best for:** Advanced users who want full control and the latest software
- **Why it matters:** Rolling release model (always up-to-date), excellent wiki (the Arch Wiki is the best Linux documentation out there)

```bash
# Arch Linux package installation
sudo pacman -S nginx nodejs npm

# Update entire system
sudo pacman -Syu
```

**Fedora:**

- **Based on:** Independent (upstream for RHEL)
- **Package manager:** `dnf`
- **Best for:** Developers who want recent software with good stability
- **Why it matters:** Fedora is the testing ground for features that later go into RHEL

**Distribution comparison table:**

| Feature | Ubuntu | Rocky/Alma | Debian | Arch | Fedora |
|---------|--------|------------|--------|------|--------|
| **Difficulty** | Easy | Medium | Medium | Hard | Medium |
| **Package manager** | apt | dnf | apt | pacman | dnf |
| **Release model** | Fixed (LTS) | Fixed | Fixed | Rolling | Fixed (6 months) |
| **Stability** | High | Very High | Very High | Varies | High |
| **Software freshness** | Moderate | Conservative | Conservative | Bleeding edge | Fresh |
| **Community size** | Largest | Large | Large | Medium | Large |
| **Enterprise use** | Common | Very Common | Common | Rare | Moderate |
| **Best for** | General dev | Enterprise | Stable servers | Power users | Desktop dev |
| **Default desktop** | GNOME | GNOME | None (server) | None | GNOME |
| **Server popularity** | #1 | #2 | #3 | Rare | Moderate |

**Which distribution should you choose?**

- **New to Linux?** Start with **Ubuntu** — the community support alone is worth it
- **Enterprise or production servers?** Use **Rocky Linux** or **Ubuntu LTS**
- **Want maximum stability?** Go with **Debian**
- **Want to learn Linux deeply?** Try **Arch Linux** (but be prepared to read a lot of documentation)
- **Desktop development?** **Fedora** is an excellent workstation choice

**In short:** A Linux distribution is a complete OS built around the Linux kernel. Ubuntu is the most popular and beginner-friendly, Rocky/Alma are enterprise standards, Debian is the stability king, and Arch gives you total control. For most developers, Ubuntu LTS is the safest starting point.

---

## 4. Linux File System Structure

The Linux file system is organized as a single tree structure that starts from the root directory `/`. Unlike Windows, which uses drive letters (C:\, D:\), everything in Linux branches out from this single root.

> **Think of it like a building:** The root `/` is the ground floor. Each directory is a different room with a specific purpose. `/home` is where people live (user files), `/etc` is the control room (configuration), `/var` is the storage room (logs, data), and `/tmp` is the break room (temporary stuff that gets cleaned up).

**The complete directory structure:**

| Directory | Purpose | Common Contents |
|-----------|---------|-----------------|
| `/` | Root — the top of the file system tree | Everything branches from here |
| `/home` | User home directories | `/home/anwar`, `/home/deploy` — personal files, configs |
| `/root` | Root user's home directory | Home for the superuser (not in `/home`) |
| `/etc` | System configuration files | `nginx.conf`, `php.ini`, `ssh/sshd_config`, `crontab` |
| `/var` | Variable data (changes frequently) | `/var/log` (logs), `/var/www` (web files), `/var/lib` (databases) |
| `/usr` | User programs and read-only data | `/usr/bin` (programs), `/usr/lib` (libraries), `/usr/share` (docs) |
| `/tmp` | Temporary files (cleared on reboot) | Session files, upload buffers, build artifacts |
| `/opt` | Optional/third-party software | Manually installed apps like `/opt/lampp`, `/opt/google/chrome` |
| `/bin` | Essential user binaries | `ls`, `cp`, `mv`, `cat`, `bash` — commands all users need |
| `/sbin` | Essential system binaries | `mount`, `reboot`, `fdisk`, `iptables` — admin commands |
| `/dev` | Device files | `/dev/sda` (hard drive), `/dev/null` (black hole), `/dev/tty` |
| `/proc` | Virtual filesystem for processes | `/proc/cpuinfo`, `/proc/meminfo` — kernel and process info |
| `/boot` | Boot loader files | Linux kernel (`vmlinuz`), GRUB bootloader config |
| `/lib` | Essential shared libraries | Library files needed by `/bin` and `/sbin` programs |
| `/mnt` | Temporary mount points | USB drives, external disks mounted here |
| `/media` | Removable media mount points | Auto-mounted USB drives, CD-ROMs |
| `/srv` | Service data | Data for services like FTP or HTTP servers |
| `/sys` | Virtual filesystem for system info | Hardware information, kernel parameters |

**Exploring the file system:**

```bash
# See the top-level directories
ls /

# Output:
# bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var

# Check what's in /etc (configuration files)
ls /etc/ | head -20

# Check log files
ls /var/log/

# See web server files (common location)
ls /var/www/

# Check your home directory
ls ~
```

**Directories developers use most:**

```bash
# Web application files (Nginx/Apache default)
/var/www/html/
/var/www/myapp/

# Nginx configuration
/etc/nginx/
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/

# PHP configuration
/etc/php/8.3/fpm/php.ini

# Log files (debugging production issues)
/var/log/nginx/error.log
/var/log/syslog
/var/log/auth.log

# SSL certificates
/etc/ssl/certs/
/etc/letsencrypt/live/

# Systemd service files
/etc/systemd/system/

# Cron jobs
/etc/crontab
/var/spool/cron/crontabs/
```

**Special directories:**

```bash
# /dev/null — the "black hole" — discards anything written to it
echo "This disappears" > /dev/null

# /dev/zero — endless stream of zeros (used to create empty files)
dd if=/dev/zero of=testfile bs=1M count=100  # Creates a 100MB file

# /proc/cpuinfo — CPU information (virtual file)
cat /proc/cpuinfo | head -20

# /proc/meminfo — memory information
cat /proc/meminfo | head -10
```

**In short:** The Linux file system is a single tree starting at `/`. Every directory has a specific purpose: `/etc` for configuration, `/var` for variable data and logs, `/home` for user files, `/usr` for programs, and `/tmp` for temporary files. As a developer, you will spend most of your time in `/var/www`, `/etc/nginx`, and `/var/log`.

---

## 5. Navigating the File System

Getting around the Linux file system efficiently is the first skill every developer should master. The three foundational commands are `pwd`, `cd`, and `ls`.

**pwd — Print Working Directory:**

The `pwd` command tells you exactly where you are in the file system.

```bash
# Where am I?
pwd
# Output: /home/anwar

# After navigating somewhere
cd /var/log
pwd
# Output: /var/log
```

**cd — Change Directory:**

The `cd` command moves you between directories.

```bash
# Go to a specific directory (absolute path)
cd /var/www/html

# Go up one directory
cd ..

# Go up two directories
cd ../..

# Go to your home directory (three ways)
cd
cd ~
cd $HOME

# Go to the previous directory (toggle between two locations)
cd -

# Go to another user's home directory
cd ~deploy
```

**Absolute vs Relative paths:**

- **Absolute path** — starts from root `/`, always works regardless of your current location
- **Relative path** — starts from your current location, shorter but depends on where you are

```bash
# Absolute path (starts with /)
cd /var/www/html/myproject

# Relative path (from current directory)
# If you are in /var/www/
cd html/myproject

# Special relative paths
# .   = current directory
# ..  = parent directory
# ~   = home directory
```

**ls — List directory contents:**

The `ls` command shows you what is inside a directory.

```bash
# Basic listing
ls

# List all files including hidden files (files starting with .)
ls -a

# Long format (permissions, owner, size, date)
ls -l

# Combine: all files in long format
ls -la

# Human-readable file sizes (KB, MB, GB instead of bytes)
ls -lh

# Combine all three: all files, long format, human-readable
ls -lah

# Recursive listing (show contents of subdirectories too)
ls -R

# Sort by modification time (newest first)
ls -lt

# Sort by file size (largest first)
ls -lS

# List a specific directory without navigating to it
ls -la /var/log/

# List only directories
ls -d */

# One file per line (useful for scripting)
ls -1
```

**Understanding ls -la output:**

```bash
ls -la /var/www/
# drwxr-xr-x  4 www-data www-data 4096 Mar  1 10:00 .
# drwxr-xr-x 14 root     root     4096 Feb 15 08:30 ..
# drwxr-xr-x  5 www-data www-data 4096 Mar  1 10:00 html
# -rw-r--r--  1 www-data www-data  612 Feb 15 09:00 index.nginx-debian.html

# Breakdown of each column:
# drwxr-xr-x  → file type + permissions (d = directory, - = file)
# 4           → number of hard links
# www-data    → owner
# www-data    → group
# 4096        → size in bytes
# Mar 1 10:00 → last modification date
# html        → file/directory name
```

**Tab completion:**

Tab completion is your best friend for navigating quickly and avoiding typos.

```bash
# Type a partial path and press Tab to autocomplete
cd /var/ww<Tab>
# Autocompletes to: cd /var/www/

# If there are multiple matches, press Tab twice to see options
cd /var/<Tab><Tab>
# Shows: backups/  cache/  crash/  lib/  local/  lock/  log/  mail/  opt/  run/  spool/  tmp/  www/

# Works with commands too
system<Tab><Tab>
# Shows: systemctl  systemd  systemd-analyze ...
```

**Practical navigation workflow:**

```bash
# Typical developer navigation session
cd /var/www/myapp         # Go to project
ls -la                    # See what's here
cd storage/logs           # Check logs
ls -lt                    # List by newest
cd -                      # Jump back to /var/www/myapp
cd /etc/nginx             # Check nginx config
ls sites-available/       # See available sites
cd -                      # Jump back to nginx dir
```

**In short:** Use `pwd` to see where you are, `cd` to move around, and `ls` with flags to see directory contents. Absolute paths start with `/` and always work. Relative paths start from your current location. Use Tab completion to save time and prevent typos.

---

## 6. File and Directory Operations

Creating, copying, moving, and deleting files and directories are the bread and butter of working in the terminal.

**mkdir — Create directories:**

```bash
# Create a single directory
mkdir projects

# Create nested directories (parent directories created automatically)
mkdir -p projects/myapp/src/components

# Create multiple directories at once
mkdir -p {css,js,images,fonts}

# Create with specific permissions
mkdir -m 755 public
```

**touch — Create files or update timestamps:**

```bash
# Create an empty file
touch index.html

# Create multiple files at once
touch style.css script.js README.md

# Update the timestamp of an existing file (without modifying content)
touch existing-file.txt

# Create files inside a new structure
mkdir -p src/{components,utils,hooks}
touch src/components/{Header,Footer,Nav}.tsx
touch src/utils/{api,helpers}.ts
```

**cp — Copy files and directories:**

```bash
# Copy a file
cp original.txt copy.txt

# Copy a file to another directory
cp config.json /var/www/myapp/

# Copy an entire directory (must use -r for recursive)
cp -r src/ src-backup/

# Copy with verbose output (shows what is being copied)
cp -rv project/ project-backup/

# Copy and preserve permissions, timestamps, and ownership
cp -rp /var/www/myapp/ /var/www/myapp-backup/

# Interactive mode (ask before overwriting)
cp -i important.conf /etc/nginx/
```

**mv — Move or rename files and directories:**

```bash
# Rename a file
mv old-name.txt new-name.txt

# Move a file to another directory
mv report.pdf /home/anwar/documents/

# Move and rename at the same time
mv draft.md /home/anwar/documents/final-report.md

# Move a directory
mv old-project/ /var/www/

# Move multiple files to a directory
mv *.log /var/log/archive/

# Interactive mode (ask before overwriting)
mv -i config.json /etc/myapp/
```

**rm — Remove files and directories:**

```bash
# Remove a file
rm unwanted-file.txt

# Remove multiple files
rm file1.txt file2.txt file3.txt

# Remove a directory and all its contents (recursive + force)
rm -rf old-project/

# Interactive mode (ask before each deletion)
rm -i *.tmp

# Remove all files with a specific extension
rm *.log

# Remove empty directories only
rmdir empty-directory/
```

**Safety tips for rm:**

```bash
# DANGEROUS — never run this (deletes everything from root)
# rm -rf /                    # DO NOT RUN THIS

# DANGEROUS — be careful with wildcards
# rm -rf *                    # Deletes everything in current directory

# SAFER alternatives:
# 1. Always double-check with ls first
ls *.log                      # Preview what will be deleted
rm *.log                      # Then delete

# 2. Use interactive mode for important operations
rm -ri old-directory/

# 3. Use trash-cli instead of rm for recoverable deletes
# sudo apt install trash-cli
# trash-put file.txt          # Moves to trash instead of permanent delete
# trash-list                  # View trashed files
# trash-restore               # Recover a file
```

**ln — Create links (hard links and symbolic links):**

Links allow you to access the same file from multiple locations.

```bash
# Symbolic link (symlink) — a shortcut that points to a file path
ln -s /var/www/myapp/current /var/www/myapp/public

# Common symlink examples
ln -s /etc/nginx/sites-available/myapp.conf /etc/nginx/sites-enabled/myapp.conf
ln -s /usr/bin/python3 /usr/bin/python

# Hard link — another name for the same file (shares the same data on disk)
ln original.txt hardlink.txt

# Check if a file is a symlink
ls -la /usr/bin/python
# lrwxrwxrwx 1 root root 7 Mar  1 10:00 /usr/bin/python -> python3

# Find broken symlinks
find /var/www/ -xtype l
```

**Hard link vs Symbolic link:**

| Feature | Hard Link | Symbolic Link |
|---------|-----------|---------------|
| **Points to** | Same data on disk (inode) | File path (name) |
| **Cross filesystems** | No | Yes |
| **Works if original deleted** | Yes (data still exists) | No (becomes broken link) |
| **Can link directories** | No | Yes |
| **File size** | Same as original | Small (stores path only) |
| **Common use case** | Backup references | Config shortcuts, version switching |

**Wildcards (globbing):**

Wildcards allow you to match multiple files at once.

```bash
# * — matches any number of characters
ls *.js                       # All JavaScript files
cp *.png images/              # Copy all PNG files
rm *.tmp                      # Delete all temp files

# ? — matches exactly one character
ls file?.txt                  # Matches file1.txt, fileA.txt (not file10.txt)

# [] — matches any one character in the brackets
ls file[123].txt              # Matches file1.txt, file2.txt, file3.txt
ls file[a-z].txt              # Matches filea.txt through filez.txt
ls *.[jt]s                    # Matches .js and .ts files

# {} — brace expansion (not technically a wildcard, but very useful)
mkdir -p {dev,staging,prod}
touch {index,about,contact}.html
cp config.{json,json.bak}     # Copy config.json to config.json.bak
```

**In short:** Use `mkdir -p` to create nested directories, `touch` to create files, `cp -r` to copy directories, `mv` to move or rename, and `rm -rf` to delete. Always preview with `ls` before deleting. Use symlinks for config shortcuts and hard links for data references. Wildcards (`*`, `?`, `[]`) save you from typing long file lists.

---

## 7. File Permissions (chmod, chown, rwx)

Linux file permissions control who can read, write, and execute files. Understanding permissions is critical for security and for fixing the inevitable "Permission denied" errors.

**The three permission types:**

| Symbol | Permission | For files | For directories | Numeric value |
|--------|-----------|-----------|-----------------|---------------|
| `r` | Read | View file contents | List directory contents | 4 |
| `w` | Write | Modify file contents | Create/delete files in directory | 2 |
| `x` | Execute | Run file as program | Enter (cd into) the directory | 1 |

**The three permission groups:**

- **User (u)** — the file's owner
- **Group (g)** — users in the file's group
- **Others (o)** — everyone else on the system

**Reading permission strings:**

```bash
ls -la
# -rwxr-xr-x 1 anwar developers 4096 Mar 1 10:00 deploy.sh
# ^^^^^^^^^^
# │├──┤├──┤├──┤
# │ u   g   o
# │
# └── file type (- = file, d = directory, l = symlink)

# Breaking down: rwxr-xr-x
# rwx = User (owner) can read, write, execute
# r-x = Group can read and execute (no write)
# r-x = Others can read and execute (no write)
```

**Numeric (octal) permissions:**

Each permission has a numeric value: read=4, write=2, execute=1. Add them together for each group.

```bash
# Common permission values
# 755 = rwxr-xr-x (owner: full, group: read+execute, others: read+execute)
# 644 = rw-r--r-- (owner: read+write, group: read, others: read)
# 700 = rwx------ (owner: full, nobody else)
# 600 = rw------- (owner: read+write, nobody else)
# 777 = rwxrwxrwx (everyone: full — AVOID this in production!)

# How to calculate:
# r=4, w=2, x=1
# rwx = 4+2+1 = 7
# rw- = 4+2+0 = 6
# r-x = 4+0+1 = 5
# r-- = 4+0+0 = 4
```

**Common permission values reference:**

| Numeric | Symbolic | Meaning | Common use |
|---------|----------|---------|------------|
| `755` | `rwxr-xr-x` | Owner: full, others: read+execute | Directories, executable scripts |
| `644` | `rw-r--r--` | Owner: read+write, others: read only | Regular files, config files |
| `700` | `rwx------` | Owner only: full access | Private directories, SSH keys dir |
| `600` | `rw-------` | Owner only: read+write | SSH private keys, secrets |
| `775` | `rwxrwxr-x` | Owner+group: full, others: read+execute | Shared project directories |
| `664` | `rw-rw-r--` | Owner+group: read+write, others: read | Shared files |
| `777` | `rwxrwxrwx` | Everyone: full access | **AVOID** — security risk |
| `000` | `---------` | No access for anyone | Locked files |

**chmod — Change file permissions:**

```bash
# Numeric mode (most common)
chmod 755 deploy.sh           # rwxr-xr-x
chmod 644 config.json         # rw-r--r--
chmod 600 ~/.ssh/id_rsa       # rw------- (SSH key must be 600)
chmod 700 ~/.ssh/             # rwx------ (SSH directory must be 700)

# Symbolic mode
chmod u+x script.sh           # Add execute permission for user (owner)
chmod g+w shared-file.txt     # Add write permission for group
chmod o-r secret.txt          # Remove read permission for others
chmod a+r public.html         # Add read permission for all (a = all)
chmod u+rwx,g+rx,o+rx file   # Same as chmod 755

# Apply permissions recursively to all files in a directory
chmod -R 755 /var/www/myapp/

# Make a script executable
chmod +x deploy.sh
./deploy.sh                    # Now you can run it
```

**chown — Change file ownership:**

```bash
# Change owner
sudo chown anwar file.txt

# Change owner and group
sudo chown anwar:developers file.txt

# Change only the group
sudo chgrp developers file.txt
# or
sudo chown :developers file.txt

# Recursive ownership change (common for web apps)
sudo chown -R www-data:www-data /var/www/myapp/

# Common web server ownership setup
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
sudo chmod -R 775 /var/www/html/storage/
sudo chmod -R 775 /var/www/html/bootstrap/cache/
```

**Laravel-specific permissions:**

```bash
# Standard Laravel permissions setup
cd /var/www/myapp

# Set ownership to web server user
sudo chown -R www-data:www-data .

# Set directory permissions
sudo find . -type d -exec chmod 755 {} \;

# Set file permissions
sudo find . -type f -exec chmod 644 {} \;

# Storage and cache need to be writable
sudo chmod -R 775 storage/
sudo chmod -R 775 bootstrap/cache/
```

**Special permissions (SUID, SGID, Sticky Bit):**

These are advanced permissions you will encounter on system files.

```bash
# SUID (Set User ID) — file executes as the file owner, not the user running it
# Example: /usr/bin/passwd runs as root so normal users can change their password
ls -la /usr/bin/passwd
# -rwsr-xr-x 1 root root 68208 Mar 1 10:00 /usr/bin/passwd
#    ^-- 's' instead of 'x' means SUID is set

chmod u+s executable          # Set SUID
chmod 4755 executable         # Numeric: prefix with 4

# SGID (Set Group ID) — files created in this directory inherit the directory's group
chmod g+s shared-directory/   # Set SGID
chmod 2755 shared-directory/  # Numeric: prefix with 2

# Sticky Bit — only the file owner can delete files in this directory
# /tmp uses this: anyone can create files, but only owners can delete their own
ls -ld /tmp
# drwxrwxrwt 15 root root 4096 Mar 1 10:00 /tmp
#          ^-- 't' means sticky bit is set

chmod +t shared-directory/    # Set sticky bit
chmod 1777 shared-directory/  # Numeric: prefix with 1
```

**In short:** Linux permissions control who can read (r=4), write (w=2), and execute (x=1) files. Use `chmod` to change permissions (755 for directories, 644 for files) and `chown` to change ownership. For web apps, the web server user (www-data) needs to own the files, and storage directories need write access (775).

---

## 8. Users and Groups

Linux is a multi-user system. Understanding how users and groups work is essential for managing server access and security.

**Understanding users:**

Every process and file on Linux is associated with a user. There are three types:

- **Root (superuser)** — UID 0, has unrestricted access to the entire system
- **System users** — UIDs 1-999, created for services (www-data, mysql, nginx)
- **Regular users** — UIDs 1000+, created for human users

```bash
# Check who you are
whoami
# Output: anwar

# Get detailed user information
id
# Output: uid=1000(anwar) gid=1000(anwar) groups=1000(anwar),27(sudo),33(www-data)

# See which groups you belong to
groups
# Output: anwar sudo www-data

# Check another user's info
id www-data
# Output: uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

**User management commands:**

```bash
# Create a new user
sudo useradd -m -s /bin/bash deploy
# -m = create home directory
# -s = set default shell

# A more complete user creation
sudo useradd -m -s /bin/bash -G sudo,www-data -c "Deploy User" deploy

# Set or change a user's password
sudo passwd deploy

# Modify an existing user
sudo usermod -aG sudo deploy       # Add user to sudo group (-a = append)
sudo usermod -aG www-data deploy   # Add user to www-data group
sudo usermod -s /bin/zsh anwar     # Change default shell
sudo usermod -l newname oldname    # Rename a user

# Lock/unlock a user account
sudo usermod -L deploy             # Lock account (disable login)
sudo usermod -U deploy             # Unlock account

# Delete a user
sudo userdel deploy                # Delete user (keep home directory)
sudo userdel -r deploy             # Delete user AND home directory
```

**Group management:**

```bash
# Create a new group
sudo groupadd developers

# Add a user to a group
sudo usermod -aG developers anwar

# Remove a user from a group
sudo gpasswd -d anwar developers

# Delete a group
sudo groupdel developers

# List all groups on the system
cat /etc/group

# See members of a specific group
getent group sudo
# Output: sudo:x:27:anwar,deploy
```

**Important user files:**

```bash
# /etc/passwd — user account information (readable by all)
cat /etc/passwd
# anwar:x:1000:1000:Anwar Barakat:/home/anwar:/bin/bash
# Format: username:password(x=in shadow):UID:GID:comment:home:shell

# /etc/shadow — encrypted passwords (readable only by root)
sudo cat /etc/shadow
# anwar:$6$randomsalt$hashhere:19782:0:99999:7:::
# Format: username:encrypted_password:last_change:min:max:warn:inactive:expire

# /etc/group — group information
cat /etc/group
# sudo:x:27:anwar,deploy
# Format: group_name:password:GID:member_list
```

**sudo — Superuser Do:**

The `sudo` command lets authorized users run commands as root.

```bash
# Run a command as root
sudo apt update

# Run a command as a different user
sudo -u www-data php artisan cache:clear

# Open a root shell
sudo -i
# or
sudo su -

# Edit the sudoers file safely (NEVER edit directly)
sudo visudo

# Common sudoers entries:
# anwar ALL=(ALL:ALL) ALL           # User can run any command with password
# deploy ALL=(ALL) NOPASSWD: ALL    # User can run any command without password
# %developers ALL=(ALL) ALL         # Group can run any command with password
```

**Practical example — setting up a deploy user:**

```bash
# Create the deploy user
sudo useradd -m -s /bin/bash -G www-data deploy

# Set a strong password
sudo passwd deploy

# Allow deploy to restart services without password
sudo visudo
# Add this line:
# deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx, /usr/bin/systemctl restart php8.3-fpm

# Set up SSH key for the deploy user
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo touch /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

**Switching users:**

```bash
# Switch to another user
su - deploy                   # Switch to deploy user (needs password)
sudo su - deploy              # Switch without needing deploy's password

# Switch to root
su -                          # Needs root password
sudo -i                       # Uses your sudo password (preferred)

# Run a single command as another user
sudo -u deploy whoami         # Output: deploy
sudo -u www-data ls /var/www/ # List files as www-data
```

**In short:** Linux has root (superuser), system users (for services), and regular users. Use `useradd` to create users, `usermod -aG` to add them to groups, and `passwd` to set passwords. The `sudo` command runs commands as root. User info is stored in `/etc/passwd` and encrypted passwords in `/etc/shadow`.

---

## 9. Text Processing Commands

Linux provides an incredibly powerful set of tools for viewing, searching, filtering, and transforming text. These commands are the backbone of debugging, log analysis, and scripting.

**Viewing file contents:**

```bash
# cat — display entire file contents (best for small files)
cat config.json
cat /etc/nginx/nginx.conf

# Concatenate multiple files
cat header.html body.html footer.html > page.html

# Display with line numbers
cat -n script.sh

# less — paginated viewer (best for large files)
less /var/log/syslog
# Navigation in less:
#   Space / f     = next page
#   b             = previous page
#   /pattern      = search forward
#   ?pattern      = search backward
#   n             = next match
#   N             = previous match
#   g             = go to beginning
#   G             = go to end
#   q             = quit

# more — simpler paginated viewer (only forward navigation)
more /var/log/syslog

# head — show the first N lines (default: 10)
head /var/log/syslog
head -20 /var/log/syslog       # First 20 lines
head -1 /etc/hostname          # First line only

# tail — show the last N lines (default: 10)
tail /var/log/syslog
tail -50 /var/log/syslog       # Last 50 lines

# tail -f — follow a file in real time (essential for monitoring logs)
tail -f /var/log/nginx/error.log
# This keeps running and shows new lines as they are added
# Press Ctrl+C to stop

# Follow multiple log files simultaneously
tail -f /var/log/nginx/error.log /var/log/php8.3-fpm.log
```

**grep — Search for patterns in text:**

```bash
# Basic search
grep "error" /var/log/syslog

# Case-insensitive search
grep -i "error" /var/log/syslog

# Recursive search through directories
grep -r "DB_PASSWORD" /var/www/myapp/

# Show line numbers
grep -n "function" script.js

# Show N lines of context around matches
grep -C 3 "error" /var/log/syslog    # 3 lines before and after
grep -B 5 "error" /var/log/syslog    # 5 lines before
grep -A 5 "error" /var/log/syslog    # 5 lines after

# Count matches
grep -c "404" /var/log/nginx/access.log

# Show only filenames with matches
grep -rl "TODO" /var/www/myapp/src/

# Invert match (show lines that do NOT match)
grep -v "debug" /var/log/syslog

# Use regex
grep -E "error|warning|critical" /var/log/syslog

# Search for exact word (not partial matches)
grep -w "root" /etc/passwd

# Common real-world grep examples
grep "500" /var/log/nginx/access.log          # Find server errors
grep -i "out of memory" /var/log/syslog       # Memory issues
grep "Failed password" /var/log/auth.log      # Failed login attempts
```

**find — Search for files and directories:**

```bash
# Find by name
find /var/www/ -name "*.php"

# Find by name (case-insensitive)
find /var/www/ -iname "readme.md"

# Find by type
find /var/www/ -type f               # Files only
find /var/www/ -type d               # Directories only
find /var/www/ -type l               # Symlinks only

# Find by size
find / -type f -size +100M           # Files larger than 100MB
find /tmp -type f -size +1G          # Files larger than 1GB
find . -type f -size -1k             # Files smaller than 1KB

# Find by modification time
find /var/log -type f -mtime -1      # Modified in the last 24 hours
find /var/log -type f -mtime +30     # Modified more than 30 days ago
find /tmp -type f -mmin -60          # Modified in the last 60 minutes

# Find and execute commands on results
find /var/www/ -name "*.log" -delete                     # Delete all .log files
find /var/www/ -type f -name "*.php" -exec chmod 644 {} \;  # Set permissions
find /tmp -type f -mtime +7 -exec rm {} \;               # Delete files older than 7 days

# Find empty files or directories
find /var/www/ -type f -empty
find /var/www/ -type d -empty

# Combine conditions
find /var/www/ -type f -name "*.js" -size +1M            # Large JS files
find . -type f \( -name "*.jpg" -o -name "*.png" \)      # JPG or PNG files
```

**awk — Column-based text processing:**

```bash
# Print specific columns (awk treats spaces/tabs as delimiters)
ls -la | awk '{print $5, $9}'         # Print size and filename
ps aux | awk '{print $1, $2, $11}'    # Print user, PID, and command

# Print with custom formatting
df -h | awk '{printf "%-20s %s\n", $6, $5}'   # Filesystem usage with alignment

# Filter rows
awk -F: '$3 >= 1000 {print $1}' /etc/passwd   # List regular users (UID >= 1000)

# Sum a column
cat access.log | awk '{sum += $10} END {print sum}'   # Total bytes transferred

# Use different delimiter
awk -F: '{print $1, $6}' /etc/passwd           # Username and home directory
```

**sed — Stream editor (find and replace):**

```bash
# Replace first occurrence on each line
sed 's/old/new/' file.txt

# Replace all occurrences on each line
sed 's/old/new/g' file.txt

# Replace in-place (modify the file)
sed -i 's/old/new/g' file.txt

# Replace with backup
sed -i.bak 's/old/new/g' file.txt     # Creates file.txt.bak

# Delete lines matching a pattern
sed -i '/debug/d' logfile.txt

# Delete empty lines
sed -i '/^$/d' file.txt

# Replace on a specific line number
sed -i '5s/old/new/' file.txt          # Only replace on line 5

# Practical examples
sed -i 's/APP_DEBUG=true/APP_DEBUG=false/g' .env
sed -i 's/localhost/production.example.com/g' config.json
```

**Other text utilities:**

```bash
# wc — word/line/character count
wc -l file.txt                         # Count lines
wc -w file.txt                         # Count words
wc -c file.txt                         # Count bytes
find . -name "*.php" | wc -l           # Count PHP files

# sort — sort lines
sort file.txt                          # Alphabetical sort
sort -n numbers.txt                    # Numeric sort
sort -r file.txt                       # Reverse sort
sort -u file.txt                       # Sort and remove duplicates
sort -t: -k3 -n /etc/passwd           # Sort by 3rd column (UID) numerically

# uniq — remove adjacent duplicate lines (usually used with sort)
sort access.log | uniq                 # Remove duplicates
sort access.log | uniq -c             # Count occurrences
sort access.log | uniq -c | sort -rn  # Most common lines first

# cut — extract columns
cut -d: -f1 /etc/passwd               # First column (username)
cut -d, -f1,3 data.csv                # Columns 1 and 3 from CSV
```

**Piping (|) — Connecting commands:**

The pipe operator sends the output of one command as input to the next. This is one of the most powerful features of Linux.

```bash
# Find the top 10 largest files
du -ah /var/www/ | sort -rh | head -10

# Count unique IP addresses in access log
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20

# Find PHP files containing "password" (case-insensitive)
find /var/www/ -name "*.php" | xargs grep -il "password"

# Monitor log for errors in real time
tail -f /var/log/syslog | grep --color "error"

# Get disk usage of each directory, sorted by size
du -sh /var/www/*/ | sort -rh

# Count 404 errors per URL
grep "404" /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10

# Find processes using the most memory
ps aux | sort -k4 -rn | head -10
```

**In short:** Use `cat`/`less`/`head`/`tail` to view files, `grep` to search text, `find` to search for files, `awk` to extract columns, `sed` to find and replace, and pipes `|` to chain commands together. The combination of these tools can handle virtually any text processing task.

---

## 10. Process Management

Every running program on Linux is a process. Understanding how to view, control, and manage processes is essential for server administration and debugging.

**ps — View running processes:**

```bash
# Show all processes with full details
ps aux
# USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
# root         1  0.0  0.1 169432 13300 ?        Ss   Feb15  0:12 /sbin/init
# www-data  1234  0.5  2.1 425736 86432 ?        S    10:00  1:23 php-fpm: pool www

# Column meanings:
# USER   = process owner
# PID    = process ID
# %CPU   = CPU usage percentage
# %MEM   = memory usage percentage
# VSZ    = virtual memory size
# RSS    = resident memory (actual physical memory used)
# TTY    = terminal (? means no terminal / daemon)
# STAT   = process state (S=sleeping, R=running, Z=zombie, D=disk wait)
# COMMAND = the command that started the process

# Find a specific process
ps aux | grep nginx
ps aux | grep php-fpm
ps aux | grep node

# Show process tree (parent-child relationships)
ps auxf

# Show only your processes
ps ux
```

**top and htop — Real-time process monitoring:**

```bash
# top — built-in process monitor
top
# Key commands inside top:
#   M = sort by memory
#   P = sort by CPU
#   k = kill a process (enter PID)
#   q = quit
#   1 = show individual CPU cores
#   h = help

# htop — a better version of top (may need to install)
sudo apt install htop
htop
# Key commands inside htop:
#   F4 = filter processes
#   F5 = tree view
#   F6 = sort by column
#   F9 = kill a process
#   F10 / q = quit
```

**kill — Terminate processes:**

```bash
# Kill a process by PID (sends SIGTERM — graceful shutdown)
kill 1234

# Force kill a process (sends SIGKILL — immediate termination)
kill -9 1234

# Common signals:
# SIGTERM (15) = "Please shut down gracefully" (default)
# SIGKILL (9)  = "Stop immediately, no cleanup" (last resort)
# SIGHUP (1)   = "Reload configuration"
# SIGSTOP (19) = "Pause the process"
# SIGCONT (18) = "Resume a paused process"

# Kill all processes by name
killall nginx
killall -9 php-fpm

# Kill processes matching a pattern
pkill -f "node server.js"

# Send reload signal to Nginx (reload config without downtime)
sudo kill -HUP $(cat /var/run/nginx.pid)
# or
sudo nginx -s reload
```

**Background and foreground processes:**

```bash
# Run a command in the background
long-running-command &

# Example: run a Node.js server in the background
node server.js &

# List background jobs
jobs
# [1]+  Running    node server.js &
# [2]-  Stopped    vim config.json

# Bring a background job to the foreground
fg %1                         # Bring job 1 to foreground
fg                            # Bring most recent job to foreground

# Send a foreground process to the background
# 1. Press Ctrl+Z to pause it
# 2. Type 'bg' to resume it in the background
bg

# nohup — keep a process running after you log out
nohup node server.js &
nohup ./deploy.sh > deploy.log 2>&1 &
# Output goes to nohup.out by default

# disown — detach a running job from the terminal
node server.js &
disown %1
```

**systemctl — Manage system services (systemd):**

```bash
# Check the status of a service
sudo systemctl status nginx
sudo systemctl status php8.3-fpm
sudo systemctl status mysql

# Start a service
sudo systemctl start nginx

# Stop a service
sudo systemctl stop nginx

# Restart a service (stop + start)
sudo systemctl restart nginx

# Reload configuration without restarting (graceful)
sudo systemctl reload nginx

# Enable a service to start on boot
sudo systemctl enable nginx

# Disable a service from starting on boot
sudo systemctl disable nginx

# Check if a service is enabled
sudo systemctl is-enabled nginx

# Check if a service is active (running)
sudo systemctl is-active nginx

# List all running services
sudo systemctl list-units --type=service --state=running

# List all failed services
sudo systemctl list-units --type=service --state=failed

# View service logs
sudo journalctl -u nginx -f               # Follow logs
sudo journalctl -u nginx --since "1 hour ago"
sudo journalctl -u php8.3-fpm --since today
```

**Practical process management:**

```bash
# Find what is using port 80
sudo lsof -i :80
sudo ss -tlnp | grep :80

# Find and kill a process using a specific port
sudo fuser -k 3000/tcp        # Kill whatever is on port 3000

# Check system load
uptime
# Output: 10:30:00 up 45 days, load average: 0.52, 0.58, 0.59
# Load average: 1-min, 5-min, 15-min
# A load of 1.0 = 1 CPU core is 100% busy
# If load > number of CPU cores, the system is overloaded

# Count CPU cores (to interpret load average)
nproc
# Output: 4

# Watch a command repeatedly (runs every 2 seconds by default)
watch -n 5 'ps aux | grep php-fpm | wc -l'   # Count PHP-FPM processes every 5s
```

**In short:** Use `ps aux` to see running processes, `top`/`htop` for real-time monitoring, `kill` for graceful shutdown and `kill -9` as a last resort. Use `&` to run processes in the background and `nohup` to keep them running after logout. For services, use `systemctl` to start, stop, restart, enable, and check status.

---

## 11. Package Management

Package managers are how you install, update, and remove software on Linux. Different distributions use different package managers, but the concepts are the same.

**apt — Debian/Ubuntu package manager:**

```bash
# Update the package index (always do this first)
sudo apt update

# Upgrade all installed packages
sudo apt upgrade -y

# Update index and upgrade in one command
sudo apt update && sudo apt upgrade -y

# Install a package
sudo apt install nginx

# Install multiple packages
sudo apt install nginx php8.3-fpm mysql-server

# Install a specific version
sudo apt install nginx=1.24.0-1ubuntu1

# Remove a package (keeps config files)
sudo apt remove nginx

# Remove a package and its config files
sudo apt purge nginx

# Remove unused dependencies
sudo apt autoremove

# Search for a package
apt search "php8.3"

# Show package information
apt show nginx

# List installed packages
apt list --installed

# List upgradable packages
apt list --upgradable

# Fix broken packages
sudo apt --fix-broken install

# Clean downloaded package cache
sudo apt clean
sudo apt autoclean
```

**yum/dnf — CentOS/RHEL/Rocky package manager:**

```bash
# Update all packages
sudo dnf update -y

# Install a package
sudo dnf install nginx

# Remove a package
sudo dnf remove nginx

# Search for a package
dnf search php

# Show package info
dnf info nginx

# List installed packages
dnf list installed

# Enable a repository
sudo dnf install epel-release

# Clean cache
sudo dnf clean all
```

**apt vs dnf command comparison:**

| Action | apt (Debian/Ubuntu) | dnf (CentOS/Rocky) |
|--------|---------------------|---------------------|
| **Update package index** | `sudo apt update` | `sudo dnf check-update` |
| **Upgrade all packages** | `sudo apt upgrade -y` | `sudo dnf update -y` |
| **Install a package** | `sudo apt install nginx` | `sudo dnf install nginx` |
| **Remove a package** | `sudo apt remove nginx` | `sudo dnf remove nginx` |
| **Remove + config files** | `sudo apt purge nginx` | `sudo dnf remove nginx` |
| **Search for a package** | `apt search nginx` | `dnf search nginx` |
| **Show package info** | `apt show nginx` | `dnf info nginx` |
| **List installed packages** | `apt list --installed` | `dnf list installed` |
| **Remove unused deps** | `sudo apt autoremove` | `sudo dnf autoremove` |
| **Clean cache** | `sudo apt clean` | `sudo dnf clean all` |
| **Add repository** | `sudo add-apt-repository ppa:...` | `sudo dnf config-manager --add-repo ...` |

**PPAs (Personal Package Archives) — Ubuntu:**

PPAs let you install software from third-party repositories.

```bash
# Add a PPA
sudo add-apt-repository ppa:ondrej/php
sudo apt update

# Remove a PPA
sudo add-apt-repository --remove ppa:ondrej/php

# List all PPAs
grep -r "^deb " /etc/apt/sources.list.d/
```

**snap and flatpak — Universal package managers:**

```bash
# Snap (Ubuntu)
sudo snap install code --classic          # Install VS Code
sudo snap install node --classic --channel=20
snap list                                 # List installed snaps
sudo snap refresh                         # Update all snaps
sudo snap remove code                     # Remove a snap

# Flatpak (distribution-independent)
sudo apt install flatpak
flatpak install flathub org.mozilla.firefox
flatpak list
flatpak update
flatpak uninstall org.mozilla.firefox
```

**Practical package management workflow:**

```bash
# Setting up a fresh web server (Ubuntu)
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y \
  nginx \
  php8.3-fpm \
  php8.3-mysql \
  php8.3-mbstring \
  php8.3-xml \
  php8.3-curl \
  php8.3-zip \
  mysql-server \
  git \
  curl \
  unzip \
  htop \
  ufw

# Verify installations
nginx -v
php -v
mysql --version
git --version
node -v
```

**In short:** Use `apt` on Ubuntu/Debian and `dnf` on CentOS/Rocky to install, update, and remove software. Always run `apt update` before installing anything. PPAs add third-party repositories for newer software versions. Snap and Flatpak provide distribution-independent packages.

---

## 12. SSH and Remote Access

**SSH (Secure Shell)** is the primary way developers connect to remote servers. It provides encrypted communication between your local machine and a remote server.

**What is SSH?**

- SSH is a cryptographic network protocol for secure remote access
- It encrypts all traffic between your computer and the server
- Default port: **22**
- Replaces insecure protocols like Telnet and rlogin

**Basic SSH connection:**

```bash
# Connect to a remote server
ssh user@server-ip
ssh anwar@192.168.1.100
ssh deploy@example.com

# Connect on a non-default port
ssh -p 2222 user@server-ip

# Connect with verbose output (useful for debugging)
ssh -v user@server-ip

# Run a single command without opening a session
ssh user@server-ip 'ls -la /var/www'
ssh user@server-ip 'sudo systemctl status nginx'

# Run multiple commands
ssh user@server-ip 'cd /var/www/myapp && git pull && php artisan migrate'
```

**SSH key-based authentication:**

SSH keys are more secure than passwords and allow passwordless login.

```bash
# Generate an SSH key pair
ssh-keygen -t ed25519 -C "anwar@example.com"
# -t ed25519 = algorithm (more secure and faster than RSA)
# -C = comment (usually your email)
# When prompted:
#   File location: press Enter for default (~/.ssh/id_ed25519)
#   Passphrase: optional but recommended for extra security

# Alternative: RSA key (wider compatibility with older servers)
ssh-keygen -t rsa -b 4096 -C "anwar@example.com"

# Your keys are stored in:
# ~/.ssh/id_ed25519       (private key — NEVER share this)
# ~/.ssh/id_ed25519.pub   (public key — safe to share)

# Copy your public key to the remote server
ssh-copy-id user@server-ip
ssh-copy-id -p 2222 user@server-ip

# Manual method (if ssh-copy-id is not available)
cat ~/.ssh/id_ed25519.pub | ssh user@server-ip 'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```

**SSH config file — create aliases for frequent connections:**

```bash
# Edit SSH config
nano ~/.ssh/config
```

```bash
# ~/.ssh/config example

# Production server
Host production
    HostName 203.0.113.50
    User deploy
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# Staging server
Host staging
    HostName 203.0.113.51
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519

# Database server (accessed through production)
Host db
    HostName 10.0.0.5
    User dbadmin
    ProxyJump production

# Default settings for all connections
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
```

```bash
# Now you can connect with short names
ssh production              # Instead of: ssh deploy@203.0.113.50
ssh staging                 # Instead of: ssh -p 2222 deploy@203.0.113.51
ssh db                      # Connects through production to reach db
```

**File transfer with scp and rsync:**

```bash
# scp — Secure Copy (simple file transfer)
# Copy file from local to remote
scp file.txt user@server:/path/to/destination/

# Copy file from remote to local
scp user@server:/var/log/nginx/error.log ./

# Copy an entire directory
scp -r ./project/ user@server:/var/www/

# rsync — more powerful file synchronization
# Sync a local directory to remote (only transfers changes)
rsync -avz ./project/ user@server:/var/www/project/
# -a = archive mode (preserves permissions, timestamps, symlinks)
# -v = verbose
# -z = compress during transfer

# Sync with delete (remove files on remote that don't exist locally)
rsync -avz --delete ./project/ user@server:/var/www/project/

# Exclude files during sync
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
  ./project/ user@server:/var/www/project/

# Dry run (show what would be transferred without actually doing it)
rsync -avzn ./project/ user@server:/var/www/project/
```

**SSH tunneling (port forwarding):**

```bash
# Local port forwarding — access a remote service through a local port
# Access remote MySQL (port 3306) through local port 3307
ssh -L 3307:localhost:3306 user@server
# Now connect to localhost:3307 to reach the remote MySQL

# Access a remote web app running on port 3000
ssh -L 8080:localhost:3000 user@server
# Now open http://localhost:8080 in your browser

# Remote port forwarding — expose a local service to the remote server
ssh -R 9090:localhost:3000 user@server
# Now the remote server can access your local app at localhost:9090
```

**SSH security best practices:**

```bash
# Edit SSH server configuration
sudo nano /etc/ssh/sshd_config

# Recommended security settings:
# PermitRootLogin no              # Disable root login via SSH
# PasswordAuthentication no       # Disable password auth (keys only)
# PubkeyAuthentication yes        # Enable key-based auth
# Port 2222                       # Change default port (security through obscurity)
# MaxAuthTries 3                  # Limit login attempts
# AllowUsers deploy anwar         # Only allow specific users

# After editing, restart SSH
sudo systemctl restart sshd

# IMPORTANT: Always test SSH access in a NEW terminal before closing
# your current session after changing SSH config!
```

**In short:** SSH is the standard for remote server access. Use `ssh-keygen` to create keys, `ssh-copy-id` to install them on servers, and `~/.ssh/config` to create connection aliases. Use `scp` for simple file transfers and `rsync` for efficient synchronization. For security, disable password authentication and root login.

---

## 13. Networking Commands

Networking commands help you debug connectivity issues, transfer data, check open ports, and manage firewall rules.

**curl — Transfer data to/from servers:**

```bash
# Simple GET request
curl https://api.example.com/users

# GET with response headers
curl -i https://api.example.com/users

# GET only response headers
curl -I https://api.example.com/users

# GET with verbose output (great for debugging)
curl -v https://api.example.com/users

# POST request with JSON body
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Anwar", "email": "anwar@example.com"}'

# POST with authentication
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"email": "admin@example.com", "password": "secret"}'

# PUT request
curl -X PUT https://api.example.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# DELETE request
curl -X DELETE https://api.example.com/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Download a file
curl -O https://example.com/file.zip
curl -o custom-name.zip https://example.com/file.zip

# Follow redirects
curl -L https://example.com/redirect

# Silent mode (no progress bar)
curl -s https://api.example.com/health

# With timeout
curl --connect-timeout 5 --max-time 10 https://api.example.com/health

# Send form data
curl -X POST https://example.com/upload \
  -F "file=@/path/to/document.pdf" \
  -F "description=My document"
```

**wget — Download files:**

```bash
# Download a file
wget https://example.com/file.zip

# Download with custom filename
wget -O custom-name.zip https://example.com/file.zip

# Download in background
wget -b https://example.com/large-file.iso

# Resume an interrupted download
wget -c https://example.com/large-file.iso

# Download an entire website (for offline viewing)
wget --mirror --convert-links --page-requisites https://example.com
```

**ping — Test network connectivity:**

```bash
# Ping a host
ping google.com

# Ping with a specific count
ping -c 5 google.com          # Send 5 pings and stop

# Ping with interval
ping -i 2 google.com          # Ping every 2 seconds

# Quick connectivity check
ping -c 1 -W 2 google.com && echo "Online" || echo "Offline"
```

**netstat / ss — Check network ports and connections:**

```bash
# ss (modern replacement for netstat)
# Show all listening ports with process info
sudo ss -tlnp
# -t = TCP connections
# -l = listening (server) ports only
# -n = show port numbers (not service names)
# -p = show process using the port

# Show all connections (listening + established)
sudo ss -tanp

# Find what is using port 80
sudo ss -tlnp | grep :80

# Find what is using port 3000
sudo ss -tlnp | grep :3000

# netstat (older but still common)
sudo netstat -tlnp             # Same as ss -tlnp
sudo netstat -tanp | grep :80  # Find port 80 usage
```

**ifconfig / ip — Network interface information:**

```bash
# ip addr (modern — preferred)
ip addr
ip addr show eth0              # Show specific interface

# Get just your IP address
ip addr show eth0 | grep "inet " | awk '{print $2}'

# ifconfig (older but still works)
ifconfig
ifconfig eth0

# Check public IP address
curl ifconfig.me
curl icanhazip.com
curl api.ipify.org
```

**DNS tools — nslookup and dig:**

```bash
# nslookup — quick DNS lookup
nslookup example.com
nslookup -type=MX example.com   # Mail server records
nslookup -type=NS example.com   # Nameserver records

# dig — detailed DNS lookup
dig example.com
dig example.com +short           # Just the IP address
dig example.com MX               # Mail records
dig example.com NS               # Nameserver records
dig example.com ANY              # All records
dig @8.8.8.8 example.com        # Query specific DNS server (Google)

# Reverse DNS lookup
dig -x 93.184.216.34
```

**traceroute — Trace the path to a host:**

```bash
# See the network path to a destination
traceroute example.com

# On some systems
tracepath example.com

# Using ICMP (may need sudo)
sudo traceroute -I example.com
```

**ufw — Uncomplicated Firewall (Ubuntu):**

```bash
# Enable the firewall
sudo ufw enable

# Check firewall status
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered         # Show rules with numbers

# Allow a port
sudo ufw allow 80                # Allow HTTP
sudo ufw allow 443               # Allow HTTPS
sudo ufw allow 22                # Allow SSH
sudo ufw allow 3306              # Allow MySQL

# Allow from specific IP
sudo ufw allow from 203.0.113.50
sudo ufw allow from 203.0.113.50 to any port 22

# Deny a port
sudo ufw deny 3306               # Block MySQL from outside

# Delete a rule
sudo ufw status numbered
sudo ufw delete 3                 # Delete rule number 3

# Reset all rules
sudo ufw reset

# Common server firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22                 # SSH
sudo ufw allow 80                 # HTTP
sudo ufw allow 443                # HTTPS
sudo ufw enable
```

**In short:** Use `curl` for API requests and debugging, `wget` for downloads, `ping` for connectivity checks, `ss -tlnp` to see what is running on which port, `ip addr` for your IP address, `dig` for DNS lookups, `traceroute` to trace network paths, and `ufw` to manage firewall rules.

---

## 14. Environment Variables and PATH

Environment variables store configuration values that affect how processes run on your system. They are used extensively in application development, deployment, and system configuration.

**What are environment variables?**

An environment variable is a named value stored in the shell's environment that programs can read. They are used for configuration, secrets, and system settings.

```bash
# View all environment variables
env
printenv

# View a specific variable
echo $HOME
echo $USER
echo $SHELL
echo $PATH
echo $PWD

# Common built-in environment variables
# $HOME    — your home directory (/home/anwar)
# $USER    — your username (anwar)
# $SHELL   — your default shell (/bin/bash or /bin/zsh)
# $PATH    — directories where the system looks for commands
# $PWD     — current working directory
# $LANG    — system language and encoding
# $EDITOR  — default text editor
# $TERM    — terminal type
```

**Setting environment variables:**

```bash
# Set a variable for the current session only
export MY_VAR="hello"
echo $MY_VAR
# Output: hello

# Set a variable for a single command only
DB_HOST=localhost DB_PORT=3306 node server.js

# Unset a variable
unset MY_VAR
```

**Making environment variables permanent:**

```bash
# For a single user — add to ~/.bashrc (Bash) or ~/.zshrc (Zsh)
echo 'export EDITOR="vim"' >> ~/.bashrc
echo 'export NODE_ENV="production"' >> ~/.bashrc

# Apply changes without restarting the terminal
source ~/.bashrc

# For all users — add to /etc/environment
sudo nano /etc/environment
# Add: MY_GLOBAL_VAR="value"

# For all users with shell logic — add to /etc/profile.d/
sudo nano /etc/profile.d/custom.sh
# Add: export JAVA_HOME="/usr/lib/jvm/java-17"
```

**The PATH variable:**

PATH is a colon-separated list of directories where the system looks for executable programs when you type a command.

```bash
# View your PATH
echo $PATH
# Output: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# How PATH works:
# When you type "node", the system searches these directories in order:
# 1. /usr/local/sbin/   — is there a "node" file here? No.
# 2. /usr/local/bin/    — is there a "node" file here? Yes! Run it.
# (stops searching after the first match)

# Find where a command is located
which node
# Output: /usr/local/bin/node

which php
# Output: /usr/bin/php

# which vs whereis
whereis node
# Output: node: /usr/local/bin/node /usr/local/lib/node_modules

# Add a directory to PATH
export PATH="$PATH:/opt/myapp/bin"

# Add to the beginning of PATH (takes priority)
export PATH="/opt/myapp/bin:$PATH"

# Make it permanent
echo 'export PATH="$PATH:/opt/myapp/bin"' >> ~/.bashrc
source ~/.bashrc

# Common PATH additions
export PATH="$PATH:$HOME/.composer/vendor/bin"     # Composer global binaries
export PATH="$PATH:$HOME/.local/bin"               # pip installed binaries
export PATH="$PATH:./node_modules/.bin"            # Local npm binaries
export PATH="$PATH:$HOME/go/bin"                   # Go binaries
```

**.bashrc vs .bash_profile vs .zshrc:**

| File | When it loads | Use case |
|------|---------------|----------|
| `~/.bashrc` | Every new Bash terminal (interactive non-login shell) | Aliases, functions, prompt customization |
| `~/.bash_profile` | Login shells only (SSH, first terminal) | Environment variables, PATH |
| `~/.profile` | Login shells (fallback if no .bash_profile) | Generic login config |
| `~/.zshrc` | Every new Zsh terminal | Everything (Zsh uses this for all config) |
| `/etc/environment` | System-wide, all users | Global variables |
| `/etc/profile` | All login shells, all users | System-wide login config |

**.env files for applications:**

```bash
# .env file (commonly used in Laravel, Node.js, etc.)
# NEVER commit .env files to Git!
APP_NAME="My Application"
APP_ENV=production
APP_DEBUG=false
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=secret_password

# Load .env variables in a bash script
export $(cat .env | grep -v '^#' | xargs)

# Or source it directly (if it uses export syntax)
source .env

# Check if .env is in .gitignore
cat .gitignore | grep ".env"
```

**In short:** Environment variables store configuration values for processes. Use `export` to set them, add them to `~/.bashrc` or `~/.zshrc` for persistence. The PATH variable tells the system where to find executable commands. Use `.env` files for application-specific secrets and never commit them to Git.

---

## 15. Shell Scripting Basics

Shell scripts let you automate repetitive tasks by writing a sequence of commands in a file. If you find yourself running the same commands over and over, it is time to write a script.

**Your first shell script:**

```bash
#!/bin/bash
# This is a comment
# The first line (shebang) tells the system to use Bash to run this script

echo "Hello, World!"
echo "Today is $(date)"
echo "You are logged in as: $(whoami)"
echo "Current directory: $(pwd)"
```

```bash
# Save as hello.sh, then make it executable and run it
chmod +x hello.sh
./hello.sh
```

**Variables:**

```bash
#!/bin/bash

# Define variables (no spaces around =)
NAME="Anwar"
AGE=30
PROJECT_DIR="/var/www/myapp"

# Use variables with $
echo "Name: $NAME"
echo "Age: $AGE"
echo "Project: $PROJECT_DIR"

# String interpolation (use curly braces for clarity)
echo "Hello, ${NAME}! Welcome to ${PROJECT_DIR}."

# Command substitution — store command output in a variable
CURRENT_DATE=$(date +%Y-%m-%d)
HOSTNAME=$(hostname)
IP_ADDRESS=$(curl -s ifconfig.me)

echo "Date: $CURRENT_DATE"
echo "Host: $HOSTNAME"
echo "IP: $IP_ADDRESS"

# Read user input
read -p "Enter your name: " USER_NAME
echo "Hello, $USER_NAME!"

# Script arguments
# $0 = script name, $1 = first argument, $2 = second, etc.
# $# = number of arguments, $@ = all arguments
echo "Script name: $0"
echo "First argument: $1"
echo "All arguments: $@"
echo "Number of arguments: $#"
```

**Conditionals (if/else):**

```bash
#!/bin/bash

# Basic if/else
FILE="/var/www/myapp/.env"

if [ -f "$FILE" ]; then
    echo "$FILE exists."
else
    echo "$FILE does not exist!"
    exit 1
fi

# Check if a directory exists
DIR="/var/www/myapp"

if [ -d "$DIR" ]; then
    echo "Directory exists."
else
    echo "Creating directory..."
    mkdir -p "$DIR"
fi

# String comparison
ENV="production"

if [ "$ENV" = "production" ]; then
    echo "Running in production mode"
elif [ "$ENV" = "staging" ]; then
    echo "Running in staging mode"
else
    echo "Running in development mode"
fi

# Numeric comparison
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

if [ "$DISK_USAGE" -gt 80 ]; then
    echo "WARNING: Disk usage is at ${DISK_USAGE}%!"
elif [ "$DISK_USAGE" -gt 60 ]; then
    echo "NOTICE: Disk usage is at ${DISK_USAGE}%"
else
    echo "Disk usage is fine: ${DISK_USAGE}%"
fi

# Common test operators:
# -f FILE    = file exists and is a regular file
# -d DIR     = directory exists
# -e PATH    = path exists (file or directory)
# -r FILE    = file is readable
# -w FILE    = file is writable
# -x FILE    = file is executable
# -s FILE    = file exists and is not empty
# -z STRING  = string is empty
# -n STRING  = string is not empty
# STR1 = STR2  = strings are equal
# NUM1 -eq NUM2 = numbers are equal
# NUM1 -gt NUM2 = greater than
# NUM1 -lt NUM2 = less than
# NUM1 -ge NUM2 = greater than or equal
# NUM1 -le NUM2 = less than or equal
```

**Loops:**

```bash
#!/bin/bash

# For loop — iterate over a list
for SERVER in web1 web2 web3 db1; do
    echo "Checking $SERVER..."
    ping -c 1 -W 2 "$SERVER" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "  $SERVER is up"
    else
        echo "  $SERVER is DOWN!"
    fi
done

# For loop — iterate over files
for FILE in /var/log/*.log; do
    echo "Processing: $FILE"
    wc -l "$FILE"
done

# For loop — C-style
for ((i=1; i<=5; i++)); do
    echo "Iteration: $i"
done

# For loop — range
for i in {1..10}; do
    echo "Number: $i"
done

# While loop
COUNT=0
while [ $COUNT -lt 5 ]; do
    echo "Count: $COUNT"
    COUNT=$((COUNT + 1))
done

# While loop — read file line by line
while IFS= read -r LINE; do
    echo "Line: $LINE"
done < /etc/hostname

# Until loop (runs until condition is true)
until ping -c 1 -W 2 google.com > /dev/null 2>&1; do
    echo "Waiting for network..."
    sleep 5
done
echo "Network is up!"
```

**Functions:**

```bash
#!/bin/bash

# Define a function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function with return value
check_service() {
    local SERVICE_NAME=$1
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        return 0    # success
    else
        return 1    # failure
    fi
}

# Using the functions
log "Starting deployment..."

if check_service nginx; then
    log "Nginx is running"
else
    log "Nginx is NOT running — starting it..."
    sudo systemctl start nginx
fi

log "Deployment complete."
```

**Exit codes:**

```bash
#!/bin/bash

# $? contains the exit code of the last command
# 0 = success, anything else = failure

ls /var/www/myapp
if [ $? -eq 0 ]; then
    echo "Directory exists"
else
    echo "Directory not found"
    exit 1    # Exit the script with an error code
fi

# exit 0 = script finished successfully
# exit 1 = general error
# exit 2 = misuse of command
```

**Practical script: Automated backup:**

```bash
#!/bin/bash
# backup.sh — Automated backup script for a web application

# Configuration
APP_DIR="/var/www/myapp"
BACKUP_DIR="/var/backups/myapp"
DB_NAME="myapp_db"
DB_USER="root"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_NAME="backup_${DATE}"
RETENTION_DAYS=7

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Start backup
log "Starting backup: $BACKUP_NAME"

# Backup files
log "Backing up application files..."
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}_files.tar.gz" -C "$APP_DIR" . \
    --exclude='node_modules' \
    --exclude='vendor' \
    --exclude='.git'

if [ $? -eq 0 ]; then
    log "File backup complete."
else
    log "ERROR: File backup failed!"
    exit 1
fi

# Backup database
log "Backing up database..."
mysqldump -u "$DB_USER" "$DB_NAME" | gzip > "${BACKUP_DIR}/${BACKUP_NAME}_db.sql.gz"

if [ $? -eq 0 ]; then
    log "Database backup complete."
else
    log "ERROR: Database backup failed!"
    exit 1
fi

# Remove old backups
log "Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete

# Summary
BACKUP_SIZE=$(du -sh "$BACKUP_DIR/${BACKUP_NAME}"* | awk '{sum+=$1} END {print sum}')
log "Backup complete. Files saved to: $BACKUP_DIR"
ls -lh "${BACKUP_DIR}/${BACKUP_NAME}"*

exit 0
```

**Practical script: Simple deployment:**

```bash
#!/bin/bash
# deploy.sh — Simple deployment script

set -e    # Exit immediately if any command fails

APP_DIR="/var/www/myapp"
BRANCH="${1:-main}"    # Use first argument, default to "main"

log() {
    echo "[DEPLOY $(date '+%H:%M:%S')] $1"
}

log "Starting deployment of branch: $BRANCH"

# Navigate to project
cd "$APP_DIR"

# Put app in maintenance mode
log "Enabling maintenance mode..."
php artisan down --retry=60

# Pull latest code
log "Pulling latest code..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Install dependencies
log "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

log "Installing NPM dependencies..."
npm ci --production

# Build assets
log "Building assets..."
npm run build

# Run migrations
log "Running migrations..."
php artisan migrate --force

# Clear and rebuild caches
log "Clearing caches..."
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
log "Restarting services..."
sudo systemctl restart php8.3-fpm
sudo systemctl reload nginx

# Bring app back online
log "Disabling maintenance mode..."
php artisan up

log "Deployment complete!"
```

```bash
# Make the scripts executable and run them
chmod +x backup.sh deploy.sh
./deploy.sh main
./backup.sh
```

**In short:** Shell scripts start with `#!/bin/bash`, use variables (no spaces around `=`), conditionals (`if [ condition ]; then`), loops (`for`/`while`), and functions. Use `$()` for command substitution, `$?` for exit codes, and `set -e` to stop on errors. Automate backups, deployments, and repetitive tasks with scripts.

---

## 16. Disk and Memory Management

Monitoring disk space and memory usage is critical for keeping your servers running smoothly. Running out of either will crash your applications.

**df — Disk free (check disk space):**

```bash
# Show disk usage in human-readable format
df -h
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1        50G   32G   16G  67% /
# tmpfs            2.0G     0  2.0G   0% /dev/shm

# Show only specific filesystem types
df -hT                         # Include filesystem type
df -h /                        # Check root partition only
df -h /var/www/                # Check partition where your app lives

# Show inode usage (each file uses one inode)
df -i
```

**du — Disk usage (check directory sizes):**

```bash
# Check size of a directory
du -sh /var/www/myapp/
# Output: 245M    /var/www/myapp/

# Check size of all subdirectories
du -sh /var/www/myapp/*/
# 12M     /var/www/myapp/app/
# 105M    /var/www/myapp/node_modules/
# 78M     /var/www/myapp/vendor/
# 2.4M    /var/www/myapp/public/

# Find the largest directories
du -sh /var/* | sort -rh | head -10

# Check total size of log files
du -sh /var/log/

# du with human-readable format and total
du -shc /var/www/myapp/{node_modules,vendor}
# 105M    /var/www/myapp/node_modules
# 78M     /var/www/myapp/vendor
# 183M    total
```

**ncdu — Interactive disk usage analyzer:**

```bash
# Install ncdu (highly recommended)
sudo apt install ncdu

# Analyze a directory interactively
ncdu /var/www/myapp/
# Navigate with arrow keys
# Press 'd' to delete a file/directory
# Press 'n' to sort by name
# Press 's' to sort by size
# Press 'q' to quit

# Analyze the entire disk
sudo ncdu /
```

**free — Check memory (RAM) usage:**

```bash
# Show memory usage in human-readable format
free -h
#                total        used        free      shared  buff/cache   available
# Mem:           7.8Gi       3.2Gi       1.1Gi       256Mi       3.5Gi       4.1Gi
# Swap:          2.0Gi       128Mi       1.9Gi

# Column meanings:
# total      = total physical RAM
# used       = RAM being used by processes
# free       = completely unused RAM
# shared     = shared memory (tmpfs)
# buff/cache = RAM used for disk caching (can be freed if needed)
# available  = RAM available for new processes (free + reclaimable cache)

# Show memory in MB
free -m

# Continuous monitoring (every 2 seconds)
watch free -h
```

**lsblk — List block devices (disks and partitions):**

```bash
# Show all disks and partitions
lsblk
# NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
# sda      8:0    0   50G  0 disk
# ├─sda1   8:1    0   49G  0 part /
# └─sda2   8:2    0    1G  0 part [SWAP]

# Show with filesystem information
lsblk -f

# Show disk size and usage
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT,FSAVAIL
```

**Swap space:**

Swap is disk space used as overflow when RAM is full. It is much slower than RAM but prevents out-of-memory crashes.

```bash
# Check current swap
swapon --show
free -h | grep Swap

# Create a swap file (if you need more swap)
sudo fallocate -l 4G /swapfile       # Create a 4GB file
sudo chmod 600 /swapfile              # Restrict permissions
sudo mkswap /swapfile                 # Set up swap space
sudo swapon /swapfile                 # Enable swap

# Make swap permanent (survives reboot)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Adjust swappiness (how aggressively Linux uses swap)
cat /proc/sys/vm/swappiness           # Check current value (0-100)
sudo sysctl vm.swappiness=10          # Set to 10 (prefer RAM)
# Make permanent:
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

**Practical disk management:**

```bash
# Find the 10 largest files on the system
sudo find / -type f -exec du -sh {} + 2>/dev/null | sort -rh | head -10

# Find large log files
find /var/log -type f -size +100M -exec ls -lh {} \;

# Clear old logs
sudo journalctl --vacuum-time=7d     # Keep only 7 days of journal logs
sudo journalctl --vacuum-size=500M   # Keep only 500MB of journal logs

# Clean apt cache
sudo apt clean                        # Remove downloaded package files
sudo apt autoremove                   # Remove unused packages

# Check what is using the most disk space
sudo du -sh /var/* | sort -rh
sudo du -sh /home/* | sort -rh

# Monitor in real time
watch -n 5 df -h
```

**In short:** Use `df -h` to check how much disk space is available, `du -sh` to check directory sizes, `free -h` to check RAM usage, and `lsblk` to see disk partitions. Install `ncdu` for an interactive disk analyzer. Set up swap space as safety net for low-memory situations, and regularly clean logs and caches to free space.

---

## 17. Cron Jobs

Cron is the Linux task scheduler. It runs commands automatically at specified intervals — perfect for backups, cleanup tasks, report generation, and application maintenance.

**Cron syntax:**

```bash
# ┌───────────── minute (0-59)
# │ ┌───────────── hour (0-23)
# │ │ ┌───────────── day of month (1-31)
# │ │ │ ┌───────────── month (1-12)
# │ │ │ │ ┌───────────── day of week (0-7, 0 and 7 = Sunday)
# │ │ │ │ │
# * * * * * command_to_run
```

**Special characters:**

| Character | Meaning | Example |
|-----------|---------|---------|
| `*` | Every value | `* * * * *` = every minute |
| `,` | Multiple values | `1,15,30 * * * *` = at minute 1, 15, and 30 |
| `-` | Range | `1-5 * * * *` = minutes 1 through 5 |
| `/` | Step/interval | `*/15 * * * *` = every 15 minutes |

**Managing cron jobs:**

```bash
# Edit your crontab (opens in your default editor)
crontab -e

# List your cron jobs
crontab -l

# Edit another user's crontab
sudo crontab -u www-data -e

# List another user's cron jobs
sudo crontab -u www-data -l

# Remove all your cron jobs (be careful!)
crontab -r

# System-wide crontab
sudo nano /etc/crontab
```

**Common cron schedule examples:**

| Schedule | Cron Expression | Description |
|----------|----------------|-------------|
| Every minute | `* * * * *` | Runs every single minute |
| Every 5 minutes | `*/5 * * * *` | Runs at :00, :05, :10, ... |
| Every 15 minutes | `*/15 * * * *` | Runs at :00, :15, :30, :45 |
| Every hour | `0 * * * *` | Runs at the start of every hour |
| Every 6 hours | `0 */6 * * *` | Runs at 00:00, 06:00, 12:00, 18:00 |
| Every day at midnight | `0 0 * * *` | Runs at 00:00 daily |
| Every day at 3 AM | `0 3 * * *` | Runs at 03:00 daily |
| Every Monday at 9 AM | `0 9 * * 1` | Runs at 09:00 every Monday |
| Every weekday at 8 AM | `0 8 * * 1-5` | Mon-Fri at 08:00 |
| First day of month | `0 0 1 * *` | Runs at midnight on the 1st |
| Every Sunday at 2 AM | `0 2 * * 0` | Runs at 02:00 every Sunday |
| Twice a day | `0 8,20 * * *` | Runs at 08:00 and 20:00 |

**Shortcut schedules:**

```bash
# Instead of writing full cron expressions, use shortcuts
@reboot     command    # Run once at startup
@yearly     command    # Run once a year (0 0 1 1 *)
@monthly    command    # Run once a month (0 0 1 * *)
@weekly     command    # Run once a week (0 0 * * 0)
@daily      command    # Run once a day (0 0 * * *)
@hourly     command    # Run once an hour (0 * * * *)
```

**Practical cron job examples:**

```bash
# Open crontab for editing
crontab -e

# Laravel scheduler (ESSENTIAL for Laravel apps)
* * * * * cd /var/www/myapp && php artisan schedule:run >> /dev/null 2>&1

# Backup database every day at 2 AM
0 2 * * * mysqldump -u root myapp_db | gzip > /var/backups/db_$(date +\%Y\%m\%d).sql.gz

# Backup files every Sunday at 3 AM
0 3 * * 0 tar -czf /var/backups/files_$(date +\%Y\%m\%d).tar.gz /var/www/myapp/

# Clear old log files every day at 4 AM
0 4 * * * find /var/log -name "*.log" -mtime +30 -delete

# Clear Laravel cache daily at midnight
0 0 * * * cd /var/www/myapp && php artisan cache:clear >> /dev/null 2>&1

# Renew SSL certificates (Let's Encrypt) twice daily
0 */12 * * * certbot renew --quiet

# Monitor disk space every hour
0 * * * * df -h / | tail -1 | awk '{if ($5+0 > 80) print "DISK WARNING: " $5}' | mail -s "Disk Alert" admin@example.com

# Restart PHP-FPM every night (workaround for memory leaks)
0 5 * * * sudo systemctl restart php8.3-fpm

# Clean temporary files every 6 hours
0 */6 * * * find /tmp -type f -mtime +1 -delete

# Run a Node.js script every 15 minutes
*/15 * * * * cd /var/www/myapp && /usr/bin/node scripts/process-queue.js >> /var/log/queue.log 2>&1

# Git pull and rebuild every hour (staging server)
0 * * * * cd /var/www/staging && git pull origin develop && npm run build >> /var/log/staging-build.log 2>&1
```

**Logging cron output:**

```bash
# Redirect output to a log file
* * * * * /path/to/script.sh >> /var/log/myscript.log 2>&1

# Explanation of redirections:
# >>  = append stdout to file
# 2>&1 = redirect stderr to the same place as stdout

# Discard all output (silent)
* * * * * /path/to/script.sh > /dev/null 2>&1

# Log only errors
* * * * * /path/to/script.sh >> /var/log/myscript.log 2>> /var/log/myscript-errors.log

# Check cron execution logs
grep CRON /var/log/syslog
sudo journalctl -u cron

# Add timestamps to your log
* * * * * echo "$(date): Running backup" >> /var/log/cron-backup.log && /path/to/backup.sh >> /var/log/cron-backup.log 2>&1
```

**Cron job troubleshooting:**

```bash
# Common reasons cron jobs fail:
# 1. PATH is different in cron (use full paths to commands)
#    Bad:  node server.js
#    Good: /usr/bin/node /var/www/myapp/server.js

# 2. Environment variables are not loaded
#    Add them at the top of your crontab:
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
NODE_ENV=production

# 3. Working directory is not set
#    Always cd first: cd /var/www/myapp && command

# 4. Permission issues
#    Make sure the script is executable: chmod +x script.sh
#    Make sure the cron user has access to the files

# 5. Check if cron service is running
sudo systemctl status cron
sudo systemctl start cron     # Start if not running
sudo systemctl enable cron    # Enable on boot
```

**In short:** Cron runs scheduled tasks using a five-field syntax (minute, hour, day, month, weekday). Use `crontab -e` to edit and `crontab -l` to list jobs. Always use full paths in cron jobs, redirect output to log files, and test your commands manually before adding them to cron. For Laravel, `* * * * * cd /path && php artisan schedule:run` is the essential cron entry.

---

## 18. Common Linux Interview Questions

These are frequently asked Linux questions in developer and DevOps interviews. Each includes a concise answer and the relevant command.

**Q1: What is the difference between a hard link and a soft (symbolic) link?**

A **hard link** is a second name for the same data on disk (same inode). Deleting the original file does not affect the hard link because the data still exists. A **soft link (symlink)** is a pointer to the file's path. If the original file is deleted, the symlink becomes broken.

```bash
# Create a hard link
ln original.txt hardlink.txt

# Create a soft link
ln -s original.txt symlink.txt

# Verify: both hard link and original share the same inode
ls -li original.txt hardlink.txt
# 1234567 -rw-r--r-- 2 anwar anwar 100 Mar 1 10:00 hardlink.txt
# 1234567 -rw-r--r-- 2 anwar anwar 100 Mar 1 10:00 original.txt
#  (same inode ^)
```

---

**Q2: How do you find files larger than 100MB?**

```bash
# Find files larger than 100MB from root
sudo find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null

# Find large files in a specific directory
find /var -type f -size +100M

# Sort by size (largest first)
sudo find / -type f -size +100M -exec du -h {} + 2>/dev/null | sort -rh | head -20
```

---

**Q3: How do you check which port a service is using?**

```bash
# Check what is listening on all ports
sudo ss -tlnp

# Find which process is using port 80
sudo ss -tlnp | grep :80

# Alternative: use lsof
sudo lsof -i :80

# Check a specific service
sudo ss -tlnp | grep nginx
```

---

**Q4: What is the difference between `kill` and `kill -9`?**

`kill` (or `kill -15`) sends **SIGTERM**, which asks the process to shut down gracefully — the process can save data, close connections, and clean up. `kill -9` sends **SIGKILL**, which terminates the process immediately without any cleanup. Always try `kill` first; use `kill -9` only if the process does not respond.

```bash
# Graceful shutdown
kill 1234

# Wait a few seconds, then force kill if needed
kill -9 1234
```

---

**Q5: How do you check disk space?**

```bash
# Check overall disk usage
df -h

# Check a specific directory's size
du -sh /var/www/myapp/

# Find what is using the most space
du -sh /var/* | sort -rh | head -10

# Interactive disk analyzer
ncdu /
```

---

**Q6: What is the difference between `/etc/passwd` and `/etc/shadow`?**

`/etc/passwd` contains user account information (username, UID, home directory, shell) and is readable by all users. `/etc/shadow` contains the encrypted (hashed) passwords and is readable only by root. They are separate for security — if `/etc/passwd` had passwords, any user could attempt to crack them.

```bash
# View user info (accessible to all)
cat /etc/passwd | grep anwar
# anwar:x:1000:1000:Anwar Barakat:/home/anwar:/bin/bash

# View password hash (root only)
sudo cat /etc/shadow | grep anwar
# anwar:$6$salt$hash:19782:0:99999:7:::
```

---

**Q7: How do you set up a cron job to run a script every day at 3 AM?**

```bash
# Edit crontab
crontab -e

# Add this line:
0 3 * * * /path/to/script.sh >> /var/log/script.log 2>&1

# Verify it was added
crontab -l
```

---

**Q8: How do you check memory usage on a Linux system?**

```bash
# Quick overview
free -h

# Detailed process memory usage
ps aux --sort=-%mem | head -10

# Real-time monitoring
htop
```

---

**Q9: How do you change file permissions so only the owner can read and write?**

```bash
chmod 600 secret-file.txt
# 6 = rw- (owner: read + write)
# 0 = --- (group: no access)
# 0 = --- (others: no access)

# Verify
ls -la secret-file.txt
# -rw------- 1 anwar anwar 256 Mar 1 10:00 secret-file.txt
```

---

**Q10: How do you find all occurrences of a string in files recursively?**

```bash
# Search recursively for "database" in all files
grep -rn "database" /var/www/myapp/

# Case-insensitive
grep -rni "database" /var/www/myapp/

# Only show filenames
grep -rl "database" /var/www/myapp/
```

---

**Q11: How do you check which Linux distribution and version you are running?**

```bash
# Method 1: works on most distros
cat /etc/os-release

# Method 2: Ubuntu/Debian
lsb_release -a

# Method 3: kernel version
uname -a

# Method 4: quick one-liner
cat /etc/os-release | grep PRETTY_NAME
```

---

**Q12: What does `chmod 777` do and why is it dangerous?**

`chmod 777` gives read, write, and execute permissions to everyone (owner, group, and others). This is dangerous because any user or process on the system can modify or delete the file. In a web server context, it could allow attackers to upload and execute malicious scripts.

```bash
# NEVER do this in production
chmod 777 /var/www/myapp/

# Instead, use proper permissions
chmod 755 /var/www/myapp/           # Directories
chmod 644 /var/www/myapp/index.php  # Files
chown -R www-data:www-data /var/www/myapp/
```

---

**Q13: How do you view real-time log output?**

```bash
# Follow a log file in real time
tail -f /var/log/nginx/error.log

# Follow with highlighting
tail -f /var/log/syslog | grep --color "error"

# Follow multiple files
tail -f /var/log/nginx/error.log /var/log/php8.3-fpm.log

# Using journalctl for systemd services
sudo journalctl -u nginx -f
```

---

**Q14: How do you add a user to the sudo group?**

```bash
# Add existing user to sudo group
sudo usermod -aG sudo username

# Verify
groups username
# Output: username : username sudo

# The user must log out and back in for the change to take effect
```

---

**Q15: How do you transfer files between servers?**

```bash
# Using scp (simple)
scp file.txt user@remote:/path/to/destination/
scp -r directory/ user@remote:/path/

# Using rsync (better for large transfers — only sends changes)
rsync -avz ./project/ user@remote:/var/www/project/
rsync -avz --exclude 'node_modules' --exclude '.git' ./project/ user@remote:/var/www/project/
```

---

For a practical server setup walkthrough using these commands, see [Server Configuration](./01_configuration.md).

---

**Final thoughts:**

Linux is a vast ecosystem, and this guide covers the fundamentals you need as a developer. The best way to learn Linux is by using it — set up a virtual machine or a cheap cloud server and practice these commands daily. Over time, the terminal will become your most productive tool.

**Key takeaways:**

- **File system** — everything starts from `/`, know the key directories
- **Permissions** — 755 for directories, 644 for files, use `chmod` and `chown`
- **Text processing** — `grep`, `find`, `awk`, `sed`, and pipes are your power tools
- **Process management** — `ps`, `top`, `kill`, `systemctl` keep your server running
- **SSH** — key-based auth, config aliases, and `rsync` for file transfer
- **Scripting** — automate everything you do more than twice
- **Cron** — schedule tasks with five-field syntax, always log output
- **Monitoring** — `df -h`, `free -h`, `htop` should be part of your daily routine
