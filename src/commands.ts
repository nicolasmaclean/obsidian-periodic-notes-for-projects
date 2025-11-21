import { App, Notice } from 'obsidian';
import { StringSelectModal } from './search';
import ProjectPeriodicNotesPlugin from 'main';


// command bindings
export function get_commands(plugin: ProjectPeriodicNotesPlugin) { 
    return [
        {
            id: 'create-today',
            name: 'Create today',
            callback: () => create_today(plugin)
        },
        {
			id: 'create-previous',
			name: 'Create previous',
			checkCallback: (checking: boolean) => create_adjacent(plugin, checking, -1)
		},
        {
			id: 'create-next',
			name: 'Create next',
            checkCallback: (checking: boolean) => create_adjacent(plugin, checking, 1)
		},
        {
			id: 'open-previous',
			name: 'Open previous',
			checkCallback: (checking: boolean) => open_adjacent(plugin, checking, -1)
		},
        {
            id: 'open-next',
			name: 'Open next',
            checkCallback: (checking: boolean) => open_adjacent(plugin, checking, 1)
        }
    ]
}



// data
export class ProjectSetting {
    name: string
    time_period: ETimePeriod = ETimePeriod.Daily
    time_format = 'YYYY-MM-DD'
    template_path: string
}

export enum ETimePeriod {
    Daily = 'daily',
    Weekly = 'weekly'
}


// commands
async function create_today(plugin: ProjectPeriodicNotesPlugin)
    : Promise<boolean>
{
    if (plugin.settings.projects.length == 0)
    {
        new Notice('You have no projects to open a daily note for. You can add some projects \
            in the plugin settings!')
            return false;
    }
        
    const project = await get_project_from_user(plugin.app, plugin.settings.projects)
    if (!project) return false;
    
    return open_file_with_default_template(plugin.app, project, window.moment())
}

function create_adjacent(plugin: ProjectPeriodicNotesPlugin, checking: boolean, increment: number)
    : boolean
{
    // handle checking
    const file = plugin.app.workspace.getActiveFile(); // currently open note
    if (!file) return false
    const project = plugin.settings.projects.find(p => p.name.toLowerCase() === file.parent?.path.toLowerCase()) // get project for note
    if (!project) return false
    if (checking) return true

    // get moment from active file
    const filename = file.basename
    const moment = window.moment(filename, project.time_format)
    
    open_file_with_default_template(plugin.app, project, increment_moment(moment, increment, project.time_period))
        .catch((reason) => {
            console.error(`Unhandled error while creating (or opening) file from ${project.template_path}:\n\n${reason}`)
            new Notice('Unhandled error while creating (or opening) file from template.')
        })
    return true
}

function open_adjacent(plugin: ProjectPeriodicNotesPlugin, checking: boolean, increment: number)
    : boolean
{
    // handle checking
    const file = plugin.app.workspace.getActiveFile(); // currently open note
    if (!file) return false
    const project = plugin.settings.projects.find(p => p.name.toLowerCase() === file.parent?.path.toLowerCase()) // get project for note
    if (!project) return false
    if (checking) return true

    // get moment from active file
	const filename = file.basename
	let moment = window.moment(filename, project.time_format)
	moment = increment_moment(moment, increment, project.time_period)

	// iterate till we find the adjacent note
	// yes this is dumb, but I'm lazy lol
	for (let i = 0; i < 30; i++)
	{
		if (try_to_open_file(plugin.app, project, moment)) return true
		moment = increment_moment(moment, increment, project.time_period)
	}

    new Notice(
        increment > 0
            ? 'No next note was found. If you want to create one, make sure to use "Create next"'
            : 'No previous note was found. If you want to create one, make sure to use "Create previous"'
    )
	return true
}



async function get_project_from_user(app: App, projects: ProjectSetting[])
    : Promise<ProjectSetting | undefined>
{
    const projectModal = new StringSelectModal(app, projects.map(p => p.name), "Select a project")
    await projectModal.pick();
    if (!projectModal.selected) return Promise.resolve(undefined); // user aborted
    return Promise.resolve(projects.find(p => p.name === projectModal.selected));
}

async function open_file_with_default_template(app: App, project: ProjectSetting, moment: moment.Moment, sourcePath = '')
    : Promise<boolean>
{
    const filename = moment.format(project.time_format)
    const dirname = project.name.toLowerCase()
    const filePath = pathJoin(dirname, filename + '.md')
    
    if (app.vault.getFileByPath(filePath) == null && project.template_path)
    {
        // get template
        let contents = ''
        try {
            const templateFile = app.metadataCache.getFirstLinkpathDest(project.template_path, '')
            contents = await app.vault.cachedRead(templateFile!);
        }
        catch {
            console.error(`Failed to read template at ${project.template_path}`)
            new Notice('Failed to read template')
            return false
        }
        
        // fill out template and create file
        contents = apply_template(filename, moment, project.time_format, contents)

        if (!app.vault.getAbstractFileByPath(dirname)) await app.vault.createFolder(dirname)
        await app.vault.create(filePath, contents)
        new Notice(`Created ${filePath}`)
    }
    await app.workspace.openLinkText(filePath, sourcePath)
    return true
}

function try_to_open_file(app: App, project: ProjectSetting, moment: moment.Moment, sourcePath: string = '')
    : boolean
{
    const filename = moment.format(project.time_format)
    const dirname = project.name.toLowerCase()
    const filePath = pathJoin(dirname, filename + '.md')
    
    if (app.vault.getFileByPath(filePath) !== null)
    {
        app.workspace.openLinkText(filePath, sourcePath)
            .catch((reason) => {
                console.error(`Unable to open file at ${filePath}: \n\n ${reason}`)
                new Notice('Unable to open file')
            })
        return true
    }

    return false
}

function increment_moment(moment: moment.Moment, increment: number, mode: ETimePeriod)
    : moment.Moment
{
    if (mode == ETimePeriod.Daily)
    {
        return moment.add(increment, 'day')
    }
    else if (mode == ETimePeriod.Weekly)
    {
        return moment.add(increment, 'week')
    }

    throw new Error('Unsupported ETimePeriod')
}

// copied from the periodic-notes plugin
// https://github.com/liamcain/obsidian-periodic-notes/blob/main/src/utils.ts
function apply_template(filename: string, date: moment.Moment, format: string, rawTemplateContents: string)
    : string 
{
    let templateContents = rawTemplateContents;
    templateContents = rawTemplateContents
        .replace(/{{\s*date\s*}}/gi, filename)
        .replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm"))
        .replace(/{{\s*title\s*}}/gi, filename)
        .replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
        .replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format))
        .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi,
            (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
                const now = window.moment();
                const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
                });
                if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
                }

                if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
                }
                return currentDate.format(format);
            }
        )
        .replace(
            /{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi,
            (_, dayOfWeek, momentFormat) => {
                const day = getDaysOfWeek().indexOf(dayOfWeek.toLowerCase());
                return date.weekday(day).format(momentFormat.trim());
            }
        )
  
    return templateContents;
}

function getDaysOfWeek()
    : string[] 
{
    const { moment } = window;
    // `any as` is just a little bit of trickery to get the 1st day of the week
    let weekStart = (moment.localeData() as any)._week.dow;
    const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];

    while (weekStart) {
        const day = daysOfWeek.shift();
        if (day) daysOfWeek.push(day);
        weekStart--;
    }
    return daysOfWeek;
}

function pathJoin(...segments: string[])
    : string 
{
    return segments.join('/')
}
