<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'photo' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // 5MB
            'description' => ['nullable', 'string', 'max:2000'],
            'provider_id' => ['nullable', 'exists:providers,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'photo.max' => 'Ukuran foto maksimal 5MB.',
            'photo.image' => 'File harus berupa gambar.',
            'latitude.between' => 'Latitude harus antara -90 dan 90.',
            'longitude.between' => 'Longitude harus antara -180 dan 180.',
        ];
    }
}
