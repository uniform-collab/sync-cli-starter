# Uniform Sync CLI Starter

This starter lets you sync content from a **source** Uniform project to a **target** Uniform project using the [Uniform CLI](https://docs.uniform.app/docs/dev-tools/cli).

It works by **pulling** the source project's entities into a local `uniform-data` folder, then **pushing** that folder into the target project.

## How it works

```
Source project ──(pull)──▶ ./uniform-data ──(push)──▶ Target project
```

The included scripts wrap the Uniform CLI:

| Script             | Command                                              | What it does                                                              |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------------------ |
| `npm run pull`     | `uniform sync pull`                                  | Downloads all entities into the local `uniform-data` dir                  |
| `npm run push`     | `uniform sync push`                                  | Uploads the local `uniform-data` dir to a project                        |
| `npm run pull:dev` | `uniform sync pull --config ./uniform.config.dev.ts` | Downloads only the dev subset of entities into `uniform-data`            |
| `npm run push:dev` | `uniform sync push --config ./uniform.config.dev.ts` | Uploads the dev subset from `uniform-data` to a project                  |

### Sync configurations

There are two config files that control which entities are synced.

[`uniform.config.ts`](./uniform.config.ts) is the default config (used by `pull`/`push`). It syncs everything except webhooks and policy documents:

```ts
module.exports = uniformConfig({
  preset: "all",
  disableEntities: ["webhook", "policyDocument"],
});
```

- `preset: "all"` syncs all supported entity types.
- `disableEntities` excludes specific entity types from the sync.

[`uniform.config.dev.ts`](./uniform.config.dev.ts) is a narrower config (used by `pull:dev`/`push:dev`). It starts from nothing and only syncs data types, components, and content types:

```ts
module.exports = uniformConfig({
  preset: "none",
  config: {
    serialization: {
      directory: "./uniform-data",
      entitiesConfig: {
        dataType: {},
        component: {},
        contentType: {},
      },
    },
  },
});
```

- `preset: "none"` starts with no entities enabled.
- `entitiesConfig` opts in only the listed entity types.

Use the `:dev` scripts when you want a faster, focused sync of just the schema-level entities (data types, components, content types) instead of the full project.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A Uniform account with access to both the source and target projects
- An API key for each project (created in the Uniform dashboard under **Settings → API Keys**). The key needs read permissions on the source and write permissions on the target.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Fill in the credentials. The CLI reads `UNIFORM_API_KEY` and `UNIFORM_PROJECT_ID` from `.env`:

```bash
UNIFORM_API_KEY=your-api-key
UNIFORM_PROJECT_ID=your-project-id
```

## Usage

The sync is a two-step process. Because the CLI uses a single set of credentials at a time, you point `.env` at the **source** to pull, then at the **target** to push.

### 1. Pull from the source project

Set `.env` to the **source** project's API key and project ID, then run:

```bash
npm run pull
```

This writes the source content into the local `uniform-data` directory.

> Tip: review the changes in `uniform-data` (e.g. with `git status`) before pushing.
>
> To sync only the dev subset (data types, components, content types), use `npm run pull:dev` instead.

### 2. Push to the target project

Update `.env` with the **target** project's API key and project ID, then run:

```bash
npm run push
```

This uploads everything in `uniform-data` to the target project.

> To push only the dev subset, use `npm run push:dev` instead. Pair it with `npm run pull:dev` so the local `uniform-data` only contains the dev entities.

## Notes

- The `uniform-data` directory is git-ignored by default (see [`.gitignore`](./.gitignore)). Remove it from `.gitignore` if you want to commit synced content to version control.
- Pushing **overwrites** matching entities in the target project. Always double-check you have the correct target `UNIFORM_PROJECT_ID` before running `npm run push` or `npm run push:dev`.
- To change which entities are synced, edit [`uniform.config.ts`](./uniform.config.ts) (full sync) or [`uniform.config.dev.ts`](./uniform.config.dev.ts) (dev subset).
- Keep your pull/push pairs consistent: use `pull` with `push`, and `pull:dev` with `push:dev`, so the contents of `uniform-data` match the entities you intend to push.
