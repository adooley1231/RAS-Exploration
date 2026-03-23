# Deploy to Netlify

This app is configured via **`netlify.toml`** (build: `npm run build`, publish: **`dist`**).

## Option A — Git (recommended)

1. Push this project to GitHub/GitLab/Bitbucket (this folder can be the repo root, or use a monorepo).
2. In [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Pick the repo. If the repo root is **above** this folder, set:
   - **Base directory:** `.worktrees/er-brand-redesign` (or move/copy this folder to be the repo root).
4. Netlify should auto-detect `netlify.toml`. Build command and publish directory are already set.
5. Deploy.

## Option B — Netlify CLI (no Git)

From **this directory** (`er-brand-redesign`):

```bash
npm install
npm run build
npx netlify deploy --prod --dir=dist
```

First time, the CLI will log you in and can link a site.

## Option C — Drag & drop

```bash
npm run build
```

Then in Netlify → **Sites** → **Add new site** → **Deploy manually**, and upload the **`dist`** folder.

---

**Note:** If the site loads but assets 404, check that **Publish directory** is exactly `dist` and the build completed without errors.
