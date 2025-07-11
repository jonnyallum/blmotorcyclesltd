// B&L Motorcycles Ltd - Mock Data for Local Testing
// This simulates the data that would come from Supabase

export const mockCategories = [
  {
    id: 1,
    name: "Brakes & ABS",
    slug: "brakes-abs",
    description: "Brake pads, discs, calipers, and ABS components",
    is_active: true,
    sort_order: 1
  },
  {
    id: 2,
    name: "Engine & Performance",
    slug: "engine-performance",
    description: "Engine parts, performance upgrades, and tuning components",
    is_active: true,
    sort_order: 2
  },
  {
    id: 3,
    name: "Electrical & Lighting",
    slug: "electrical-lighting",
    description: "Lights, batteries, wiring, and electrical components",
    is_active: true,
    sort_order: 3
  },
  {
    id: 4,
    name: "Suspension & Steering",
    slug: "suspension-steering",
    description: "Shocks, forks, steering components, and suspension parts",
    is_active: true,
    sort_order: 4
  },
  {
    id: 5,
    name: "Wheels & Tyres",
    slug: "wheels-tyres",
    description: "Wheels, tyres, tubes, and wheel accessories",
    is_active: true,
    sort_order: 5
  },
  {
    id: 6,
    name: "Body & Fairings",
    slug: "body-fairings",
    description: "Fairings, body panels, mirrors, and styling components",
    is_active: true,
    sort_order: 6
  },
  {
    id: 7,
    name: "Tools & Maintenance",
    slug: "tools-maintenance",
    description: "Tools, oils, fluids, and maintenance supplies",
    is_active: true,
    sort_order: 7
  },
  {
    id: 8,
    name: "Security & Locks",
    slug: "security-locks",
    description: "Locks, alarms, chains, and security equipment",
    is_active: true,
    sort_order: 8
  }
]

export const mockProducts = [
  {
    id: 1,
    name: "EBC Brake Pads - FA174HH",
    slug: "ebc-brake-pads-fa174hh",
    short_description: "High-performance sintered brake pads for sport bikes",
    long_description: "EBC FA174HH brake pads offer exceptional stopping power and durability. Made from sintered copper alloy for maximum performance in all weather conditions.",
    sku: "EBC-FA174HH",
    brand: "EBC",
    category_id: 1,
    cost_price: 35.00,
    base_price: 52.50,
    retail_price: 52.50,
    sale_price: null,
    is_active: true,
    is_featured: true,
    weight: 0.3,
    dimensions: "120x80x10mm",
    tags: ["brake", "pads", "sport", "performance"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 1,
      name: "Brakes & ABS",
      slug: "brakes-abs"
    },
    inventory: [{
      quantity_available: 15
    }],
    final_price: 52.50,
    delivery_cost: 6.00,
    total_price: 58.50,
    in_stock: true,
    stock_level: 15
  },
  {
    id: 2,
    name: "Akrapovic Exhaust System",
    slug: "akrapovic-exhaust-system",
    short_description: "Premium titanium exhaust system for enhanced performance",
    long_description: "Akrapovic titanium exhaust system delivers superior performance, weight reduction, and that distinctive Akrapovic sound.",
    sku: "AKR-S-Y10SO7-HAPT",
    brand: "Akrapovic",
    category_id: 2,
    cost_price: 890.00,
    base_price: 1335.00,
    retail_price: 1335.00,
    sale_price: 1199.00,
    is_active: true,
    is_featured: true,
    weight: 3.2,
    dimensions: "800x200x150mm",
    tags: ["exhaust", "titanium", "performance", "akrapovic"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 2,
      name: "Engine & Performance",
      slug: "engine-performance"
    },
    inventory: [{
      quantity_available: 3
    }],
    final_price: 1199.00,
    delivery_cost: 6.00,
    total_price: 1205.00,
    in_stock: true,
    stock_level: 3
  },
  {
    id: 3,
    name: "Philips LED Headlight H4",
    slug: "philips-led-headlight-h4",
    short_description: "Ultra-bright LED headlight bulb with 6000K color temperature",
    long_description: "Philips LED headlight provides 200% more light than standard halogen bulbs with a crisp white 6000K light.",
    sku: "PHI-H4-LED-6000K",
    brand: "Philips",
    category_id: 3,
    cost_price: 23.33,
    base_price: 35.00,
    retail_price: 35.00,
    sale_price: null,
    is_active: true,
    is_featured: true,
    weight: 0.1,
    dimensions: "80x40x40mm",
    tags: ["led", "headlight", "h4", "6000k"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 3,
      name: "Electrical & Lighting",
      slug: "electrical-lighting"
    },
    inventory: [{
      quantity_available: 25
    }],
    final_price: 35.00,
    delivery_cost: 6.00,
    total_price: 41.00,
    in_stock: true,
    stock_level: 25
  },
  {
    id: 4,
    name: "Ohlins Rear Shock TTX GP",
    slug: "ohlins-rear-shock-ttx-gp",
    short_description: "Professional-grade rear shock absorber for track use",
    long_description: "Ohlins TTX GP rear shock offers unmatched performance and adjustability for serious riders and racers.",
    sku: "OHL-TTX-GP-320",
    brand: "Ohlins",
    category_id: 4,
    cost_price: 1200.00,
    base_price: 1800.00,
    retail_price: 1800.00,
    sale_price: null,
    is_active: true,
    is_featured: true,
    weight: 2.1,
    dimensions: "320x60x60mm",
    tags: ["shock", "ohlins", "ttx", "track", "racing"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 4,
      name: "Suspension & Steering",
      slug: "suspension-steering"
    },
    inventory: [{
      quantity_available: 2
    }],
    final_price: 1800.00,
    delivery_cost: 6.00,
    total_price: 1806.00,
    in_stock: true,
    stock_level: 2
  },
  {
    id: 5,
    name: "Pirelli Diablo Rosso IV",
    slug: "pirelli-diablo-rosso-iv",
    short_description: "High-performance sport touring tyre - 120/70 ZR17",
    long_description: "Pirelli Diablo Rosso IV offers exceptional grip and longevity for sport touring applications.",
    sku: "PIR-DR4-120-70-17",
    brand: "Pirelli",
    category_id: 5,
    cost_price: 133.33,
    base_price: 200.00,
    retail_price: 200.00,
    sale_price: 179.00,
    is_active: true,
    is_featured: false,
    weight: 4.2,
    dimensions: "600x120x600mm",
    tags: ["tyre", "pirelli", "sport", "touring"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 5,
      name: "Wheels & Tyres",
      slug: "wheels-tyres"
    },
    inventory: [{
      quantity_available: 8
    }],
    final_price: 179.00,
    delivery_cost: 6.00,
    total_price: 185.00,
    in_stock: true,
    stock_level: 8
  },
  {
    id: 6,
    name: "Puig Windscreen Racing",
    slug: "puig-windscreen-racing",
    short_description: "Aerodynamic racing windscreen for improved performance",
    long_description: "Puig racing windscreen reduces wind resistance and improves aerodynamics for track and street use.",
    sku: "PUIG-WS-RACING-CLEAR",
    brand: "Puig",
    category_id: 6,
    cost_price: 66.67,
    base_price: 100.00,
    retail_price: 100.00,
    sale_price: null,
    is_active: true,
    is_featured: false,
    weight: 0.8,
    dimensions: "400x300x5mm",
    tags: ["windscreen", "puig", "racing", "aerodynamic"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 6,
      name: "Body & Fairings",
      slug: "body-fairings"
    },
    inventory: [{
      quantity_available: 12
    }],
    final_price: 100.00,
    delivery_cost: 6.00,
    total_price: 106.00,
    in_stock: true,
    stock_level: 12
  },
  {
    id: 7,
    name: "Motul 7100 Engine Oil 10W-40",
    slug: "motul-7100-engine-oil-10w40",
    short_description: "Premium synthetic motorcycle engine oil - 4L",
    long_description: "Motul 7100 is a 100% synthetic lubricant designed for high-performance 4-stroke motorcycle engines.",
    sku: "MOT-7100-10W40-4L",
    brand: "Motul",
    category_id: 7,
    cost_price: 33.33,
    base_price: 50.00,
    retail_price: 50.00,
    sale_price: 45.00,
    is_active: true,
    is_featured: false,
    weight: 4.0,
    dimensions: "250x150x300mm",
    tags: ["oil", "motul", "synthetic", "10w40"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 7,
      name: "Tools & Maintenance",
      slug: "tools-maintenance"
    },
    inventory: [{
      quantity_available: 20
    }],
    final_price: 45.00,
    delivery_cost: 6.00,
    total_price: 51.00,
    in_stock: true,
    stock_level: 20
  },
  {
    id: 8,
    name: "Abus Granit X-Plus 540",
    slug: "abus-granit-x-plus-540",
    short_description: "Ultra-secure motorcycle disc lock with alarm",
    long_description: "Abus Granit X-Plus 540 offers maximum security with hardened steel construction and 100dB alarm.",
    sku: "ABUS-GRANIT-XP540",
    brand: "Abus",
    category_id: 8,
    cost_price: 100.00,
    base_price: 150.00,
    retail_price: 150.00,
    sale_price: null,
    is_active: true,
    is_featured: false,
    weight: 1.5,
    dimensions: "120x80x50mm",
    tags: ["lock", "abus", "disc", "alarm", "security"],
    created_at: "2025-01-01T00:00:00Z",
    category: {
      id: 8,
      name: "Security & Locks",
      slug: "security-locks"
    },
    inventory: [{
      quantity_available: 6
    }],
    final_price: 150.00,
    delivery_cost: 6.00,
    total_price: 156.00,
    in_stock: true,
    stock_level: 6
  }
]

