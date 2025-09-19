import { App, Notice, Plugin } from 'obsidian';
import { ZettelSettingTab, ZettelSettings }  from 'src/settings';
import { get_project_from_user, open_file_with_default_template } from 'src/time';


const DEFAULT_SETTINGS: ZettelSettings = {
	daily_format: 'YYYY-MM-DD',
	weekly_format: 'YYYY-WW',
	projects: [],
}

export default class NicksZettelPlugin extends Plugin {
	settings: ZettelSettings

	async onload() {
		// get plugin settings
		await this.loadSettings()
		this.addSettingTab(new ZettelSettingTab(this.app, this))
		
		// add commands
		this.addCommand({
			id: 'open-today',
			name: 'Today',
			callback: async () => {
				if (this.settings.projects.length == 0)
				{
					new Notice('You have no projects to open a daily note for. You can add some projects \
						in the plugin settings!')
						return;
				}
					
				const project = await get_project_from_user(this.app, this.settings.projects)
				if (!project) return
				
				await open_file_with_default_template(this.app, project, require('moment')())
			}
		});
		// this.addCommand({
		// 	id: 'open-previous',
		// 	name: 'Previous',
		// 	callback: () => open_previous(this.settings)
		// });
		// this.addCommand({
		// 	id: 'open-next',
		// 	name: 'Next',
		// 	callback: () => open_next(this.settings)
		// });

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		// new SampleModal(this.app).open();
		// 	}
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, _view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
