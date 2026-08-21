# Fantastic Mr Fox

A short browser game of Roald Dahl’s *Fantastic Mr Fox* — the **book**, not the Wes Anderson film.

It is a personal fan project: original code, original narration in Dahl’s spirit, and Quentin Blake–**inspired** ink-and-wash art (scratchy outlines, watercolor blobs, elongated figures). It does not copy Blake’s drawings or quote the novel. Not for commercial release.

## How to run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build     # production bundle
npm run preview   # serve the built game
```

## How to play

- **Move** Arrows or WASD
- **Sneak** Hold Shift
- **Take / talk / send food home** E
- **Dig** Space or D
- **Switch** `[` `]` or `1`–`9` (only characters you have met)

Never take too much from one farm. The three farmers wait at the hole during the later raids — the danger there is noise and falling earth, not a boss fight.

Progress is saved in `localStorage` (`fantastic-mr-fox-save`). **Continue** on the menu resumes the current chapter. After the ending, **Farmer Mode** unlocks.

## Chapters

1. **The Three Farmers / Mr Fox** — night stealth across Boggis, Bunce, and Bean. Steal a little from each, then go home.
2. **The Shooting** — ambush at the hole; the tail stays behind; the family pulls him down.
3. **The Terrible Shovels** — the hill is eaten. Surface is death. Dig. The Smallest Fox unlocks when the earth pinches.
4. **Starvation / the plan** — find Badger, Mole, Rabbit, and Weasel. Each meeting unlocks them. Mrs Fox is already in the den after the shooting.
5. **Three raids** — Chicken House Number One, Bunce’s storehouse, Bean’s secret cider cellar. Storybook openings, then environmental heists.
6. **The feast** — play the Smallest Fox; fetch every family; sit in the carved hall.
7. **Still waiting** — cut up to the farmers and their guns.
8. **Farmer Mode** — Boggis, Bunce, or Bean, lanterns and slow boots. The foxes use tunnels the farmers do not know. It is meant to feel unfair.

## Book characters only

Mr Fox, Mrs Fox, the four Small Foxes, Badger, Mole, Rabbit, Weasel, and the farmers Boggis (chickens), Bunce (ducks and geese), Bean (turkeys and cider).

No film-only people, sports, or Wes Anderson styling.
