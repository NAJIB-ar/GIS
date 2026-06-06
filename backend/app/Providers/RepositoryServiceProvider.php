<?php

namespace App\Providers;

use App\Repositories\Interfaces\ProviderRepositoryInterface;
use App\Repositories\Interfaces\ReportRepositoryInterface;
use App\Repositories\ProviderRepository;
use App\Repositories\ReportRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ReportRepositoryInterface::class, ReportRepository::class);
        $this->app->bind(ProviderRepositoryInterface::class, ProviderRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
