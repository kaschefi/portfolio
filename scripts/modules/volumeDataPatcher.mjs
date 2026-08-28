// scripts/modules/volumeDataPatcher.mjs
// Patches the embedded volume data inside bookshelfRenderer.js so that
// e.title, e.discipline, etc. reflect the values in portfolioData.ts.
// The renderer bundles its own copy of the data — this keeps them in sync.

const VOLUME_OVERRIDES = [
  {
    id: 'figma',
    title: 'Sawyer Robot',
    discipline: 'Shell Game',
  },
  {
    id: 'cursor',
    title: 'Semantic-ETL-Pipeline',
    discipline: 'Directed editing',
  },
  {
    id: 'xcode',
    title: 'JoinApp',
    discipline: 'Full-Stack Web Systems',
    color: '#6830D1'
  },
  {
    id: 'claude-code',
    title: 'Cat-breed-recognition',
    discipline: 'Vision & Deep Learning',
    binding: 'Phthalo-green cloth · gold foil',
    paletteLabel: 'Phthalo green · gold · emerald',
    color: '#123524',
    foil: '#efc16d',
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
  }
];

export function applyVolumeDataPatches(code) {
  for (const override of VOLUME_OVERRIDES) {
    // Patch title: "OldTitle" -> "NewTitle" scoped near the id field
    if (override.title) {
      code = code.replace(
        new RegExp(
          `(id:\\s*"${override.id}"[\\s\\S]{0,300}?title:\\s*)"([^"]+)"`,
          ''
        ),
        `$1"${override.title}"`
      );
    }

    // Patch discipline field near the same id block
    if (override.discipline) {
      code = code.replace(
        new RegExp(
          `(id:\\s*"${override.id}"[\\s\\S]{0,500}?discipline:\\s*)"([^"]+)"`,
          ''
        ),
        `$1"${override.discipline}"`
      );
    }

    // Patch binding field near the same id block
    if (override.binding) {
      code = code.replace(
        new RegExp(
          `(id:\\s*"${override.id}"[\\s\\S]{0,800}?binding:\\s*)"([^"]+)"`,
          ''
        ),
        `$1"${override.binding}"`
      );
    }

    // Patch paletteLabel field near the same id block
    if (override.paletteLabel) {
      code = code.replace(
        new RegExp(
          `(id:\\s*"${override.id}"[\\s\\S]{0,900}?paletteLabel:\\s*)"([^"]+)"`,
          ''
        ),
        `$1"${override.paletteLabel}"`
      );
    }

    // Patch color field near the same id block
    if (override.color) {
      code = code.replace(
        new RegExp(
          `(id:\\s*"${override.id}"[\\s\\S]{0,1000}?color:\\s*)"([^"]+)"`,
          ''
        ),
        `$1"${override.color}"`
      );
    }

    // Patch foil field near the same id block
    if (override.foil) {
      code = code.replace(
        new RegExp(
          `(id:\\s*"${override.id}"[\\s\\S]{0,1100}?foil:\\s*)"([^"]+)"`,
          ''
        ),
        `$1"${override.foil}"`
      );
    }

    // Patch palette fields near the same id block
    if (override.palette) {
      for (const [key, val] of Object.entries(override.palette)) {
        code = code.replace(
          new RegExp(
            `(id:\\s*"${override.id}"[\\s\\S]{0,1400}?${key}:\\s*)"([^"]+)"`,
            ''
          ),
          `$1"${val}"`
        );
      }
    }
  }

  return code;
}
