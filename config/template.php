<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-saas".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-saas'),

    'flavors' => array (
  'landing-saas' => 
  array (
    'label' => 'Karsa — SaaS',
    'brand_name' => 'Karsa',
    'brand_tagline' => 'Software untuk tim modern',
    'brand_initials' => 'KR',
    'accent' => '#0891b2',
    'category' => 'teknologi',
    'home' => 'landings.saas',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/saas',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
