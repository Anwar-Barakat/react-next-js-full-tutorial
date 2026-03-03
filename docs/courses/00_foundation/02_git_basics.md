# Git Basics

Learn version control with Git - the essential skill every developer needs. This lecture covers Git fundamentals, common workflows, and best practices.

---

## Learning Objectives

- Understand what version control is and why it matters
- Learn fundamental Git commands
- Create and manage repositories
- Make commits with meaningful messages
- Work with branches
- Use GitHub for collaboration
- Understand basic Git workflows

---

## Prerequisites

- Git installed (from previous lecture)
- GitHub account created
- Basic terminal/command line knowledge

---

## What is Version Control?

### The Problem

Imagine working on a project without version control:
- `project.zip`
- `project_final.zip`
- `project_final_v2.zip`
- `project_final_ACTUALLY_FINAL.zip`
- `project_final_for_real_this_time.zip`

Sound familiar? This is chaos!

### The Solution: Git

Git is a **version control system** that:
- ✅ Tracks **every change** to your code
- ✅ Lets you **revert** to previous versions
- ✅ Enables **collaboration** without conflicts
- ✅ Creates **branches** for features/experiments
- ✅ Maintains **complete history** of your project
- ✅ Is used by **all professional developers**

---

## Key Concepts

### Repository (Repo)
A folder tracked by Git containing your project and its complete history.

### Commit
A "snapshot" of your code at a specific point in time. Think of it as a save point in a video game.

### Branch
An independent line of development. Like parallel universes for your code.

### Remote
A version of your repository hosted online (e.g., on GitHub).

### Clone
Downloading a repository from remote to your computer.

### Push
Uploading your local commits to remote.

### Pull
Downloading changes from remote to your local repository.

---

## Git vs GitHub

**Git**: The version control software (runs on your computer)

**GitHub**: A website that hosts Git repositories online
- Think: Git = Microsoft Word, GitHub = Google Docs

**Alternatives to GitHub**:
- GitLab
- Bitbucket
- Gitea

We'll use GitHub in this course.

---

## Basic Git Workflow

```
1. Initialize or clone a repository
2. Make changes to files
3. Stage changes (git add)
4. Commit changes (git commit)
5. Push to remote (git push)
```

---

## Part 1: Creating Your First Repository

### Option A: Start from Scratch (Local)

```bash
# Create project folder
mkdir my-first-repo
cd my-first-repo

# Initialize Git
git init

# Check status
git status
```

Output:
```
Initialized empty Git repository in .../my-first-repo/.git/
On branch main
No commits yet
nothing to commit
```

### Option B: Clone from GitHub

```bash
# Clone a repository
git clone https://github.com/username/repo-name.git

# Navigate into it
cd repo-name
```

---

## Part 2: Making Your First Commit

### Step 1: Create a File

```bash
# Create README.md
echo "# My First Repo" > README.md

# Check status
git status
```

Output shows **untracked files** in red.

### Step 2: Stage the File

```bash
# Add file to staging area
git add README.md

# Check status again
git status
```

Now the file appears in green under "Changes to be committed".

### Step 3: Commit the Changes

```bash
# Commit with a message
git commit -m "Add README file"
```

Output:
```
[main (root-commit) a1b2c3d] Add README file
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

### Step 4: View Commit History

```bash
git log
```

Shows:
- Commit hash (unique ID)
- Author
- Date
- Message

---

## Essential Git Commands

### Checking Status

```bash
# See what's changed
git status

# Short format
git status -s
```

### Adding Files

```bash
# Add specific file
git add filename.txt

# Add multiple files
git add file1.txt file2.txt

# Add all changes in current directory
git add .

# Add all changes in entire project
git add -A
```

### Committing

```bash
# Commit with message
git commit -m "Your message here"

# Commit with longer message (opens editor)
git commit

# Add and commit in one step
git commit -am "Message"  # Only for tracked files
```

### Viewing History

```bash
# Show commit log
git log

# Compact view (one line per commit)
git log --oneline

# Show last 5 commits
git log -5

# Show with file changes
git log --stat

# Beautiful graph
git log --oneline --graph --all
```

### Viewing Changes

```bash
# See unstaged changes
git diff

# See staged changes
git diff --staged

# See changes in specific file
git diff filename.txt
```

---

## Writing Good Commit Messages

### Bad Examples ❌

```bash
git commit -m "fix"
git commit -m "updates"
git commit -m "asdf"
git commit -m "final version"
```

### Good Examples ✅

```bash
git commit -m "Add user login form"
git commit -m "Fix email validation bug"
git commit -m "Update database schema for posts table"
git commit -m "Remove deprecated payment method"
```

### Best Practices

1. **Use imperative mood**: "Add feature" not "Added feature"
2. **Be specific**: "Fix login bug" not "Bug fix"
3. **Keep it concise**: One line summary (50 chars max)
4. **Add details if needed**: Use body for explanation
5. **Reference issues**: "Fix #42: Login validation error"

### Conventional Commits Format

```bash
type(scope): subject

feat: Add dark mode toggle
fix: Resolve mobile menu overflow
docs: Update installation guide
style: Format code with Prettier
refactor: Simplify authentication logic
test: Add unit tests for user model
chore: Update dependencies
```

---

## Working with Remotes (GitHub)

### Creating a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "New repository" (green button)
3. Name your repo: `my-first-repo`
4. Choose Public or Private
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### Connecting Local to Remote

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/my-first-repo.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

Explanation:
- `origin`: Nickname for the remote URL
- `main`: Branch name
- `-u`: Sets upstream (future pushes just need `git push`)

### Pushing Changes

```bash
# Make a change
echo "This is my first project!" >> README.md

# Add and commit
git add README.md
git commit -m "Update README with description"

# Push to GitHub
git push
```

Refresh GitHub - you'll see your changes!

### Pulling Changes

```bash
# Get latest changes from remote
git pull
```

Use this when:
- Working on multiple computers
- Collaborating with others
- Someone else pushed changes

---

## Branching Basics

### Why Branches?

- Work on features without breaking main code
- Experiment safely
- Collaborate without conflicts
- Professional workflow standard

### Creating and Switching Branches

```bash
# Create new branch
git branch feature-login

# Switch to branch
git checkout feature-login

# Create and switch in one command
git checkout -b feature-login

# List all branches
git branch
```

### Working on a Branch

```bash
# You're on feature-login branch
echo "Login form" > login.html
git add login.html
git commit -m "Add login form"

# Your main branch is unaffected
git checkout main
ls  # No login.html here!

git checkout feature-login
ls  # login.html is here!
```

### Merging Branches

```bash
# Switch to main
git checkout main

# Merge feature branch into main
git merge feature-login

# Delete feature branch (optional)
git branch -d feature-login
```

### Viewing Branches

```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches
git branch -a
```

---

## Common Git Workflows

### Solo Development Workflow

```bash
# 1. Make changes
# (edit files in VS Code)

# 2. Check what changed
git status
git diff

# 3. Stage changes
git add .

# 4. Commit
git commit -m "Descriptive message"

# 5. Push to GitHub
git push
```

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feature-name

# 2. Work on feature
# (make changes, commit multiple times)

# 3. Push feature branch
git push -u origin feature-name

# 4. Create Pull Request on GitHub
# (get code reviewed)

# 5. Merge via GitHub
# (or locally)

# 6. Delete feature branch
git branch -d feature-name
git push origin --delete feature-name
```

---

## Undoing Changes

### Unstage Files (Before Commit)

```bash
# Unstage specific file
git reset HEAD filename.txt

# Unstage all
git reset HEAD .
```

### Discard Uncommitted Changes

```bash
# Discard changes in specific file
git checkout -- filename.txt

# Discard all changes (CAREFUL!)
git checkout -- .
```

### Amend Last Commit

```bash
# Forgot to include a file in last commit
git add forgotten-file.txt
git commit --amend --no-edit

# Change last commit message
git commit --amend -m "New message"
```

**Warning**: Only amend commits that haven't been pushed!

### Revert a Commit

```bash
# Create new commit that undoes a specific commit
git revert <commit-hash>

# Example
git revert a1b2c3d
```

---

## .gitignore File

### What is .gitignore?

A file that tells Git which files/folders to ignore.

### Common Things to Ignore

```bash
# Create .gitignore
touch .gitignore
```

In `.gitignore`:
```
# Dependencies
node_modules/
vendor/

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
*.log

# Sensitive data
config/database.php
secrets.txt
```

### Using .gitignore

```bash
# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# Add and commit
git add .gitignore
git commit -m "Add .gitignore"

# Now node_modules/ and .env are ignored
```

---

## Hands-On Exercise

### Task: Create a Personal Portfolio Repo

1. **Create local repository**
   ```bash
   mkdir my-portfolio
   cd my-portfolio
   git init
   ```

2. **Create files**
   ```bash
   touch index.html
   touch styles.css
   touch README.md
   ```

3. **Add content to README.md**
   ```markdown
   # My Portfolio

   This is my personal portfolio website.

   ## Technologies
   - HTML
   - CSS
   - JavaScript (coming soon)
   ```

4. **Create .gitignore**
   ```bash
   echo ".DS_Store" > .gitignore
   ```

5. **Make first commit**
   ```bash
   git add .
   git commit -m "Initial commit: Add project structure"
   ```

6. **Create GitHub repo and push**
   ```bash
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git
   git push -u origin main
   ```

7. **Create a feature branch**
   ```bash
   git checkout -b feature-about-page
   touch about.html
   git add about.html
   git commit -m "Add about page"
   git push -u origin feature-about-page
   ```

8. **Merge back to main**
   ```bash
   git checkout main
   git merge feature-about-page
   git push
   ```

---

## Assignment

**Objective**: Practice Git basics by creating and managing a repository

**Tasks**:
1. Create a new repository called `git-practice`
2. Add at least 3 files (README.md, index.html, style.css)
3. Make at least 5 commits with meaningful messages
4. Create a `.gitignore` file
5. Create a GitHub repository
6. Push your local repository to GitHub
7. Create a feature branch called `feature-contact-page`
8. Add a file called `contact.html` on this branch
9. Merge the feature branch back to main
10. Push all changes to GitHub

**Submission**: Share your GitHub repository URL

**Evaluation Criteria**:
- Repository created correctly (10%)
- Meaningful commit messages (20%)
- .gitignore file present (10%)
- Successfully pushed to GitHub (20%)
- Feature branch created and merged (30%)
- Clean commit history (10%)

---

## Common Mistakes & Troubleshooting

**Mistake 1**: Committing without staging
```bash
# Wrong
git commit -m "Message"  # Nothing happens if files not staged

# Right
git add .
git commit -m "Message"
```

**Mistake 2**: Unclear commit messages
```bash
# Bad
git commit -m "update"

# Good
git commit -m "Add email validation to signup form"
```

**Mistake 3**: Forgetting to pull before push
```bash
# If remote has changes you don't have locally
git pull  # Get remote changes first
git push  # Then push your changes
```

**Mistake 4**: Committing sensitive data
```bash
# If you accidentally committed .env file
git rm --cached .env  # Remove from Git but keep locally
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"
```

**Mistake 5**: Working on wrong branch
```bash
# Check current branch
git branch

# Switch to correct branch
git checkout correct-branch
```

---

## Git Cheat Sheet

```bash
# Setup
git config --global user.name "Name"
git config --global user.email "email@example.com"

# Create
git init                          # Initialize repo
git clone <url>                   # Clone remote repo

# Status
git status                        # Check status
git diff                          # See changes

# Stage & Commit
git add <file>                    # Stage file
git add .                         # Stage all
git commit -m "message"           # Commit

# Branching
git branch                        # List branches
git branch <name>                 # Create branch
git checkout <branch>             # Switch branch
git checkout -b <branch>          # Create and switch
git merge <branch>                # Merge branch
git branch -d <branch>            # Delete branch

# Remote
git remote add origin <url>       # Add remote
git push -u origin main           # Push to remote
git pull                          # Pull from remote
git fetch                         # Fetch (don't merge)

# History
git log                           # Show commits
git log --oneline                 # Compact log

# Undo
git reset HEAD <file>             # Unstage
git checkout -- <file>            # Discard changes
git commit --amend                # Modify last commit
git revert <commit>               # Revert commit
```

---

## Summary

- Git is **version control** - essential for all developers
- **Repository** = project folder tracked by Git
- **Commit** = snapshot of your code
- **Branch** = independent line of development
- **Remote** = online copy (GitHub)
- **Stage → Commit → Push** is the basic workflow
- **.gitignore** prevents tracking unwanted files
- **Good commit messages** are crucial for collaboration

---

## Next Steps

1. ✅ Practice all commands in this lecture
2. ✅ Complete the assignment
3. → Proceed to [Web Fundamentals](./03_web_fundamentals.md)
4. → Explore GitHub features (Issues, Projects, Wikis)
5. → Start thinking in terms of commits (every meaningful change)

---

## Additional Resources

- [Pro Git Book (Free)](https://git-scm.com/book/en/v2) - Comprehensive Git guide
- [GitHub Skills](https://skills.github.com/) - Interactive tutorials
- [Git Cheat Sheet (PDF)](https://education.github.com/git-cheat-sheet-education.pdf)
- [Visualizing Git](https://git-school.github.io/visualizing-git/) - Interactive visualizer
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Fix common Git mistakes
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message standard

---

**You're now a Git user! Version control is your superpower. 🚀**
