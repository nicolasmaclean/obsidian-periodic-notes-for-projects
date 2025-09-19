import { App, Notice } from 'obsidian';
import type { Moment } from "moment";
import { StringSelectModal } from './search';
import { pathJoin } from './utils';


// data
export class ProjectSetting {
    name: string
    time_period: ETimePeriod = ETimePeriod.Daily
    time_format: string = 'YYYY-MM-DD'
    template_path: string
}

export enum ETimePeriod {
    Daily = 'daily',
    Weekly = 'weekly'
}


// utilities
export async function get_project_from_user(app: App, projects: ProjectSetting[])
    : Promise<ProjectSetting | undefined>
{
    const projectModal = new StringSelectModal(app, projects.map(p => p.name), "Select a project")
    await projectModal.pick();
    if (!projectModal.selected) return Promise.resolve(undefined); // user aborted
    return Promise.resolve(projects.find(p => p.name === projectModal.selected));
}

export async function open_file_with_default_template(app: App, project: ProjectSetting, moment: Moment, sourcePath: string = '')
    : Promise<any>
{
    const filename = moment.format(project.time_format)
    const dirname = project.name.toLowerCase()
    const filePath = pathJoin(dirname, filename + '.md')
    
    if (this.app.vault.getFileByPath(filePath) == null && project.template_path)
    {
        // get template
        let contents = ''
        try {
            const templateFile = app.metadataCache.getFirstLinkpathDest(project.template_path, '')
            contents = await app.vault.cachedRead(templateFile!);
        }
        catch (err) {
            console.error(`Failed to read template at ${project.template_path}`)
            new Notice('Failed to read template')
            return
        }
        
        // fill out template and create file
        contents = apply_template(filename, moment, project.time_format, contents)

        if (!app.vault.getAbstractFileByPath(dirname)) await app.vault.createFolder(dirname)
        await app.vault.create(filePath, contents)
        new Notice(`Created ${filePath}`)
    }
    return this.app.workspace.openLinkText(filePath, sourcePath);
}

export function increment_moment(moment: Moment, increment: number, mode: ETimePeriod)
    : Moment
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
function apply_template(filename: string, date: Moment, format: string, rawTemplateContents: string)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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