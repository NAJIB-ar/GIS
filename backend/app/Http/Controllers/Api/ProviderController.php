<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\ProviderRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function __construct(
        protected ProviderRepositoryInterface $providerRepository
    ) {}

    /**
     * List all providers.
     */
    public function index(): JsonResponse
    {
        $providers = $this->providerRepository->getAll();

        return response()->json([
            'providers' => $providers,
        ]);
    }

    /**
     * Store a new provider (admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'color_code' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $provider = $this->providerRepository->create($validated);

        return response()->json([
            'message' => 'Provider berhasil ditambahkan.',
            'provider' => $provider,
        ], 201);
    }

    /**
     * Update a provider (admin only).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'color_code' => ['sometimes', 'required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $provider = $this->providerRepository->update($id, $validated);

        return response()->json([
            'message' => 'Provider berhasil diperbarui.',
            'provider' => $provider,
        ]);
    }

    /**
     * Delete a provider (admin only).
     */
    public function destroy(int $id): JsonResponse
    {
        $this->providerRepository->delete($id);

        return response()->json([
            'message' => 'Provider berhasil dihapus.',
        ]);
    }
}
