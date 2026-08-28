// scripts/modules/volumeDataPatcher.mjs
// Patches the embedded volume data inside bookshelfRenderer.js so that
// e.title, e.discipline, etc. reflect the values in portfolioData.ts.
// The renderer bundles its own copy of the data — this keeps them in sync.

const VOLUME_OVERRIDES = [
  {
    id: 'figma',
    title: 'Shell Game',
    discipline: 'Sawyer Robot',
  },
];

export function applyVolumeDataPatches(code) {
  for (const override of VOLUME_OVERRIDES) {
    // Patch title: "OldTitle" -> "NewTitle" scoped near the id field
    // Uses a pattern that matches the title field following the id field
    code = code.replace(
      new RegExp(
        `(id:\\s*"${override.id}"[\\s\\S]{0,200}?title:\\s*)"([^"]+)"`,
        ''
      ),
      `$1"${override.title}"`
    );

    // Patch discipline field near the same id block
    code = code.replace(
      new RegExp(
        `(id:\\s*"${override.id}"[\\s\\S]{0,400}?discipline:\\s*)"([^"]+)"`,
        ''
      ),
      `$1"${override.discipline}"`
    );
  }

  return code;
}
