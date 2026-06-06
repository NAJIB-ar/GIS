<?php

namespace App\Repositories;

use App\Models\Provider;
use App\Repositories\Interfaces\ProviderRepositoryInterface;

class ProviderRepository implements ProviderRepositoryInterface
{
    public function __construct(
        protected Provider $model
    ) {}

    public function getAll()
    {
        return $this->model->orderBy('name')->get();
    }

    public function getById(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $provider = $this->model->findOrFail($id);
        $provider->update($data);
        return $provider->fresh();
    }

    public function delete(int $id)
    {
        $provider = $this->model->findOrFail($id);
        return $provider->delete();
    }
}
