import { App, Notice } from 'obsidian';
import { StringSelectModal } from './search';


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
{
    const projectModal = new StringSelectModal(app, projects.map(p => p.name), "Select a project")
    await projectModal.pick();
    if (!projectModal.selected) return; // user aborted
    return projects.find(p => p.name === projectModal.selected);
}

export function open_file_with_default_template(app: App, filePath: string, templatePath: string, sourcePath: string = '')
{
    if (this.app.vault.getFileByPath(filePath) == null)
        {
            // make a copy from the template
            new Notice(`Created ${filePath}`)
            throw new Error('Not Implemented');
        }
    return this.app.workspace.openLinkText(filePath, sourcePath);
}

export function get_today_string(format: string)
{
    const moment = require('moment');
    return moment().format(format)
}
