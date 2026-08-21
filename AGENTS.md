# Fantastic Mr Fox

A single-page browser game built with Phaser 3 + Vite + TypeScript. There is no
backend; everything runs client-side and progress is saved to `localStorage`
(`fantastic-mr-fox-save`).

## Cursor Cloud specific instructions

Standard commands live in `package.json` and `README.md`; use those as the
source of truth. Notes below are only the non-obvious bits.

- Single service: the Vite dev server (`npm run dev`), served on port `5173`
  (`vite.config.ts` sets `host: true`, so it binds `0.0.0.0`). There is no
  API/database to start.
- Type checking and linting: this repo has no ESLint/Prettier config. The
  effective static check is the TypeScript compiler, run via `npm run build`
  (`tsc --noEmit && vite build`). `tsconfig.json` enables `strict`,
  `noUnusedLocals`, and `noUnusedParameters`, so unused vars fail the build.
  There is no separate `lint` script and there are no automated tests.
- To exercise the game you must start a New Game from the menu and advance the
  intro storybook with `Space`/`Enter`/click before you reach a playable scene.
  In-game controls: move with Arrows/WASD, `Shift` to sneak, `E` to
  take/talk/send food home, `Space`/`D` to dig, `[` `]` / `1`–`9` to switch
  character.
- `localStorage` persistence means a prior save changes the menu (adds
  `Continue`, and `Farmer Mode` after the ending). For a clean first-run state,
  clear `localStorage` or use a fresh browser profile.
