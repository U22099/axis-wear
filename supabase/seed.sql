-- Step 1: Upsert all products first
INSERT INTO products (
        name,
        slug,
        description,
        price,
        image_url,
        category,
        tags
    )
VALUES (
        'TECHNICAL SHELL // 01',
        'technical-shell-01',
        'High-performance urban technical jacket constructed with 3-layer laminated waterproof fabric, taped seams, and a modular strap suspension system.',
        240.00,
        '/images/product-shell.jpg',
        'Outerwear',
        ARRAY ['waterproof', 'modular', 'shell']
    ),
    (
        'MODULAR DOWN // 02',
        'modular-down-02',
        'Premium 800-fill down insulation parka. Features modular sleeves and adjustable hoods for high heat retention in sub-zero urban settings.',
        310.00,
        '/images/product-down.jpg',
        'Outerwear',
        ARRAY ['insulation', 'down', 'modular']
    ),
    (
        'TACTICAL ANORAK // 03',
        'tactical-anorak-03',
        'Packable lightweight ripstop nylon windbreaker with dynamic asymmetrical zipper styling, a utility kangaroo pouch, and an adjustable tactical hood.',
        180.00,
        '/images/product-anorak.jpg',
        'Outerwear',
        ARRAY ['ripstop', 'windbreaker', 'packable']
    ),
    (
        'STEALTH UTILITY VEST // 04',
        'stealth-utility-vest-04',
        'Industrial modular utility vest engineered with tactical webbing, multiple secure quick-access pockets, and high-tenacity canvas paneling.',
        150.00,
        '/images/product-vest.jpg',
        'Core',
        ARRAY ['vest', 'utility', 'tactical']
    ),
    (
        'CARGO COMBAT PANTS // 05',
        'cargo-combat-pants-05',
        'Heavy-duty ripstop trousers featuring reinforced knees, multiple 3D cargo pockets, and adjustable cuff straps for active mobility.',
        120.00,
        '/images/product-shell.jpg',
        'Core',
        ARRAY ['cargo', 'pants', 'utility']
    ),
    (
        'THERMAL BASELAYER // 06',
        'thermal-baselayer-06',
        'Skin-tight thermal baselayer top knitted with moisture-wicking merino wool blend to retain body warmth in freezing parameters.',
        80.00,
        '/images/product-anorak.jpg',
        'Core',
        ARRAY ['baselayer', 'thermal', 'fit']
    ),
    (
        'WATERPROOF TECH CAP // 07',
        'waterproof-tech-cap-07',
        'Laser-vented 5-panel headwear constructed with lightweight water-resistant tech nylon and an adjustable quick-release buckle.',
        45.00,
        '/images/product-vest.jpg',
        'Core',
        ARRAY ['cap', 'waterproof', 'accessories']
    ),
    (
        'FLEECE MIDLAYER HOOD // 08',
        'fleece-midlayer-hood-08',
        'Grid-structured polar fleece hoodie providing optimal warmth-to-weight ratio with thumbhole cuffs and integrated wind-guard face mask.',
        130.00,
        '/images/product-down.jpg',
        'Outerwear',
        ARRAY ['fleece', 'midlayer', 'hoodie']
    ),
    (
        'MODULAR TECH BACKPACK // 09',
        'modular-tech-backpack-09',
        'Water-resistant 30L rolltop backpack with external MOLLE webbing, padded laptop sleeve, and modular compression harnesses.',
        160.00,
        '/images/product-shell.jpg',
        'Core',
        ARRAY ['backpack', 'bag', 'modular']
    ),
    (
        'HYBRID CARGO SHORTS // 10',
        'hybrid-cargo-shorts-10',
        'Water-repellent technical stretch cargo shorts with integrated webbing belt and secure zip pockets for summer operations.',
        95.00,
        '/images/product-anorak.jpg',
        'Core',
        ARRAY ['shorts', 'cargo', 'hybrid']
    ),
    (
        'WINDPROOF BALACLAVA // 11',
        'windproof-balaclava-11',
        'Ergonomic face shield built with windproof panels, breathable mouth grids, and flatlock seams for winter helmet compatibility.',
        35.00,
        '/images/product-vest.jpg',
        'Core',
        ARRAY ['balaclava', 'accessories', 'windproof']
    ),
    (
        'SHIELD TRENCH COAT // 12',
        'shield-trench-coat-12',
        'Long-line modern trench coat tailored from double-weave technical canvas, featuring dynamic double-breasted zippers and back storm vents.',
        280.00,
        '/images/product-shell.jpg',
        'Outerwear',
        ARRAY ['trench', 'shield', 'outerwear']
    ),
    (
        'HEAVYWEIGHT LOGO HOODIE // 13',
        'heavyweight-logo-hoodie-13',
        'Ultra-dense 500gsm brushed cotton hoodie with oversized structural fit, drop shoulders, and embroidered industrial branding.',
        110.00,
        '/images/product-down.jpg',
        'Core',
        ARRAY ['hoodie', 'heavyweight', 'logo']
    ),
    (
        'OVERSIZED UTILITY TEE // 14',
        'oversized-utility-tee-14',
        'Premium heavyweight cotton mock neck t-shirt featuring reinforced side slits and a modular mesh zipper chest pocket.',
        60.00,
        '/images/product-anorak.jpg',
        'Core',
        ARRAY ['tee', 'oversized', 'utility']
    ),
    (
        'GRID FLEECE JOGGERS // 15',
        'grid-fleece-joggers-15',
        'Tech fleece sweatpants with tapered fit, elongated zipper side pockets, and durable water-resistant panel wraps on shins.',
        105.00,
        '/images/product-shell.jpg',
        'Core',
        ARRAY ['joggers', 'fleece', 'grid']
    ),
    (
        'GORE-TEX RAIN SHELL // 16',
        'gore-tex-rain-shell-16',
        'Lightweight packable emergency shell made with premium GORE-TEX membrane, offering unmatched storm protection and breathability.',
        260.00,
        '/images/product-anorak.jpg',
        'Outerwear',
        ARRAY ['goretex', 'shell', 'waterproof']
    ),
    (
        'COMPRESSION PANTS // 17',
        'compression-pants-17',
        'High-elastic active tights designed to support major muscle groups, featuring flatlock anti-chafing seams and phone slip pocket.',
        75.00,
        '/images/product-vest.jpg',
        'Core',
        ARRAY ['compression', 'pants', 'training']
    ),
    (
        'REFLECTIVE JACKET // 18',
        'reflective-jacket-18',
        'Night-operation running shell featuring high-visibility glass-bead reflective coating that glows stark white under direct light sources.',
        170.00,
        '/images/product-shell.jpg',
        'Outerwear',
        ARRAY ['reflective', 'jacket', 'night']
    ),
    (
        'INSULATED VEST // 19',
        'insulated-vest-19',
        'Sleeveless insulating layer stuffed with sustainable Primaloft fill, built with windproof shell and fleece-lined zip pockets.',
        140.00,
        '/images/product-down.jpg',
        'Outerwear',
        ARRAY ['insulated', 'vest', 'warmth']
    ),
    (
        'TACTILE GEAR GLOVES // 20',
        'tactile-gear-gloves-20',
        'Reinforced utility gloves with touchscreen-compatible fingertips, silicone grip palms, and adjustable velcro neoprene cuffs.',
        50.00,
        '/images/product-vest.jpg',
        'Core',
        ARRAY ['gloves', 'gear', 'tactical']
    ) ON CONFLICT (slug) DO
UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags;
-- Step 2: Now map variants safely based on existing products in the DB
WITH product_sizes AS (
    SELECT p.id AS product_id,
        p.slug,
        sz.size,
        sz.index
    FROM products p
        CROSS JOIN LATERAL (
            SELECT size,
                idx AS index
            FROM unnest(ARRAY ['S', 'M', 'L', 'XL']) WITH ORDINALITY AS u(size, idx)
        ) AS sz
)
INSERT INTO product_variants (product_id, size, stock, sku)
SELECT product_id,
    size,
    floor(random() * 12 + 2)::int AS stock,
    'AW-' || product_id::text || '-' || size || '-' || index AS sku
FROM product_sizes ON CONFLICT (sku) DO
UPDATE
SET stock = EXCLUDED.stock;