# Nick's Zettel

This plugin creates, finds, and organizes your Zettelkasten notes. After starting my journey with [Dominik Mayer's Note ID](https://github.com/dominikmayer/obsidian-note-id), I settled into using these 3 workflows:

- Pure zettel: plain notes with descriptive filenames accessed by the built-in search plugin
- Hierarchy: plain notes with descriptive filenames, but includes a path property to provide filesystem like organization
- Time: periodic notes organized by projects

Essentially, I have combined [Note ID](https://github.com/dominikmayer/obsidian-note-id) and [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) into a single plugin tailored for my version of Zettelkasten notes that enables you to avoid ever needing any kind of file system viewer. 

## Pure Zettel

There is no file organization! Create notes in the root of your vault and use the built-in search plugin to find them.

My plugin has no tools to streamline this workflow. This works without any plugins!

## Hierarchy

This workflow is a compromise between pure zettel and a typical filesystem workflow. All of your notes will sit unorganized at the vault root, but the `path` property in a note enables a hierachical organization that can be explored with `Path search`. Allowing you to find and organize your brain using links, tags, hierachy, and text searches.

### Commands

| Name | Description |
| --- | --- |
| `Path search` | search path branches top down and open files |
| `Create at path` | navigate path branches then append or insert file to path |
| `Set path`* | update the path property in the front matter of the current file |

\* available when there is an active note
## Time

Access daily and weekly notes organized by "project". See the plugin settings to configure your projects.

This functionality is heavily inspired [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes) and a snippet of code from them was used in this plugin.

Example:

| Class (Daily)   | Tasks (Weekly)  | Stats (Daily)   |
| -------------   | -------------   | -------------   |
| 2025-09-17.md   | 2025-09.md      | 2025-09-17.md   |
| 2025-09-18.md   | 2025-10.md      | 2025-09-18.md   |
| 2025-09-19.md   | 2025-11.md      | 2025-09-19.md   |
| ...             | ...             | ...             |

### Commands

| Name | Description |
| --- | --- |
| `Today` | open today's or this week's note for a project |
| `Previous`* | open yesterday's or last week's note for a project. This is relative to the active note. |
| `Next`* | open tomorrow's or next week's note for a project. This is relative to the active note. |
| `Create previous`* | open yesterday's or last week's note for a project. This is relative to the active note. |
| `Create next`* | open tomorrow's or next week's note for a project. This is relative to the active note. |

\* available when the active note is a daily or weekly note

## Roadmap

1.1.0

- `Create Previous` and `Create Next`
- `Previous` and `Next`

1.0.0

- [x] `Today`
- [ ] `Set path`
- [ ] `Path search`
- [ ] `Create at path`

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
