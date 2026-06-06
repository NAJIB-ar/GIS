<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_INVESTIGATING = 'investigating';
    const STATUS_RESOLVED = 'resolved';

    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'photo_path',
        'description',
        'provider_id',
        'status',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
