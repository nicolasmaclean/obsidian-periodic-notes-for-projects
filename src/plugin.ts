import { Plugin } from 'obsidian';

import { ProjectPeriodicNotesSettingTab, ProjectPeriodicNotesSettings }  from 'src/settings';
import { get_commands } from 'src/commands';


const DEFAULT_SETTINGS: ProjectPeriodicNotesSettings = {
	daily_format: 'YYYY-MM-DD',
	weekly_format: 'YYYY-[W]WW',
	projects: [],
}

export default class ProjectPeriodicNotesPlugin extends Plugin {
	settings: ProjectPeriodicNotesSettings

	async onload() {
		// handle plugin settings
		await this.loadSettings()
		this.addSettingTab(new ProjectPeriodicNotesSettingTab(this.app, this))
		
		// add commands
		for (const command of get_commands(this)) this.addCommand(command)
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
