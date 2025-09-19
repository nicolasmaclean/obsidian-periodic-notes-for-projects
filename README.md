# Nick's Zettel

This plugin is a used to creating, finding, and connecting your Zettelkasten notes. Initially inspired by [Dominik Mayer's Note ID](https://github.com/dominikmayer/obsidian-note-id), id's are placed in your files' front matter then commands/custom views are used to access your files instead of the file explorer.

I have 3 workflows that I've found to cover all my use-cases:

- Pure zettel: plain notes with descriptive filenames accessed by built-in search plugin
- Hierarchy: descriptive filenames with a path property to enable access by this plugin
- Time: time based filenames organized by projects

### WIP

create file from template (src/time.open_file_with_default_template)
maybe I can call access the methods in methods from this [plugin (periodic note)](https://github.com/liamcain/obsidian-periodic-notes)?


### TODO

Initial specification has the entire UI done through fuzzy search modals, this is to prevent using the file explorer or any custom variant from being used as an anti-pattern. Check back after initial release to re-evaluate.

## Pure Zettel

There is no file organization! Create a blank file however is easiest for you and use the built-in search plugin. My plugin does not augment this workflow at all so you can started with this workflow in any vault! 

## Hierarchy

Files have no organization in your file system, everything just lives in the root folder, but a path property is added to provide a hierarchy. This is used by the hier search 

### Commands

`Search`: search path branches top down and open files

`Create`: navigate path branches then append or insert file to path

`Set Path`: update the path value in the front matter of the current file

## Time

Organize files by project and configure the time period. Then you may create (or open pre-existing) daily or weekly files for this project per the configuration. The files are stored in separate directories for each proejct to prevent filename conflicts. Below are some of my own projects:

| Stats (Daily)   |
| -------------   |
| 2025-09-17.md   |
| 2025-09-18.md   |
| 2025-09-19.md   |
| ...             |

| Tasks (Weekly)  |
| -------------   |
| 2025-09.md      |
| 2025-10.md      |
| 2025-11.md      |
| ...             |

### Commands

`Today`: open today's or this week's note for the selected project.

`Previous`: open yesterday's or last week's note for the selected project. This is relative to today or the date of the current file. This will NOT create a file if it doesn't exist.

`Next`: open tomorrow's or next week's note for the selected project. This is relative to today or the date of the current file. This WILL create a file if it doesn't exist.

### TODO

- Support "unique" time period: today will always be a new file and open next will not create a new file.
- More flexible templating for file names and file contents.

---

## Setup for Development

- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
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

## Improve code quality with eslint (optional)

- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint ./src/`

See https://github.com/obsidianmd/obsidian-api
