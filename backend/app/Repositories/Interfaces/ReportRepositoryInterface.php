<?php

namespace App\Repositories\Interfaces;

interface ReportRepositoryInterface
{
    public function getAll(array $filters = []);
    public function getById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function updateStatus(int $id, string $status);
    public function delete(int $id);
}
