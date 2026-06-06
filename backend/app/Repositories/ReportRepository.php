<?php

namespace App\Repositories;

use App\Models\Report;
use App\Repositories\Interfaces\ReportRepositoryInterface;

class ReportRepository implements ReportRepositoryInterface
{
    public function __construct(
        protected Report $model
    ) {}

    public function getAll(array $filters = [])
    {
        $query = $this->model->with(['user:id,name,email', 'provider:id,name,color_code']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['provider_id'])) {
            $query->where('provider_id', $filters['provider_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function getById(int $id)
    {
        return $this->model->with(['user:id,name,email', 'provider:id,name,color_code,contact_email'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $report = $this->model->findOrFail($id);
        $report->update($data);
        return $report->fresh();
    }

    public function updateStatus(int $id, string $status)
    {
        $report = $this->model->findOrFail($id);
        $report->update(['status' => $status]);
        return $report->fresh(['user:id,name,email', 'provider:id,name,color_code']);
    }

    public function delete(int $id)
    {
        $report = $this->model->findOrFail($id);
        return $report->delete();
    }
}
