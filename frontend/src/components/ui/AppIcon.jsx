// ============================================================
// AppIcon.jsx
// Taruh di: frontend/src/components/ui/AppIcon.jsx
//
// Wrapper tipis untuk lucide-react agar ukuran & warna
// ikon konsisten di seluruh aplikasi.
//
// Install dulu:  npm install lucide-react
// ============================================================

import * as LucideIcons from 'lucide-react';

/**
 * @param {string}  name       - Nama ikon dari lucide-react, PascalCase. Contoh: "Home", "Ticket"
 * @param {number}  size       - Override ukuran (px). Default ikuti prop `variant`.
 * @param {string}  color      - Override warna CSS. Default "currentColor" (ikut parent).
 * @param {string}  variant    - 'xs'|'sm'|'md'|'lg'|'xl'. Default 'md' (18px).
 * @param {string}  className  - Tambahan class Tailwind / CSS.
 */
export default function AppIcon({ name, size, color = 'currentColor', variant = 'md', className = '', ...rest }) {
  const Icon = LucideIcons[name];

  if (!Icon) {
    // Fallback: kotak kecil supaya UI tidak crash
    console.warn(`[AppIcon] ikon "${name}" tidak ditemukan di lucide-react`);
    return <span style={{ display: 'inline-block', width: resolveSize(variant, size), height: resolveSize(variant, size) }} />;
  }

  return (
    <Icon
      size={resolveSize(variant, size)}
      color={color}
      className={className}
      strokeWidth={1.8}
      {...rest}
    />
  );
}

function resolveSize(variant, override) {
  if (override) return override;
  const map = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };
  return map[variant] ?? 18;
}