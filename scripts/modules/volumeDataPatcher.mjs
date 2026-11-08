// scripts/modules/volumeDataPatcher.mjs
// Dynamically patches embedded volume data inside bookshelfRenderer.js so that
// e.title, e.discipline, e.note, e.deck, e.color, e.palette, etc. stay in sync.

import fs from 'fs';
import path from 'path';

const DEFAULT_VISUALS = {
  'claude-code': {
    color: '#123524',
    foil: '#efc16d',
    paletteLabel: 'Phthalo green · gold · emerald',
    palette: {
      paper: '#123524',
      paperDeep: '#091c13',
      paperPale: '#e6f4ed',
      ink: '#f2faf6',
      inkSoft: '#a3cfbb',
      wall: '#123524',
      shelf: '#3a2016',
      shelfDark: '#1c0d08',
      light: '#82bca2',
      fill: '#0e2e20'
    }
  },
  'xcode': {
    color: '#6830D1',
    foil: '#a3e635',
    paletteLabel: 'Violet · electric lime · slate',
    palette: {
      paper: '#1a0b36',
      paperDeep: '#100624',
      paperPale: '#f3f4f6',
      ink: '#ffffff',
      inkSoft: '#a78bfa',
      wall: '#1a0b36',
      shelf: '#382017',
      shelfDark: '#1b0e09',
      light: '#f3f4f6',
      fill: '#6830D1'
    }
  }
};

export function applyVolumeDataPatches(code) {
  const volumesDir = path.resolve('src/content/volumes');
  if (!fs.existsSync(volumesDir)) {
    return code;
  }

  const files = fs.readdirSync(volumesDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    try {
      const vol = JSON.parse(fs.readFileSync(path.join(volumesDir, file), 'utf8'));
      if (!vol || !vol.id) continue;

      const defaultVisual = DEFAULT_VISUALS[vol.id] || {};

      // Patch title: "OldTitle" -> "NewTitle" scoped near the id field
      if (vol.title) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,300}?title:\\s*)"([^"]+)"`),
          `$1"${vol.title}"`
        );
      }

      // Patch discipline
      if (vol.discipline) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,500}?discipline:\\s*)"([^"]+)"`),
          `$1"${vol.discipline}"`
        );
      }

      // Patch note
      if (vol.note) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,700}?note:\\s*)"([^"]+)"`),
          `$1"${vol.note.replace(/"/g, '\\"')}"`
        );
      }

      // Patch deck
      if (vol.deck) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,1000}?deck:\\s*)"([^"]+)"`),
          `$1"${vol.deck.replace(/"/g, '\\"')}"`
        );
      }

      // Patch binding
      if (vol.binding) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,800}?binding:\\s*)"([^"]+)"`),
          `$1"${vol.binding}"`
        );
      }

      // Patch paletteLabel
      const paletteLabel = vol.paletteLabel || defaultVisual.paletteLabel;
      if (paletteLabel) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,900}?paletteLabel:\\s*)"([^"]+)"`),
          `$1"${paletteLabel}"`
        );
      }

      // Patch color
      const color = vol.color || defaultVisual.color;
      if (color) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,1000}?color:\\s*)"([^"]+)"`),
          `$1"${color}"`
        );
      }

      // Patch foil
      const foil = vol.foil || defaultVisual.foil;
      if (foil) {
        code = code.replace(
          new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,1100}?foil:\\s*)"([^"]+)"`),
          `$1"${foil}"`
        );
      }

      // Patch palette fields
      const palette = vol.palette || defaultVisual.palette;
      if (palette) {
        for (const [key, val] of Object.entries(palette)) {
          code = code.replace(
            new RegExp(`(id:\\s*"${vol.id}"[\\s\\S]{0,1400}?${key}:\\s*)"([^"]+)"`),
            `$1"${val}"`
          );
        }
      }
    } catch (e) {
      console.warn(`[volumeDataPatcher] Failed to read ${file}:`, e);
    }
  }

  return code;
}
