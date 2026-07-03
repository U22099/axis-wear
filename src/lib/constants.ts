// AxisWear — Central Constants

export const CATEGORIES = ['All', 'Outerwear', 'Core'] as const;
export type Category = (typeof CATEGORIES)[number];

export const SIZES = ['All', 'S', 'M', 'L', 'XL'] as const;
export type Size = (typeof SIZES)[number];

export const MARQUEE_ITEMS = [
  'TECHNICAL SHELL',
  'MODULAR DOWN',
  'TACTICAL ANORAK',
  'UTILITY VEST',
  'GORE-TEX SHELL',
  'GRID FLEECE',
  'REFLECTIVE JACKET',
  'CARGO COMBAT',
  'INSULATED VEST',
  'HEAVYWEIGHT HOODIE',
] as const;

export const SPEC_DATA = [
  { label: 'Shell Material',  value: '3-Layer Technical Nylon',    sub: 'DWR Treated, 20K/20K Rated' },
  { label: 'Seam Sealing',    value: 'Fully Taped',               sub: 'Critical seams heat-welded' },
  { label: 'Insulation',      value: '650-Fill Down / PrimaLoft', sub: 'Hydrophobic treated' },
  { label: 'Zippers',         value: 'YKK AquaGuard',             sub: 'Water-resistant coil' },
  { label: 'Pockets',         value: '6–8 Pockets',               sub: 'Mesh, zippered, phone-compatible' },
  { label: 'Packability',     value: 'Packable to Stuff Sack',    sub: 'Fist-sized compression' },
] as const;

export const NAV_LINKS = [
  { label: '[ Collection ]', href: '/#catalog' },
  { label: '[ Tech Specs ]', href: '/#specs' },
  { label: '[ Checkout ]',   href: '/checkout' },
] as const;

export const FABRIC_SPECS = [
  { label: 'MATERIAL', value: '// Ripstop Cordura' },
  { label: 'ZIPLOCKS', value: '// YKK AquaGuard®' },
  { label: 'LINING',   value: '// Recycled Poly' },
  { label: 'CERT',     value: '// SHIELD-STD-04' },
] as const;
