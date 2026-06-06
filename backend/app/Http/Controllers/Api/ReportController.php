<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportStatusRequest;
use App\Repositories\Interfaces\ReportRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function __construct(
        protected ReportRepositoryInterface $reportRepository
    ) {}

    /**
     * List all reports with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'provider_id', 'date_from', 'date_to', 'user_id']);
        $reports = $this->reportRepository->getAll($filters);

        return response()->json([
            'reports' => $reports,
            'total' => $reports->count(),
        ]);
    }

    /**
     * Store a new cable report with photo upload.
     */
    public function store(StoreReportRequest $request): JsonResponse
    {
        $photoPath = $request->file('photo')->store('reports', 'public');

        $report = $this->reportRepository->create([
            'user_id' => $request->user()->id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'photo_path' => $photoPath,
            'description' => $request->description,
            'provider_id' => $request->provider_id,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'report' => $report->load(['user:id,name,email', 'provider:id,name,color_code']),
        ], 201);
    }

    /**
     * Show a single report.
     */
    public function show(int $id): JsonResponse
    {
        $report = $this->reportRepository->getById($id);

        return response()->json([
            'report' => $report,
        ]);
    }

    /**
     * Update report status (admin only).
     */
    public function updateStatus(UpdateReportStatusRequest $request, int $id): JsonResponse
    {
        $report = $this->reportRepository->updateStatus($id, $request->status);

        return response()->json([
            'message' => 'Status laporan berhasil diperbarui.',
            'report' => $report,
        ]);
    }

    /**
     * Delete a report (admin only).
     */
    public function destroy(int $id): JsonResponse
    {
        $report = $this->reportRepository->getById($id);

        // Delete the associated photo
        if ($report->photo_path) {
            Storage::disk('public')->delete($report->photo_path);
        }

        $this->reportRepository->delete($id);

        return response()->json([
            'message' => 'Laporan berhasil dihapus.',
        ]);
    }
}
