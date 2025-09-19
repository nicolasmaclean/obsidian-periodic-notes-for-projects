# Periodic Notes For Projects

This plugin expands the ideas of [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) to organize time periods per project so you could have multiple daily or weekly notes. You can configure your projects in the plugin settings. 

For example, I have separate daily notes for class and stats:
| Class (Daily)       | Tasks (Weekly)        | Stats (Daily)         |
|---------------------|-----------------------|-----------------------|
| class/2025-09-17.md | tasks/2025-09.md      | stats/2025-09-17.md   |
| class/2025-09-18.md | tasks/2025-10.md      | stats/2025-09-18.md   |
| class/2025-09-19.md | tasks/2025-11.md      | stats/2025-09-19.md   |
| ...                 | ...                   | ...                   |

## Commands

| Name               | Description                                                                              |
|--------------------|------------------------------------------------------------------------------------------|
| `Today`            | open today's or this week's note for a project                                           |
| `Previous`*        | open yesterday's or last week's note for a project. This is relative to the active note. |
| `Next`*            | open tomorrow's or next week's note for a project. This is relative to the active note.  |
| `Create previous`* | open yesterday's or last week's note for a project. This is relative to the active note. |
| `Create next`*     | open tomorrow's or next week's note for a project. This is relative to the active note.  |

\* available when the active note is in a project.

## Setup for Development

- Download [hot-reload](https://github.com/pjeby/hot-reload)
- Clone into `.obsidian/plugins/` of a development vault.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev`.
- Enable plugin.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.
