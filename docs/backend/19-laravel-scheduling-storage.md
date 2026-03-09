# Task Scheduling, File Storage, Horizon & Scout in Laravel

A comprehensive guide to task scheduling, file storage, Horizon queue monitoring, and Scout full-text search in Laravel.

## Table of Contents

1. [What is Task Scheduling in Laravel?](#1-what-is-task-scheduling-in-laravel)
2. [How to Define Scheduled Tasks](#2-how-to-define-scheduled-tasks)
3. [Task Scheduling Best Practices](#3-task-scheduling-best-practices)
4. [What is Laravel File Storage?](#4-what-is-laravel-file-storage)
5. [File Uploads in Laravel](#5-file-uploads-in-laravel)
6. [Amazon S3 Integration](#6-amazon-s3-integration)
7. [What is Laravel Horizon?](#7-what-is-laravel-horizon)
8. [What is Laravel Scout?](#8-what-is-laravel-scout)
9. [Laravel Scout Setup and Usage](#9-laravel-scout-setup-and-usage)

---

## 1. What is Task Scheduling in Laravel?

- Task scheduling lets you automate repetitive tasks in your application (sending reports, cleaning up old records, syncing data, etc.).
- Traditionally, you would add individual cron jobs on your server for each task. This is hard to manage, not version-controlled, and error-prone.
- Laravel provides a built-in **Task Scheduler** that lets you define all your scheduled tasks inside your Laravel application using clean, fluent PHP code.
- You only need **one single cron entry** on your server that runs every minute:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

- Every minute, `schedule:run` checks all the tasks you have defined and runs the ones that are due.

**Why use the Laravel Scheduler instead of raw cron jobs?**

- All schedule logic lives in your codebase (version-controlled).
- Easier to read, write, and maintain.
- Built-in features like overlap prevention, maintenance mode handling, and output logging.
- You can test scheduled tasks locally with `php artisan schedule:work` (runs the scheduler in the foreground).

```bash
# Run the scheduler continuously in development
php artisan schedule:work

# List all scheduled tasks and their next run time
php artisan schedule:list
```

In short: Laravel's task scheduler replaces messy server cron jobs with clean PHP code, requiring only one cron entry on your server.

---

## 2. How to Define Scheduled Tasks

- In Laravel 11+, you define your scheduled tasks in `routes/console.php` using the `Schedule` facade.
- In Laravel 10 and earlier, you define them in the `schedule` method of `App\Console\Kernel`.

**Laravel 11+ (routes/console.php):**

```php
use Illuminate\Support\Facades\Schedule;

// Run an Artisan command daily at midnight
Schedule::command('reports:generate')->daily();

// Run a closure every hour
Schedule::call(function () {
    DB::table('recent_views')->where('created_at', '<', now()->subWeek())->delete();
})->hourly();

// Run a shell command every day at 1:00 AM
Schedule::exec('node /home/scripts/cleanup.js')->dailyAt('01:00');
```

**Laravel 10 and earlier (App\Console\Kernel):**

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('reports:generate')->daily();

    $schedule->call(function () {
        DB::table('recent_views')->where('created_at', '<', now()->subWeek())->delete();
    })->hourly();
}
```

**Common frequency options:**

- `->everyMinute()` -- runs the task every minute.
- `->everyFiveMinutes()` -- runs every 5 minutes.
- `->everyTenMinutes()` -- runs every 10 minutes.
- `->everyFifteenMinutes()` -- runs every 15 minutes.
- `->everyThirtyMinutes()` -- runs every 30 minutes.
- `->hourly()` -- runs once per hour at the start of the hour.
- `->hourlyAt(17)` -- runs every hour at 17 minutes past.
- `->daily()` -- runs once per day at midnight.
- `->dailyAt('13:00')` -- runs daily at 1:00 PM.
- `->twiceDaily(1, 13)` -- runs at 1:00 AM and 1:00 PM.
- `->weekly()` -- runs once per week (Sunday at midnight).
- `->weeklyOn(1, '8:00')` -- runs every Monday at 8:00 AM.
- `->monthly()` -- runs once per month on the 1st at midnight.
- `->monthlyOn(15, '09:00')` -- runs on the 15th of each month at 9:00 AM.
- `->quarterly()` -- runs once per quarter.
- `->yearly()` -- runs once per year.
- `->cron('0 */6 * * *')` -- use a raw cron expression (every 6 hours in this example).

**Practical examples:**

```php
use Illuminate\Support\Facades\Schedule;
use App\Jobs\SendWeeklyNewsletter;
use App\Models\User;

// Clean up expired tokens every day at 3:00 AM
Schedule::command('sanctum:prune-expired')->dailyAt('03:00');

// Dispatch a job every Monday at 9:00 AM
Schedule::job(new SendWeeklyNewsletter)->weeklyOn(1, '09:00');

// Backup database daily at 2:00 AM
Schedule::command('backup:run')->dailyAt('02:00');

// Send reminder emails every weekday at 8:00 AM
Schedule::command('reminders:send')
    ->weekdays()
    ->at('08:00');

// Run a task only in production
Schedule::command('analytics:aggregate')
    ->hourly()
    ->environments(['production']);

// Custom cron: every 6 hours on weekdays only
Schedule::command('sync:inventory')
    ->cron('0 */6 * * 1-5');
```

**Day constraints:**

- `->weekdays()` -- Monday through Friday only.
- `->weekends()` -- Saturday and Sunday only.
- `->sundays()` through `->saturdays()` -- specific day of the week.

In short: You define scheduled tasks with a fluent API using frequency methods like `daily()`, `hourly()`, or raw `cron()` expressions, and Laravel handles the rest.

---

## 3. Task Scheduling Best Practices

**Preventing task overlaps:**

- If a task takes longer than expected, it may still be running when the next execution is due.
- Use `withoutOverlapping()` to ensure only one instance of a task runs at a time.
- By default, the lock expires after 24 hours. You can customize it.

```php
// Prevent overlapping -- if the task is still running, skip the next run
Schedule::command('reports:generate')
    ->hourly()
    ->withoutOverlapping();

// Lock expires after 10 minutes (in case the task crashes)
Schedule::command('reports:generate')
    ->hourly()
    ->withoutOverlapping(10);
```

**Running on one server only (multi-server deployments):**

- If your app runs on multiple servers, every server will try to run the same scheduled tasks.
- Use `onOneServer()` to ensure the task runs on only one server.
- Requires a cache driver that supports atomic locks (Redis, Memcached, DynamoDB -- not the `file` driver).

```php
Schedule::command('reports:generate')
    ->daily()
    ->onOneServer();
```

**Output logging:**

- You can log the output of scheduled tasks to a file for debugging.
- Use `sendOutputTo()` to write output to a file, or `appendOutputTo()` to append.
- Use `emailOutputTo()` to email the output to someone.
- Use `emailOutputOnFailure()` to only email when the task fails.

```php
// Write output to a log file
Schedule::command('reports:generate')
    ->daily()
    ->appendOutputTo(storage_path('logs/reports.log'));

// Email output on failure
Schedule::command('reports:generate')
    ->daily()
    ->emailOutputOnFailure('admin@example.com');
```

**Hooks (before and after):**

- You can run callbacks before and after a scheduled task.
- Useful for logging, notifications, or cleanup.

```php
Schedule::command('reports:generate')
    ->daily()
    ->before(function () {
        Log::info('Starting report generation...');
    })
    ->after(function () {
        Log::info('Report generation completed.');
    })
    ->onFailure(function () {
        Log::error('Report generation failed!');
    })
    ->onSuccess(function () {
        // Notify admin that it succeeded
    });
```

**Maintenance mode:**

- By default, scheduled tasks do NOT run when the app is in maintenance mode (`php artisan down`).
- Use `evenInMaintenanceMode()` if you need a task to keep running during maintenance.

```php
Schedule::command('heartbeat:check')
    ->everyMinute()
    ->evenInMaintenanceMode();
```

**Running tasks in the background:**

- By default, tasks run sequentially. If you have many tasks due at the same time, they wait for each other.
- Use `runInBackground()` to run tasks in parallel.

```php
Schedule::command('analytics:aggregate')
    ->hourly()
    ->runInBackground();
```

In short: Use `withoutOverlapping()` to prevent duplicate runs, `onOneServer()` for multi-server setups, output logging for debugging, and `evenInMaintenanceMode()` when tasks must always run.

---

## 4. What is Laravel File Storage?

- Laravel provides a powerful filesystem abstraction through the **Storage facade**.
- It uses the Flysystem PHP package under the hood, giving you a unified API for working with local files, Amazon S3, and other cloud storage providers.
- You interact with files the same way regardless of where they are stored.

**Configuration:**

- File storage is configured in `config/filesystems.php`.
- Each storage location is called a **disk**.
- Laravel ships with three disk types out of the box:
  - **local** -- stores files in `storage/app/private` (not publicly accessible).
  - **public** -- stores files in `storage/app/public` (publicly accessible after running `php artisan storage:link`).
  - **s3** -- stores files on Amazon S3 or any S3-compatible service.

```php
// config/filesystems.php
'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app/private'),
    ],

    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL') . '/storage',
        'visibility' => 'public',
    ],

    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
    ],
],

// Default disk
'default' => env('FILESYSTEM_DISK', 'local'),
```

**Basic file operations:**

```php
use Illuminate\Support\Facades\Storage;

// Store a file
Storage::put('file.txt', 'Hello, World!');

// Read a file
$content = Storage::get('file.txt');

// Check if file exists
if (Storage::exists('file.txt')) {
    // ...
}

// Delete a file
Storage::delete('file.txt');

// Delete multiple files
Storage::delete(['file1.txt', 'file2.txt']);

// Copy a file
Storage::copy('old.txt', 'new.txt');

// Move / rename a file
Storage::move('old.txt', 'new.txt');

// Get file size (in bytes)
$size = Storage::size('file.txt');

// Get last modified time
$time = Storage::lastModified('file.txt');

// List all files in a directory
$files = Storage::files('photos');

// List all files recursively
$files = Storage::allFiles('photos');

// List directories
$directories = Storage::directories('/');

// Use a specific disk
Storage::disk('s3')->put('photos/avatar.jpg', $content);
```

**Making files publicly accessible:**

- Files in the `public` disk need a symbolic link from `public/storage` to `storage/app/public`.
- Run `php artisan storage:link` to create this symlink.
- After that, files stored in the `public` disk are accessible via URL.

```php
// Store to the public disk
Storage::disk('public')->put('avatars/user1.jpg', $content);

// Get the public URL
$url = Storage::disk('public')->url('avatars/user1.jpg');
// Returns: http://yourapp.com/storage/avatars/user1.jpg
```

In short: Laravel's Storage facade gives you one consistent API to read, write, and manage files across local storage, public storage, and cloud providers like S3.

---

## 5. File Uploads in Laravel

- Laravel makes handling file uploads easy with the `store()` and `storeAs()` methods on uploaded files.
- Always validate uploads before storing them.

**Basic file upload:**

```php
// In your controller
public function uploadAvatar(Request $request)
{
    $request->validate([
        'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
    ]);

    // Store with auto-generated filename
    $path = $request->file('avatar')->store('avatars', 'public');
    // Returns: "avatars/randomname.jpg"

    // Store with a custom filename
    $path = $request->file('avatar')->storeAs(
        'avatars',
        $request->user()->id . '.jpg',
        'public'
    );
    // Returns: "avatars/42.jpg"

    // Save the path to the user record
    $request->user()->update(['avatar' => $path]);

    return back()->with('success', 'Avatar uploaded!');
}
```

**Validation rules for files:**

- `file` -- must be an uploaded file.
- `image` -- must be an image (jpeg, png, bmp, gif, svg, webp).
- `mimes:jpeg,png,pdf` -- must match specific MIME types.
- `max:2048` -- maximum size in kilobytes (2MB in this case).
- `min:100` -- minimum size in kilobytes.
- `dimensions:min_width=100,min_height=100` -- image dimension constraints.

```php
$request->validate([
    'document' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
    'photo'    => 'required|image|dimensions:min_width=200,min_height=200|max:5120',
    'photos.*' => 'image|max:2048', // validate each file in an array
]);
```

**Handling multiple file uploads:**

```php
public function uploadPhotos(Request $request)
{
    $request->validate([
        'photos'   => 'required|array|max:5',
        'photos.*' => 'image|mimes:jpeg,png|max:2048',
    ]);

    $paths = [];

    foreach ($request->file('photos') as $photo) {
        $paths[] = $photo->store('gallery', 'public');
    }

    // Save paths to database
    foreach ($paths as $path) {
        $request->user()->photos()->create(['path' => $path]);
    }

    return back()->with('success', count($paths) . ' photos uploaded!');
}
```

**Generating URLs for stored files:**

```php
// Public disk URL
$url = Storage::disk('public')->url('avatars/user1.jpg');
// http://yourapp.com/storage/avatars/user1.jpg

// Temporary URL (for S3, works with private files)
$url = Storage::disk('s3')->temporaryUrl(
    'reports/secret.pdf',
    now()->addMinutes(30)
);

// In Blade templates
<img src="{{ Storage::disk('public')->url($user->avatar) }}" alt="Avatar">

// Or using the asset helper with the storage symlink
<img src="{{ asset('storage/' . $user->avatar) }}" alt="Avatar">
```

**Deleting uploaded files:**

```php
public function deleteAvatar(Request $request)
{
    $user = $request->user();

    // Delete the file from storage
    if ($user->avatar) {
        Storage::disk('public')->delete($user->avatar);
    }

    // Clear the path in the database
    $user->update(['avatar' => null]);

    return back()->with('success', 'Avatar deleted.');
}
```

In short: Laravel handles file uploads with built-in validation, auto-generated filenames, and simple methods like `store()` and `storeAs()` to save files to any disk.

---

## 6. Amazon S3 Integration

- Amazon S3 (Simple Storage Service) is a cloud file storage service by AWS.
- Use S3 when you need scalable, reliable, and globally accessible file storage.
- Laravel makes S3 integration seamless through the Storage facade.

**When to use S3 instead of local storage:**

- Your app runs on multiple servers (files must be shared across servers).
- You need high availability and durability (99.999999999%).
- You want to serve files via a CDN (CloudFront).
- Your files are large or numerous (videos, backups, user uploads at scale).
- You need fine-grained access control and presigned URLs.

**Installation:**

```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```

**Configuration (.env):**

```env
FILESYSTEM_DISK=s3

AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_URL=https://your-bucket.s3.amazonaws.com
```

**Uploading files to S3:**

```php
use Illuminate\Support\Facades\Storage;

// Upload from a request
public function upload(Request $request)
{
    $request->validate([
        'file' => 'required|file|max:10240',
    ]);

    // Store on S3
    $path = $request->file('file')->store('uploads', 's3');

    // Store with custom name
    $path = $request->file('file')->storeAs(
        'uploads',
        'report-' . now()->format('Y-m-d') . '.pdf',
        's3'
    );

    return response()->json(['path' => $path]);
}

// Upload raw content
Storage::disk('s3')->put('logs/app.log', 'Log content here');

// Upload with visibility
Storage::disk('s3')->put('public/banner.jpg', $content, 'public');
```

**Downloading and reading files from S3:**

```php
// Get file contents
$content = Storage::disk('s3')->get('uploads/report.pdf');

// Download response (sends file to browser)
return Storage::disk('s3')->download('uploads/report.pdf');

// Stream a large file
return Storage::disk('s3')->response('videos/tutorial.mp4');
```

**Presigned (temporary) URLs:**

- Presigned URLs give temporary access to private files on S3.
- The URL expires after a specified time.
- Great for secure downloads, private images, and time-limited access.

```php
// Generate a temporary URL valid for 30 minutes
$url = Storage::disk('s3')->temporaryUrl(
    'private/contracts/contract-123.pdf',
    now()->addMinutes(30)
);

// Generate a temporary URL valid for 1 hour with custom headers
$url = Storage::disk('s3')->temporaryUrl(
    'private/reports/q4-report.pdf',
    now()->addHour(),
    [
        'ResponseContentDisposition' => 'attachment; filename="report.pdf"',
    ]
);

// Use in a controller
public function downloadContract(Contract $contract)
{
    $this->authorize('view', $contract);

    $url = Storage::disk('s3')->temporaryUrl(
        $contract->file_path,
        now()->addMinutes(5)
    );

    return redirect($url);
}
```

**Switching between local and S3 seamlessly:**

```php
// Your code stays the same, only the config changes
Storage::put('avatars/user1.jpg', $content);
Storage::get('avatars/user1.jpg');
Storage::delete('avatars/user1.jpg');

// In .env for local development:
// FILESYSTEM_DISK=local

// In .env for production:
// FILESYSTEM_DISK=s3
```

In short: S3 integration in Laravel is straightforward -- install the Flysystem S3 adapter, set your credentials in `.env`, and use the same Storage facade methods you already know.

---

## 7. What is Laravel Horizon?

- Laravel Horizon is a dashboard and configuration system for your Redis-powered queues.
- It provides a beautiful web UI to monitor your queues, jobs, failed jobs, throughput, and runtime metrics.
- Horizon is only for **Redis** queues. It does not work with the database, SQS, or other queue drivers.

**What Horizon shows you:**

- Real-time overview of all queues and their throughput.
- Recent jobs (completed, failed, pending).
- Failed jobs with full exception details and the ability to retry.
- Job wait times and runtime metrics.
- Tags and filtering to find specific jobs.
- Queue workload balancing across supervisor processes.

**When to use Horizon:**

- You are using Redis as your queue driver.
- You want a visual dashboard to monitor job processing.
- You need automatic workload balancing across queues.
- You want to track metrics and set up alerts for long wait times.
- You need an easy way to retry failed jobs from a UI.

**Installation and setup:**

```bash
composer require laravel/horizon

php artisan horizon:install
```

- This publishes the Horizon configuration file and assets.
- Configuration is in `config/horizon.php`.

```php
// config/horizon.php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'maxProcesses' => 10,
            'balanceMaxShift' => 1,
            'balanceCooldown' => 3,
        ],
    ],
    'local' => [
        'supervisor-1' => [
            'maxProcesses' => 3,
        ],
    ],
],
```

**Running Horizon:**

```bash
# Start Horizon (replaces queue:work)
php artisan horizon

# Check Horizon status
php artisan horizon:status

# Pause / Continue processing
php artisan horizon:pause
php artisan horizon:continue

# Terminate Horizon gracefully
php artisan horizon:terminate
```

**Accessing the dashboard:**

- The Horizon dashboard is available at `/horizon` in your browser.
- By default, it is only accessible in the `local` environment.
- To allow access in production, configure the authorization gate in `HorizonServiceProvider`:

```php
// app/Providers/HorizonServiceProvider.php
protected function gate(): void
{
    Gate::define('viewHorizon', function (User $user) {
        return in_array($user->email, [
            'admin@example.com',
        ]);
    });
}
```

**Metrics and notifications:**

```php
use Laravel\Horizon\Horizon;

// In a service provider boot method
Horizon::routeMailNotificationsTo('admin@example.com');
Horizon::routeSlackNotificationsTo('slack-webhook-url', '#horizon');

// Set the number of minutes a job can wait before triggering a notification
Horizon::routeMailNotificationsTo('admin@example.com');
```

**Deploying Horizon in production:**

- Use a process monitor like Supervisor to keep Horizon running.
- After deploying new code, terminate and restart Horizon so it picks up the changes.

```bash
php artisan horizon:terminate
```

```ini
# /etc/supervisor/conf.d/horizon.conf
[program:horizon]
process_name=%(program_name)s
command=php /home/forge/app.com/artisan horizon
autostart=true
autorestart=true
user=forge
redirect_stderr=true
stdout_logfile=/home/forge/app.com/horizon.log
stopwaitsecs=3600
```

In short: Laravel Horizon gives you a real-time web dashboard to monitor, manage, and balance your Redis-powered queues with beautiful metrics and easy failed-job retries.

---

## 8. What is Laravel Scout?

- Laravel Scout provides a simple, driver-based solution for adding **full-text search** to your Eloquent models.
- It automatically syncs your model data to a search index whenever a model is created, updated, or deleted.
- You can then perform fast, full-text searches against that index using a clean, fluent API.

**How Scout works:**

- You add the `Searchable` trait to a model.
- Scout watches for model events (created, updated, deleted).
- When a model changes, Scout syncs the data to a search engine (Algolia, Meilisearch, or a database driver).
- When you search, Scout queries the search engine and returns Eloquent models.

```
User creates/updates a Post
        |
        v
Scout detects the model event
        |
        v
Scout syncs data to search engine (Algolia / Meilisearch / DB)
        |
        v
User searches "laravel tutorial"
        |
        v
Scout queries the search engine
        |
        v
Returns matching Eloquent models
```

**Available drivers:**

- **Algolia** -- a hosted search-as-a-service platform. Fast, powerful, feature-rich. Best for production apps that need lightning-fast search with advanced features (typo tolerance, faceting, geo-search). Paid service.
- **Meilisearch** -- an open-source search engine you can self-host. Great performance, easy to set up, free to run on your own server. Good alternative to Algolia.
- **Database** -- uses your existing database (`WHERE LIKE` queries). No external service needed. Good for small apps or development. Limited search quality compared to dedicated search engines.
- **Collection** -- searches in-memory on Eloquent collections. Useful for testing. Not for production.

**When to use Scout:**

- You need search functionality beyond simple `WHERE LIKE` queries.
- You want typo-tolerant, ranked, and relevant search results.
- You have content-heavy models (articles, products, documentation).
- You want search to be fast even with millions of records.

In short: Laravel Scout adds full-text search to your Eloquent models by syncing data to search engines like Algolia or Meilisearch and providing a simple search API.

---

## 9. Laravel Scout Setup and Usage

**Installation:**

```bash
composer require laravel/scout

php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

**Choose and install a driver:**

```bash
# For Meilisearch (recommended for self-hosted)
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle

# For Algolia
composer require algolia/algoliasearch-client-php

# Database driver is built-in, no extra package needed
```

**Configure the driver (.env):**

```env
# Meilisearch
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey

# Algolia
SCOUT_DRIVER=algolia
ALGOLIA_APP_ID=your-app-id
ALGOLIA_SECRET=your-secret-key

# Database (no external service needed)
SCOUT_DRIVER=database
```

**Making a model searchable:**

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Post extends Model
{
    use Searchable;

    /**
     * Get the indexable data array for the model.
     * Controls which fields are sent to the search engine.
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'author' => $this->author->name,
            'category' => $this->category->name,
            'created_at' => $this->created_at->timestamp,
        ];
    }

    /**
     * Get the name of the search index (optional).
     * Defaults to the model's table name.
     */
    public function searchableAs(): string
    {
        return 'posts_index';
    }
}
```

**Importing existing data:**

```bash
# Import all existing records into the search index
php artisan scout:import "App\Models\Post"

# Flush (remove) all records from the search index
php artisan scout:flush "App\Models\Post"
```

**Searching:**

```php
use App\Models\Post;

// Basic search
$posts = Post::search('laravel tutorial')->get();

// Search with pagination
$posts = Post::search('laravel')->paginate(15);

// Search with a where clause (filtering)
$posts = Post::search('laravel')
    ->where('category', 'tutorials')
    ->get();

// Search and get raw results from the search engine
$results = Post::search('laravel')->raw();

// Search with a callback for advanced engine-specific queries
$posts = Post::search('laravel', function ($engine, string $query, array $options) {
    $options['filters'] = 'category = tutorials AND created_at > 1700000000';
    return $engine->search($query, $options);
})->get();
```

**Conditional searching (soft deletes):**

```php
// If your model uses SoftDeletes, you can include trashed records
$posts = Post::search('laravel')->withTrashed()->get();

// Only search trashed records
$posts = Post::search('laravel')->onlyTrashed()->get();
```

**Pausing indexing temporarily:**

```php
use App\Models\Post;

// Perform operations without syncing to the search engine
Post::withoutSyncingToSearch(function () {
    Post::where('category_id', 5)->update(['category_id' => 10]);
});

// Useful for bulk operations or migrations
```

**Queueing index operations:**

- By default, Scout syncs to the search engine immediately (synchronously).
- You can queue index operations for better performance by setting this in your config or `.env`:

```env
SCOUT_QUEUE=true
```

```php
// config/scout.php
'queue' => env('SCOUT_QUEUE', false),
```

- When `SCOUT_QUEUE` is true, model changes are dispatched as queued jobs, so your users do not wait for the search engine to respond.

**Practical example -- product search with filters:**

```php
// App\Models\Product
class Product extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'brand' => $this->brand,
            'price' => $this->price,
            'in_stock' => $this->in_stock,
        ];
    }
}

// In a controller
public function search(Request $request)
{
    $query = Product::search($request->input('q', ''));

    if ($request->filled('brand')) {
        $query->where('brand', $request->brand);
    }

    if ($request->boolean('in_stock')) {
        $query->where('in_stock', true);
    }

    $products = $query->paginate(20);

    return view('products.index', compact('products'));
}
```

In short: Install Scout, pick a driver, add the `Searchable` trait to your models, define `toSearchableArray()` for which fields to index, and use `Model::search()` to perform fast full-text searches.
