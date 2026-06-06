<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_email',
        'color_code',
    ];

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
