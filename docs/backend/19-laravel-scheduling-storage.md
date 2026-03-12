# Task Scheduling, File Storage, Horizon & Scout in Laravel

## Table of Contents

1. [Task Scheduling](#1-task-scheduling)
2. [How to Define Scheduled Tasks](#2-how-to-define-scheduled-tasks)
3. [Task Scheduling Best Practices](#3-task-scheduling-best-practices)
4. [File Storage](#4-file-storage)
5. [File Uploads in Laravel](#5-file-uploads-in-laravel)
6. [Amazon S3 Integration](#6-amazon-s3-integration)
7. [Laravel Horizon](#7-laravel-horizon)
8. [Laravel Scout](#8-laravel-scout)
9. [Laravel Scout Setup and Usage](#9-laravel-scout-setup-and-usage)

---

## 1. Task Scheduling

Define all scheduled tasks in your Laravel app with a single server cron entry:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Every minute, `schedule:run` checks all defined tasks and runs those that are due.

```bash
# Run the scheduler continuously in development
php artisan schedule:work

# List all scheduled tasks and their next run time
php artisan schedule:list
```

---

## 2. How to Define Scheduled Tasks

**Laravel 11+ (`routes/console.php`):**

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

**Laravel 10 and earlier (`App\Console\Kernel`):**

```php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('reports:generate')->daily();

    $schedule->call(function () {
        DB::table('recent_views')->where('created_at', '<', now()->subWeek())->delete();
    })->hourly();
}
```

**Common frequency methods:**

- `->everyMinute()` / `->everyFiveMinutes()` / `->everyTenMinutes()` / `->everyFifteenMinutes()` / `->everyThirtyMinutes()`
- `->hourly()` / `->hourlyAt(17)`
- `->daily()` / `->dailyAt('13:00')` / `->twiceDaily(1, 13)`
- `->weekly()` / `->weeklyOn(1, '8:00')`
- `->monthly()` / `->monthlyOn(15, '09:00')`
- `->quarterly()` / `->yearly()`
- `->cron('0 */6 * * *')` — raw cron expression

**Day constraints:** `->weekdays()` / `->weekends()` / `->sundays()` through `->saturdays()`

**Practical examples:**

```php
use Illuminate\Support\Facades\Schedule;
use App\Jobs\SendWeeklyNewsletter;

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

---

## 3. Task Scheduling Best Practices

**Preventing task overlaps:**

```php
// Skip next run if task is still running
Schedule::command('reports:generate')
    ->hourly()
    ->withoutOverlapping();

// Lock expires after 10 minutes (in case the task crashes)
Schedule::command('reports:generate')
    ->hourly()
    ->withoutOverlapping(10);
```

**Running on one server only (multi-server deployments):**

Requires a cache driver that supports atomic locks (Redis, Memcached, DynamoDB — not `file`).

```php
Schedule::command('reports:generate')
    ->daily()
    ->onOneServer();
```

**Output logging:**

```php
Schedule::command('reports:generate')
    ->daily()
    ->appendOutputTo(storage_path('logs/reports.log'));

// Email output on failure
Schedule::command('reports:generate')
    ->daily()
    ->emailOutputOnFailure('admin@example.com');
```

**Hooks (before and after):**

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
    });
```

**Maintenance mode:**

By default, scheduled tasks do not run during maintenance mode. Use `evenInMaintenanceMode()` to override.

```php
Schedule::command('heartbeat:check')
    ->everyMinute()
    ->evenInMaintenanceMode();
```

**Running tasks in the background:**

```php
Schedule::command('analytics:aggregate')
    ->hourly()
    ->runInBackground();
```

---

## 4. File Storage

Laravel's **Storage facade** provides a unified API for local files, S3, and other cloud providers via Flysystem.

**Configuration (`config/filesystems.php`):**

- **local** — `storage/app/private` (not publicly accessible).
- **public** — `storage/app/public` (publicly accessible after `php artisan storage:link`).
- **s3** — Amazon S3 or any S3-compatible service.

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

'default' => env('FILESYSTEM_DISK', 'local'),
```

**Basic file operations:**

```php
use Illuminate\Support\Facades\Storage;

Storage::put('file.txt', 'Hello, World!');
$content = Storage::get('file.txt');
Storage::exists('file.txt');
Storage::delete('file.txt');
Storage::delete(['file1.txt', 'file2.txt']);
Storage::copy('old.txt', 'new.txt');
Storage::move('old.txt', 'new.txt');
$size = Storage::size('file.txt');
$files = Storage::files('photos');
$files = Storage::allFiles('photos');

// Use a specific disk
Storage::disk('s3')->put('photos/avatar.jpg', $content);
```

**Public URLs:**

```php
// Run once to create the symlink
php artisan storage:link

Storage::disk('public')->put('avatars/user1.jpg', $content);
$url = Storage::disk('public')->url('avatars/user1.jpg');
// Returns: http://yourapp.com/storage/avatars/user1.jpg
```

---

## 5. File Uploads in Laravel

Always validate uploads before storing them.

**Basic file upload:**

```php
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

    $request->user()->update(['avatar' => $path]);

    return back()->with('success', 'Avatar uploaded!');
}
```

**Validation rules for files:**

- `file` — must be an uploaded file.
- `image` — must be an image (jpeg, png, bmp, gif, svg, webp).
- `mimes:jpeg,png,pdf` — specific MIME types.
- `max:2048` — maximum size in kilobytes.
- `dimensions:min_width=100,min_height=100` — image dimension constraints.

```php
$request->validate([
    'document' => 'required|file|mimes:pdf,doc,docx|max:10240',
    'photo'    => 'required|image|dimensions:min_width=200,min_height=200|max:5120',
    'photos.*' => 'image|max:2048',
]);
```

**Multiple file uploads:**

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

    foreach ($paths as $path) {
        $request->user()->photos()->create(['path' => $path]);
    }

    return back()->with('success', count($paths) . ' photos uploaded!');
}
```

**Generating URLs:**

```php
// Public disk URL
$url = Storage::disk('public')->url('avatars/user1.jpg');

// Temporary URL (for S3 private files)
$url = Storage::disk('s3')->temporaryUrl(
    'reports/secret.pdf',
    now()->addMinutes(30)
);

// In Blade templates
<img src="{{ asset('storage/' . $user->avatar) }}" alt="Avatar">
```

**Deleting uploaded files:**

```php
public function deleteAvatar(Request $request)
{
    $user = $request->user();

    if ($user->avatar) {
        Storage::disk('public')->delete($user->avatar);
    }

    $user->update(['avatar' => null]);

    return back()->with('success', 'Avatar deleted.');
}
```

---

## 6. Amazon S3 Integration

Use S3 when running on multiple servers, needing high availability, or serving files via CDN.

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
// Store on S3
$path = $request->file('file')->store('uploads', 's3');

// Store with custom name
$path = $request->file('file')->storeAs(
    'uploads',
    'report-' . now()->format('Y-m-d') . '.pdf',
    's3'
);

// Upload raw content
Storage::disk('s3')->put('logs/app.log', 'Log content here');

// Upload with visibility
Storage::disk('s3')->put('public/banner.jpg', $content, 'public');
```

**Downloading and reading files:**

```php
$content = Storage::disk('s3')->get('uploads/report.pdf');
return Storage::disk('s3')->download('uploads/report.pdf');
return Storage::disk('s3')->response('videos/tutorial.mp4');
```

**Presigned (temporary) URLs:**

```php
// Valid for 30 minutes
$url = Storage::disk('s3')->temporaryUrl(
    'private/contracts/contract-123.pdf',
    now()->addMinutes(30)
);

// With custom response headers
$url = Storage::disk('s3')->temporaryUrl(
    'private/reports/q4-report.pdf',
    now()->addHour(),
    ['ResponseContentDisposition' => 'attachment; filename="report.pdf"']
);

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

**Switching between local and S3:**

```php
// Code stays the same, only the config changes
Storage::put('avatars/user1.jpg', $content);
Storage::get('avatars/user1.jpg');
Storage::delete('avatars/user1.jpg');

// Local: FILESYSTEM_DISK=local
// Production: FILESYSTEM_DISK=s3
```

---

## 7. Laravel Horizon

Horizon is a dashboard and configuration system for Redis-powered queues. **Only works with Redis queues.**

**Installation:**

```bash
composer require laravel/horizon
php artisan horizon:install
```

**Configuration (`config/horizon.php`):**

```php
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
php artisan horizon           # Start Horizon (replaces queue:work)
php artisan horizon:status
php artisan horizon:pause
php artisan horizon:continue
php artisan horizon:terminate
```

**Dashboard access:**

Available at `/horizon`. Restricted to `local` by default. Configure access in `HorizonServiceProvider`:

```php
protected function gate(): void
{
    Gate::define('viewHorizon', function (User $user) {
        return in_array($user->email, [
            'admin@example.com',
        ]);
    });
}
```

**Notifications:**

```php
use Laravel\Horizon\Horizon;

Horizon::routeMailNotificationsTo('admin@example.com');
Horizon::routeSlackNotificationsTo('slack-webhook-url', '#horizon');
```

**Supervisor config for production:**

```ini
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

After deploying new code, run `php artisan horizon:terminate` so Horizon restarts with the latest changes.

---

## 8. Laravel Scout

Scout adds **full-text search** to Eloquent models by syncing data to a search engine and providing a simple search API.

- Add the `Searchable` trait to a model.
- Scout watches for model events (created, updated, deleted) and syncs to the search engine.
- Search queries return Eloquent models.

**Available drivers:**

- **Algolia** — hosted search-as-a-service, fast, paid.
- **Meilisearch** — open-source, self-hosted, great performance.
- **Database** — `WHERE LIKE` queries, no external service, good for small apps.
- **Collection** — in-memory, for testing only.

---

## 9. Laravel Scout Setup and Usage

**Installation:**

```bash
composer require laravel/scout
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

**Install a driver:**

```bash
# Meilisearch (recommended for self-hosted)
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle

# Algolia
composer require algolia/algoliasearch-client-php
```

**Configure (.env):**

```env
# Meilisearch
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey

# Algolia
SCOUT_DRIVER=algolia
ALGOLIA_APP_ID=your-app-id
ALGOLIA_SECRET=your-secret-key

# Database (no external service)
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

    public function searchableAs(): string
    {
        return 'posts_index';
    }
}
```

**Importing existing data:**

```bash
php artisan scout:import "App\Models\Post"
php artisan scout:flush "App\Models\Post"
```

**Searching:**

```php
// Basic search
$posts = Post::search('laravel tutorial')->get();

// With pagination
$posts = Post::search('laravel')->paginate(15);

// With where clause
$posts = Post::search('laravel')
    ->where('category', 'tutorials')
    ->get();

// Raw engine results
$results = Post::search('laravel')->raw();

// Advanced engine-specific query
$posts = Post::search('laravel', function ($engine, string $query, array $options) {
    $options['filters'] = 'category = tutorials AND created_at > 1700000000';
    return $engine->search($query, $options);
})->get();
```

**Soft deletes:**

```php
$posts = Post::search('laravel')->withTrashed()->get();
$posts = Post::search('laravel')->onlyTrashed()->get();
```

**Pausing indexing temporarily:**

```php
Post::withoutSyncingToSearch(function () {
    Post::where('category_id', 5)->update(['category_id' => 10]);
});
```

**Queue index operations:**

```env
SCOUT_QUEUE=true
```

**Product search example:**

```php
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
