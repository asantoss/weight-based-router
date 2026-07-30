# Weighted Round-Robin Demo

A small React + TypeScript demo that visually explains **smooth weighted round-robin scoring**
for record assignment: agents with higher weights accumulate score faster and receive a larger
share of assignments over time, while lower-weight agents still get a fair, evenly spaced share.

Built with React, TypeScript, Vite, Tailwind CSS, and [shadcn/ui](https://ui.shadcn.com/) — no
backend, no database, no external state-management library.

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173/weight-based-router/`).

## Building

```bash
npm run build
npm run preview
```

## How it works

Every time an assignment runs:

1. Every online agent adds its weight to its running score.
2. The agent with the highest score wins the assignment (ties break on the agent that has gone
   longest without a win, then on original list order).
3. The total weight of all online agents is subtracted from the winner's score.
4. Scores carry forward into the next round — nothing resets between assignments.

Over many rounds, each agent's actual share of assignments converges to
`agent.weight / totalWeight`. The demo lets you add or remove agents, edit weights live, and
toggle agents online/offline to see the distribution adapt in real time.

The core algorithm lives in [`src/scoring.ts`](src/scoring.ts) as a single pure function,
`runWeightedRound`, decoupled from all UI/animation code.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
that builds the app and publishes it to GitHub Pages on every push to `main`.

One-time setup on GitHub:

1. Go to the repo's **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The site will be published at:

```text
https://<your-github-username>.github.io/weight-based-router/
```

`vite.config.ts` sets `base: "/weight-based-router/"` to match this project-page URL. If you fork
or rename the repository, update that `base` value (and the URL above) to match the new repo name.

## React Compiler

The React Compiler is enabled on this template. See
[this documentation](https://react.dev/learn/react-compiler) for more information.
