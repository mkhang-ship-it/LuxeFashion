<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {--email=admin@luxefashion.com} {--password=Admin@123456} {--name="Admin User"} {--phone=0123456789}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        $password = $this->option('password');
        $name = $this->option('name');
        $phone = $this->option('phone');

        $admin = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'phone' => $phone,
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        if ($admin->wasRecentlyCreated) {
            $this->info("✅ Admin user created successfully!");
        } else {
            $this->info("ℹ️  Admin user already exists (updated)");
        }

        $this->info("Email: {$admin->email}");
        $this->info("Password: {$password}");
        $this->info("Phone: {$admin->phone}");
        $this->info("ID: {$admin->id}");
    }
}

