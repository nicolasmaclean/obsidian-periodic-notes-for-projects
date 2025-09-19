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

## Credits

- I love [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes): tailored a snippet of code from them for this plugin
