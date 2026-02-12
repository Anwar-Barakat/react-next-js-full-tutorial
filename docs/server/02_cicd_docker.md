# CI/CD, GitHub Actions, Microservices & Docker - Complete Guide

## Table of Contents

### GitHub Actions
1. [What are Workflows?](#1-what-are-workflows)
2. [What are Events?](#2-what-are-events)
3. [What are Jobs?](#3-what-are-jobs)
4. [What are Actions?](#4-what-are-actions)
5. [What is YAML?](#5-what-is-yaml)
6. [Basic YAML Data Types](#6-basic-yaml-data-types)
7. [Action Triggers](#7-action-triggers)
8. [Schedule Triggers](#8-schedule-triggers)
9. [Cron Jobs](#9-cron-jobs)
10. [Manual Triggers with Parameters](#10-manual-triggers-with-parameters)
11. [Runners](#11-runners)
12. [Steps](#12-steps)
13. [Conditions (if)](#13-conditions-if)
14. [Complete Workflow Example](#14-complete-workflow-example)

### CI/CD Concepts
15. [What is CI/CD?](#15-what-is-cicd)
16. [Continuous Integration (CI)](#16-continuous-integration-ci)
17. [Continuous Delivery (CD - Delivery)](#17-continuous-delivery-cd---delivery)
18. [Continuous Deployment (CD - Deployment)](#18-continuous-deployment-cd---deployment)
19. [CI/CD Pipeline](#19-cicd-pipeline)
20. [Pipeline Stages](#20-pipeline-stages)

### Microservices
21. [What are Microservices?](#21-what-are-microservices)
22. [Why Use Microservices?](#22-why-use-microservices)
23. [Microservices Example](#23-microservices-example)
24. [Problems with Microservices](#24-problems-with-microservices)

### Docker
25. [What is Docker?](#25-what-is-docker)
26. [Docker vs Virtual Machine](#26-docker-vs-virtual-machine)
27. [Docker Image vs Container](#27-docker-image-vs-container)
28. [Summary](#28-summary)

---

## GitHub Actions

### 1. What are Workflows?

A **workflow** is the complete automation plan that tells GitHub what to do automatically when specific events occur.

**Key Characteristics:**
- Written in YAML format
- Lives in `.github/workflows/` directory
- Runs when triggered by events
- Contains one or more jobs
- Acts as a checklist that GitHub follows step by step

**Think of it as:** The entire automation blueprint for your project.

```yaml
# Example workflow file location
.github/workflows/main.yml
```

---

### 2. What are Events?

An **event** is the trigger that starts a workflow. It's something that happens in your repository.

**Common Events:**
- Code is pushed to a branch
- Pull request is opened or updated
- Issue is created
- Release is published
- Schedule (time-based)

**Think of it as:** A button that starts the automation.

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

---

### 3. What are Jobs?

A **job** is a group of steps that run together on the same machine (runner).

**Key Characteristics:**
- Contains multiple steps
- All steps run on the same runner
- Jobs can run sequentially or in parallel
- Each job runs in a fresh virtual environment

**Think of it as:** One big task inside the workflow.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
```

**Job Execution Patterns:**

```yaml
# ✅ Sequential jobs
jobs:
  build:
    runs-on: ubuntu-latest
  test:
    needs: build  # Waits for build to complete
    runs-on: ubuntu-latest
  deploy:
    needs: test   # Waits for test to complete
    runs-on: ubuntu-latest
```

```yaml
# ✅ Parallel jobs
jobs:
  build:
    runs-on: ubuntu-latest
  test:
    runs-on: ubuntu-latest
  lint:
    runs-on: ubuntu-latest
  # All three run simultaneously
```

---

### 4. What are Actions?

**Actions** are reusable, prebuilt tools that perform specific tasks. They save you from writing the same code repeatedly.

**Benefits:**
- Ready-made solutions
- Community-maintained
- Saves time
- Reduces errors

**Think of it as:** Apps or plugins you reuse instead of building everything yourself.

```yaml
steps:
  # ✅ Using an action to checkout code
  - uses: actions/checkout@v3

  # ✅ Using an action to setup Node.js
  - uses: actions/setup-node@v3
    with:
      node-version: '20'

  # ✅ Using an action to cache dependencies
  - uses: actions/cache@v3
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**Popular Actions:**
- `actions/checkout` - Clone repository
- `actions/setup-node` - Install Node.js
- `actions/setup-python` - Install Python
- `actions/cache` - Cache dependencies
- `actions/upload-artifact` - Upload build artifacts

---

### 5. What is YAML?

**YAML** (YAML Ain't Markup Language) is a human-friendly configuration language used by GitHub Actions to define workflows.

**Key Features:**
- Easy to read and write
- Uses indentation (spaces, not tabs)
- Stores structured data
- Case-sensitive

**Think of it as:** A simple way to write configuration files that humans can easily understand.

```yaml
# Simple YAML example
name: My Workflow
on: push
jobs:
  build:
    runs-on: ubuntu-latest
```

**YAML Rules:**
- Use spaces for indentation (typically 2 spaces)
- Don't use tabs
- Keys and values separated by colon and space (`key: value`)
- Lists start with dash (`- item`)

---

### 6. Basic YAML Data Types

Understanding YAML data types is essential for writing workflows.

```yaml
# String - text
name: Build Application

# Integer / Number - numeric values
timeout-minutes: 30
max-parallel: 5

# Boolean - true or false
continue-on-error: true
fail-fast: false

# List (Array) - multiple values
on:
  - push
  - pull_request
  - schedule

# Map (Dictionary) - key-value pairs
env:
  NODE_ENV: production
  API_KEY: ${{ secrets.API_KEY }}

# Multiline string
description: |
  This is a multiline
  description that spans
  multiple lines
```

**Complete Example:**

```yaml
name: Hello Workflow
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello GitHub Actions!"
```

---

### 7. Action Triggers

Triggers determine when your workflow runs.

**Common Triggers:**

```yaml
# ✅ Push - runs when code is pushed
on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'src/**'

# ✅ Pull Request - runs on PR events
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

# ✅ Manual Trigger - run from GitHub UI
on:
  workflow_dispatch:

# ✅ Multiple triggers
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

**Trigger Comparison Table:**

| Trigger | When it runs | Use case |
|---------|--------------|----------|
| `push` | Code pushed to branch | Build and test on every commit |
| `pull_request` | PR opened/updated | Test before merging |
| `workflow_dispatch` | Manual button click | On-demand deployments |
| `schedule` | At specific times | Nightly builds, cleanup jobs |
| `release` | Release published | Deploy to production |

---

### 8. Schedule Triggers

**Schedule triggers** run workflows automatically at specific times using cron expressions.

```yaml
on:
  schedule:
    # Runs every day at midnight UTC
    - cron: '0 0 * * *'

    # Runs every Monday at 9 AM UTC
    - cron: '0 9 * * 1'

    # Runs every 6 hours
    - cron: '0 */6 * * *'
```

**Use Cases:**
- Nightly builds
- Database backups
- Cleanup old artifacts
- Generate reports
- Health checks

---

### 9. Cron Jobs

A **cron expression** is a time pattern with five parts that defines when a task should run.

**Cron Format:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-6, Sunday = 0)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Common Cron Examples:**

```yaml
# Every day at midnight
cron: '0 0 * * *'

# Every Sunday at 3 AM
cron: '0 3 * * 0'

# Every weekday at 9 AM
cron: '0 9 * * 1-5'

# Every 15 minutes
cron: '*/15 * * * *'

# First day of month at noon
cron: '0 12 1 * *'
```

**Cron Examples Table:**

| Expression | Description |
|------------|-------------|
| `0 0 * * *` | Every day at midnight |
| `0 */6 * * *` | Every 6 hours |
| `0 9 * * 1` | Every Monday at 9 AM |
| `*/30 * * * *` | Every 30 minutes |
| `0 0 1 * *` | First day of every month |

**Tools:**
- [Crontab Guru](https://crontab.guru/) - Test cron expressions

---

### 10. Manual Triggers with Parameters

Use `workflow_dispatch` to add a manual trigger button with input parameters.

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy (dev/staging/prod)'
        required: true
        type: choice
        options:
          - dev
          - staging
          - prod
        default: dev

      version:
        description: 'Version to deploy'
        required: true
        default: 'latest'

      dry_run:
        description: 'Run in dry-run mode'
        required: false
        type: boolean
        default: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ inputs.environment }}
        run: |
          echo "Deploying version ${{ inputs.version }}"
          echo "Environment: ${{ inputs.environment }}"
          echo "Dry run: ${{ inputs.dry_run }}"
```

**Input Types:**
- `choice` - Dropdown selection
- `boolean` - Checkbox
- `string` - Text input
- `environment` - Environment selector

---

### 11. Runners

A **runner** is the machine (virtual or physical) that executes your workflow jobs.

**GitHub-hosted Runners:**
- Ubuntu Linux (ubuntu-latest, ubuntu-22.04, ubuntu-20.04)
- Windows (windows-latest, windows-2022, windows-2019)
- macOS (macos-latest, macos-13, macos-12)

```yaml
jobs:
  build-linux:
    runs-on: ubuntu-latest

  build-windows:
    runs-on: windows-latest

  build-macos:
    runs-on: macos-latest
```

**Self-hosted Runners:**
- Run on your own machines
- More control over environment
- Can access private networks
- Potentially faster (no provisioning time)

```yaml
jobs:
  build:
    runs-on: self-hosted
```

**Runner Comparison Table:**

| Feature | GitHub-hosted | Self-hosted |
|---------|--------------|-------------|
| Setup | Automatic | Manual setup required |
| Maintenance | GitHub manages | You manage |
| Cost | Free tier limits | Your infrastructure cost |
| Network access | Public internet only | Can access private networks |
| Customization | Limited | Full control |

---

### 12. Steps

**Steps** are the individual tasks inside a job. Each step can run a command or use an action.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # ✅ Step using an action
      - name: Checkout code
        uses: actions/checkout@v3

      # ✅ Step running a shell command
      - name: Install dependencies
        run: npm install

      # ✅ Step with multiple commands
      - name: Build and test
        run: |
          npm run build
          npm test

      # ✅ Step with environment variables
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: ./deploy.sh
```

**Step Properties:**
- `name` - Description of the step
- `uses` - Action to use
- `run` - Shell command to run
- `env` - Environment variables
- `with` - Input parameters for actions
- `if` - Conditional execution

---

### 13. Conditions (if)

Make steps or jobs run only when specific conditions are met.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    # ✅ Only run deploy job on main branch
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: ./deploy.sh

  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      # ✅ Only run on pull requests
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: npm test

      # ✅ Only run on success
      - name: Deploy
        if: success()
        run: ./deploy.sh

      # ✅ Only run on failure
      - name: Notify on failure
        if: failure()
        run: ./notify-failure.sh

      # ✅ Always run (even if previous steps failed)
      - name: Cleanup
        if: always()
        run: ./cleanup.sh
```

**Common Conditions:**

```yaml
# Branch conditions
if: github.ref == 'refs/heads/main'
if: startsWith(github.ref, 'refs/tags/')

# Event conditions
if: github.event_name == 'push'
if: github.event_name == 'pull_request'

# Status functions
if: success()  # Previous steps succeeded
if: failure()  # Previous steps failed
if: always()   # Always run
if: cancelled() # Workflow cancelled

# Input conditions
if: github.event.inputs.environment == 'prod'

# Combined conditions
if: success() && github.ref == 'refs/heads/main'
if: failure() || cancelled()
```

---

### 14. Complete Workflow Example

Here's a comprehensive example demonstrating all concepts:

```yaml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        type: choice
        options:
          - dev
          - staging
          - prod
  schedule:
    - cron: '0 2 * * *'  # Runs every day at 2 AM UTC

env:
  NODE_VERSION: '20'

jobs:
  # Build and test job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  # Deploy job (only on main branch)
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build

      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          echo "Deploying to production..."
          ./deploy.sh

      - name: Notify success
        if: success()
        run: echo "Deployment successful!"

      - name: Notify failure
        if: failure()
        run: echo "Deployment failed!"
```

**Workflow Breakdown:**

**Triggers:**
- Runs on push to `main` or `develop`
- Runs on pull requests to `main`
- Can be triggered manually with environment selection
- Runs automatically every day at 2 AM

**Jobs:**
1. **Build Job:**
   - Checks out code
   - Sets up Node.js with caching
   - Installs dependencies
   - Runs linter and tests
   - Builds application
   - Uploads build artifacts

2. **Deploy Job:**
   - Waits for build job to complete (`needs: build`)
   - Only runs on `main` branch pushes
   - Downloads build artifacts
   - Deploys to production
   - Sends notifications based on success/failure

---

## CI/CD Concepts

### 15. What is CI/CD?

**CI/CD** is a way to automatically check, test, and release code. It helps ensure code works correctly, is safe, and can be published reliably.

**Benefits:**
- Faster delivery
- Early bug detection
- Automated testing
- Consistent deployments
- Reduced manual errors

**Think of it as:** An assembly line for your code that automatically checks quality and delivers it to users.

---

### 16. Continuous Integration (CI)

**Continuous Integration** means automatically checking code every time you push it.

**How CI Works:**
1. Developer writes code
2. Developer pushes code to repository (GitHub/GitLab)
3. Automated system runs checks

**What Does CI Check?**
- Does the code compile/build?
- Do all tests pass?
- Are there linting errors?
- Are there security vulnerabilities?
- Does it meet code quality standards?

**Why CI is Important:**
- Bugs are found early
- Problems are fixed immediately
- Code quality remains high
- Integration issues are caught quickly
- Saves time and reduces stress

**Example Flow:**

```
Developer → Push Code → CI System
                           ↓
                    Run Checks
                           ↓
                   ✅ Pass → Merge
                   ❌ Fail → Fix Now
```

**CI in one line:**
"Every time you push code, automated tests check if anything is broken."

---

### 17. Continuous Delivery (CD - Delivery)

**Continuous Delivery** means code is always ready to be deployed, but you decide when to publish it.

**How CD (Delivery) Works:**
1. Code passes all CI tests
2. Code is packaged and ready for deployment
3. Deployment requires manual approval
4. You decide when to publish

**CD (Delivery) in one line:**
"The app is ready to deploy. You press the button when you're ready."

```
CI Passed → Code Ready → Manual Approval → Deploy
```

---

### 18. Continuous Deployment (CD - Deployment)

**Continuous Deployment** means code is automatically deployed to production after passing all tests.

**How CD (Deployment) Works:**
1. Code passes all CI tests
2. Code is automatically deployed to production
3. No manual approval needed
4. Users get updates immediately

**CD (Deployment) in one line:**
"If everything passes, deploy it automatically to production."

```
CI Passed → Code Ready → Auto Deploy → Live
```

**Comparison Table:**

| Feature | Continuous Integration | Continuous Delivery | Continuous Deployment |
|---------|----------------------|--------------------|--------------------|
| Automation | Testing | Testing + Packaging | Testing + Packaging + Deployment |
| Manual step | None | Deployment approval | None |
| Deployment | No | Manual | Automatic |
| Risk | Low | Medium | Higher |
| Speed | Fast feedback | Ready when needed | Fastest to production |

**Summary:**
- **CI** → Is the code okay or broken?
- **CD (Delivery)** → Code is ready, deploy when you want
- **CD (Deployment)** → Code is deployed automatically to production

---

### 19. CI/CD Pipeline

A **CI/CD pipeline** is a set of automated steps that run when you push code.

**Think of it as:** The automatic path your code follows from development to production.

```
Code → Build → Test → Deploy → Monitor
```

---

### 20. Pipeline Stages

**Common pipeline stages:**

#### 1. Build Stage
**Purpose:** Prepare code to run

```yaml
- name: Build
  run: |
    npm install
    npm run build
```

**Activities:**
- Install dependencies
- Compile code
- Bundle assets
- Optimize for production

#### 2. Test Stage
**Purpose:** Verify code works correctly

```yaml
- name: Test
  run: |
    npm run test:unit
    npm run test:integration
    npm run test:e2e
```

**Activities:**
- Unit tests
- Integration tests
- End-to-end tests
- Code coverage
- Security scans

#### 3. Deploy Stage
**Purpose:** Send code to servers

```yaml
- name: Deploy
  run: |
    ./deploy-to-production.sh
```

**Activities:**
- Deploy to server
- Upload to cloud
- Update database
- Invalidate cache

#### 4. Notify Stage
**Purpose:** Inform team of results

```yaml
- name: Notify
  run: |
    ./send-notification.sh
```

**Activities:**
- Send success/failure notifications
- Update status badges
- Post to Slack/Discord
- Email team

**Complete Pipeline Visualization:**

```
┌─────────┐    ┌──────┐    ┌──────┐    ┌────────┐    ┌────────┐
│  Commit │ → │ Build │ → │ Test │ → │ Deploy │ → │ Notify │
└─────────┘    └──────┘    └──────┘    └────────┘    └────────┘
                   ↓            ↓           ↓             ↓
               Success?     All Pass?   Deployed?    Team Informed
```

**Pipeline Example:**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: ./deploy.sh

  notify:
    needs: deploy
    runs-on: ubuntu-latest
    if: always()
    steps:
      - run: ./notify-team.sh
```

---

## Microservices

### 21. What are Microservices?

**Microservices** is an architectural approach where an application is built as many small, independent services instead of one large monolithic application.

**Key Characteristics:**
- Each service does one specific job
- Services are independent and self-contained
- Services communicate through APIs
- Each service can be developed, deployed, and scaled independently

**Think of it as:** Tiny specialized apps that work together to create one big application.

**Monolithic vs Microservices:**

```
┌─────────────────────────┐       ┌────────┐  ┌─────────┐
│   Monolithic App        │       │ User   │  │ Product │
│                         │       │ Service│  │ Service │
│  - User Management      │       └────────┘  └─────────┘
│  - Product Catalog      │  VS   ┌────────┐  ┌─────────┐
│  - Shopping Cart        │       │ Cart   │  │ Order   │
│  - Order Processing     │       │ Service│  │ Service │
│  - Payment              │       └────────┘  └─────────┘
└─────────────────────────┘       ┌────────┐
                                  │Payment │
                                  │Service │
                                  └────────┘
```

---

### 22. Why Use Microservices?

**Benefits:**

1. **Independence**
   - Update one service without touching others
   - Different teams can work on different services
   - Use different technologies for different services

2. **Resilience**
   - If one service fails, others can continue working
   - Easier to isolate and fix problems

3. **Scalability**
   - Scale only the services that need more resources
   - More cost-effective than scaling entire monolith

4. **Faster Development**
   - Smaller codebases are easier to understand
   - Faster deployment cycles
   - Teams can work in parallel

**Comparison Table:**

| Feature | Monolithic | Microservices |
|---------|-----------|---------------|
| Architecture | Single large application | Multiple small services |
| Deployment | Deploy entire app | Deploy individual services |
| Scaling | Scale entire app | Scale specific services |
| Technology | One tech stack | Different stacks per service |
| Complexity | Lower initially | Higher complexity |
| Failure impact | Entire app fails | Only affected service fails |

---

### 23. Microservices Example

**E-Commerce Application:**

Instead of one big application, split into specialized services:

```
┌──────────────────┐
│   User Service   │  → Handles login, signup, profiles
└──────────────────┘

┌──────────────────┐
│ Product Service  │  → Shows product catalog, details, search
└──────────────────┘

┌──────────────────┐
│   Cart Service   │  → Manages shopping cart, cart items
└──────────────────┘

┌──────────────────┐
│  Order Service   │  → Processes orders, order history
└──────────────────┘

┌──────────────────┐
│ Payment Service  │  → Handles payment processing
└──────────────────┘

┌──────────────────┐
│Notification Svc. │  → Sends emails, SMS, push notifications
└──────────────────┘
```

**How Services Communicate:**

```javascript
// User places an order
1. Frontend → Cart Service (get cart items)
2. Frontend → Order Service (create order)
3. Order Service → Payment Service (process payment)
4. Order Service → Notification Service (send confirmation email)
5. Order Service → Product Service (update inventory)
```

**Each service:**
- Runs independently
- Has its own database
- Can be updated separately
- Communicates via REST API or message queues

---

### 24. Problems with Microservices

**Challenges:**

1. **Increased Complexity**
   - Many services to manage
   - Need orchestration tools (Kubernetes, Docker Swarm)
   - More moving parts = more things to monitor

2. **Network Communication**
   - Services communicate over network
   - Network calls can fail or be slow
   - Need to handle timeouts, retries
   - Latency can accumulate

3. **Data Consistency**
   - Each service has its own database
   - Distributed transactions are complex
   - Eventual consistency challenges
   - Data synchronization issues

4. **Security**
   - More APIs to secure
   - Inter-service authentication needed
   - Network security between services
   - Secret management complexity

5. **Deployment & DevOps**
   - Need CI/CD for each service
   - Container orchestration required
   - Monitoring and logging more complex
   - Debugging distributed systems is harder

6. **Cost**
   - More infrastructure
   - More databases
   - More development time initially
   - Operational overhead

**When NOT to Use Microservices:**
- Small applications
- Small teams
- Tight deadlines
- Limited DevOps expertise
- When simplicity is prioritized

**Microservices Decision Matrix:**

| Factor | Monolithic Better | Microservices Better |
|--------|------------------|---------------------|
| Team size | < 5 developers | > 10 developers |
| App complexity | Simple | Complex |
| Scalability needs | Uniform | Variable per feature |
| Deployment frequency | Infrequent | Frequent |
| Technology diversity | Single stack | Multiple stacks |

---

## Docker

### 25. What is Docker?

**Docker** is a tool that packages your application and everything it needs into a **container** so it runs reliably on any computer or server, no matter where it's deployed.

**Key Concepts:**
- Packages app with all dependencies
- Runs consistently everywhere
- Lightweight and fast
- Isolated from other applications

**Think of it as:** A shipping container for your application - it includes everything needed to run, and works the same way everywhere.

```
┌──────────────────────────┐
│     Your Application     │
│  ┌────────────────────┐  │
│  │ App Code           │  │
│  │ Dependencies       │  │
│  │ Configuration      │  │
│  │ Runtime            │  │
│  └────────────────────┘  │
│      Docker Container    │
└──────────────────────────┘
```

**Docker in one line:**
"A tool that packages apps into containers so they run the same everywhere."

**Benefits:**
- **Consistency** - Works on dev, test, and production
- **Portability** - Run on any system with Docker
- **Isolation** - Apps don't interfere with each other
- **Efficiency** - Lightweight and fast startup

---

### 26. Docker vs Virtual Machine

Understanding the difference between Docker and VMs is crucial.

#### Docker (Containers)

**How it works:**
- Packages only your app and its dependencies
- Containers share the host operating system
- No full OS needed for each container

**Characteristics:**
- Start very fast (seconds)
- Use fewer resources (lightweight)
- Small disk footprint (MBs)
- Great for microservices

**Think of it as:** Many small apps sharing the same house but each in its own room.

```
┌────────────────────────────────────┐
│         Host Operating System      │
│  ┌──────────────────────────────┐  │
│  │      Docker Engine           │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ │  │
│  │  │App 1 │ │App 2 │ │App 3 │ │  │
│  │  │Deps  │ │Deps  │ │Deps  │ │  │
│  │  └──────┘ └──────┘ └──────┘ │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

#### Virtual Machine (VM)

**How it works:**
- Creates a full virtual computer
- Each VM runs complete operating system
- Runs on hypervisor

**Characteristics:**
- Slower to start (minutes)
- Uses more memory and CPU (heavy)
- Large disk footprint (GBs)
- Complete isolation

**Think of it as:** Separate houses, each with its own facilities and infrastructure.

```
┌────────────────────────────────────┐
│         Host Operating System      │
│  ┌──────────────────────────────┐  │
│  │        Hypervisor            │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ │  │
│  │  │ OS 1 │ │ OS 2 │ │ OS 3 │ │  │
│  │  │ App  │ │ App  │ │ App  │ │  │
│  │  │ Deps │ │ Deps │ │ Deps │ │  │
│  │  └──────┘ └──────┘ └──────┘ │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

**Comparison Table:**

| Feature | Docker Containers | Virtual Machines |
|---------|------------------|------------------|
| **OS** | Share host OS kernel | Each has full OS |
| **Size** | Lightweight (MBs) | Heavy (GBs) |
| **Startup time** | Seconds | Minutes |
| **Performance** | Near-native | Overhead from virtualization |
| **Isolation** | Process-level | Complete isolation |
| **Resource usage** | Low | High |
| **Portability** | Very portable | Less portable |
| **Use case** | Microservices, CI/CD | Legacy apps, different OS needed |
| **Density** | Can run 100s per host | Can run 10s per host |

**When to Use What:**

**Use Docker when:**
- Building microservices
- Need fast deployments
- Running same OS everywhere
- Want lightweight isolation
- CI/CD pipelines

**Use VMs when:**
- Need different operating systems
- Require complete isolation
- Running legacy applications
- Security is paramount
- Need full OS features

---

### 27. Docker Image vs Container

Understanding the relationship between images and containers is fundamental.

#### Docker Image

**What it is:**
- A blueprint/template for containers
- Contains everything needed to run an app
- Read-only
- Can be shared and reused
- Stored in registries (Docker Hub, private registries)

**Think of it as:** A recipe or blueprint that defines what your container will look like.

**Image Contents:**
- Application code
- Runtime environment
- Libraries and dependencies
- Configuration files
- Environment variables
- Metadata

```dockerfile
# Example Dockerfile (creates an image)
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

#### Docker Container

**What it is:**
- A running instance created from an image
- Active and uses CPU/memory
- Can be started, stopped, deleted
- Has its own writable layer
- Can interact with filesystem, network

**Think of it as:** The live, running version of your blueprint.

```bash
# Create container from image
docker run -p 3000:3000 my-app-image

# Container is now running and accessible
```

**Image vs Container Analogy:**

```
Image (Recipe)          Container (Cake)
────────────            ────────────────
Blueprint       →       Running Instance
Read-only       →       Has state
Reusable        →       Single use
Template        →       Actual app
```

**Comparison Table:**

| Feature | Image | Container |
|---------|-------|-----------|
| **State** | Static, immutable | Running, has state |
| **File system** | Read-only layers | Has writable layer on top |
| **Purpose** | Template | Running application |
| **Can be shared** | Yes, via registries | No, instance-specific |
| **Resource usage** | None (just storage) | Uses CPU, memory, network |
| **Lifespan** | Permanent (until deleted) | Temporary (can be stopped/removed) |

**Practical Example:**

```bash
# 1. Build image from Dockerfile
docker build -t my-app:latest .
# Creates image (blueprint)

# 2. Run container from image
docker run -d -p 3000:3000 my-app:latest
# Creates running container (instance)

# 3. Can create multiple containers from same image
docker run -d -p 3001:3000 my-app:latest
docker run -d -p 3002:3000 my-app:latest
# Three containers running from one image
```

**Key Relationship:**
- One image can create many containers
- Containers are ephemeral, images are persistent
- Deleting a container doesn't delete the image
- Images are built once, containers are created as needed

---

## 28. Summary

**Key Takeaways:**

### GitHub Actions
1. **Workflows** - Complete automation plan defined in YAML
2. **Events** - Triggers that start workflows (push, PR, schedule)
3. **Jobs** - Groups of steps that run together on same runner
4. **Actions** - Reusable prebuilt tools (checkout, setup-node)
5. **Runners** - Machines that execute jobs (GitHub-hosted or self-hosted)
6. **Steps** - Individual tasks within a job
7. **Conditions** - Control when steps/jobs run with `if`
8. **YAML** - Human-friendly format for defining workflows

### CI/CD
1. **Continuous Integration** - Automatically test code on every push
2. **Continuous Delivery** - Code ready to deploy, manual approval
3. **Continuous Deployment** - Automatically deploy to production
4. **Pipeline** - Automated path: Build → Test → Deploy → Notify

### Microservices
1. **Definition** - App split into small independent services
2. **Benefits** - Independence, resilience, scalability
3. **Challenges** - Complexity, network issues, data consistency
4. **When to Use** - Large apps, large teams, need for scalability

### Docker
1. **Docker** - Packages app into containers for consistent deployment
2. **Containers** - Lightweight, fast, share host OS
3. **Images** - Read-only blueprints for containers
4. **vs VMs** - Containers are lighter and faster than VMs

**Workflow Best Practices:**

```yaml
✅ DO:
- Use semantic workflow names
- Cache dependencies when possible
- Use specific action versions (v3, not @latest)
- Store secrets in GitHub Secrets
- Use matrix builds for multiple versions
- Add status badges to README
- Use conditions to control execution
- Clean up artifacts after deployment

❌ DON'T:
- Hardcode secrets in workflows
- Use overly complex workflows
- Run unnecessary steps on every commit
- Ignore failed builds
- Skip testing before deployment
```

**Pipeline Comparison:**

| Stage | CI | CD (Delivery) | CD (Deployment) |
|-------|----|--------------|-----------------|
| Build | ✅ | ✅ | ✅ |
| Test | ✅ | ✅ | ✅ |
| Package | ❌ | ✅ | ✅ |
| Manual Approval | ❌ | ✅ | ❌ |
| Auto Deploy | ❌ | ❌ | ✅ |

**Architecture Comparison:**

| Factor | Monolithic | Microservices | Containers | VMs |
|--------|-----------|---------------|------------|-----|
| Complexity | Low | High | Medium | Low |
| Scalability | Limited | Excellent | Good | Good |
| Startup time | Medium | Fast | Seconds | Minutes |
| Resource usage | High | Variable | Low | High |
| Isolation | None | Service-level | Process-level | Complete |

**Modern Development Stack:**

```
Code → GitHub → GitHub Actions (CI/CD)
                     ↓
              Docker Containers
                     ↓
              Microservices
                     ↓
        Production (Cloud/On-prem)
```

**Complete Example Integration:**

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy Microservices

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [user-service, product-service, order-service]
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: |
          cd services/${{ matrix.service }}
          docker build -t ${{ matrix.service }}:latest .

      - name: Push to registry
        run: docker push ${{ matrix.service }}:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/
```

This guide covers the complete CI/CD workflow from code commit to production deployment using modern tools and practices.
