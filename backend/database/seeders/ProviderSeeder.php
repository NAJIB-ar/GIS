<?php

namespace Database\Seeders;

use App\Models\Provider;
use Illuminate\Database\Seeder;

class ProviderSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            ['name' => 'Telkom Indonesia', 'contact_email' => 'cs@telkom.co.id', 'color_code' => '#E31937'],
            ['name' => 'ICON+', 'contact_email' => 'info@iconpln.co.id', 'color_code' => '#0066CC'],
            ['name' => 'Biznet', 'contact_email' => 'info@biznetnetworks.com', 'color_code' => '#00A859'],
            ['name' => 'Indosat Ooredoo', 'contact_email' => 'cs@indosatooredoo.com', 'color_code' => '#FFC107'],
            ['name' => 'XL Axiata', 'contact_email' => 'cs@xl.co.id', 'color_code' => '#00529B'],
            ['name' => 'First Media', 'contact_email' => 'cs@firstmedia.com', 'color_code' => '#FF6600'],
            ['name' => 'MNC Play', 'contact_email' => 'cs@mncplay.id', 'color_code' => '#8B0000'],
            ['name' => 'Tidak Diketahui', 'contact_email' => null, 'color_code' => '#808080'],
        ];

        foreach ($providers as $provider) {
            Provider::create($provider);
        }
    }
}
