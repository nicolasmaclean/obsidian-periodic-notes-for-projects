import { App, PluginSettingTab, Setting } from 'obsidian';
import ProjectPeriodicNotesPlugin from '../main'
import { ProjectSetting, ETimePeriod } from 'src/commands';


export interface ProjectPeriodicNotesSettings {
	daily_format: string
	weekly_format: string
	projects: ProjectSetting[]
}

export class ProjectPeriodicNotesSettingTab extends PluginSettingTab {
	plugin: ProjectPeriodicNotesPlugin;

	constructor(app: App, plugin: ProjectPeriodicNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private dateSetting(setting: Setting, initialValue: string, setter: (newValue: string) => void)
        : Setting
	{
		const dateDesc = document.createDocumentFragment();  
		dateDesc.createEl('a', {  
			text: 'Format reference',  
			attr: { href: 'https://momentjs.com/docs/#/displaying/format/', target: '_blank' }  
		});  
        dateDesc.createEl('span', {  
			text: ' | ',  
		});  
        dateDesc.createEl('a', {  
			text: 'ISO Format',  
			attr: { href: 'https://momentjs.com/docs/#/parsing/string/', target: '_blank' }  
		});  
		dateDesc.createEl('br');  
		dateDesc.appendText('Your current syntax looks like this: ');  
		const dateSampleEl = dateDesc.createEl('b', 'u-pop');
        dateDesc.createEl('br');  
        dateDesc.createEl('span', {  
			text: 'For "Open previous" and "Open next" to work reliablely, make sure you use an ISO date string',  
		});  
		return setting 
			.setName('Date format')  
			.setDesc(dateDesc)  
			.addMomentFormat(momentFormat => momentFormat  
				.setValue(initialValue)  
				.setSampleEl(dateSampleEl)  
				.onChange(async (value) => {  
					setter(value)
					// this.plugin.settings.daily_format = value;  
					await this.plugin.saveSettings();  
				})
			);
	}
	
	display()
        : void 
    {
		const {containerEl} = this;
		containerEl.empty();

		const projectGroup = new Setting(containerEl)
			.setName("Projects")
		projectGroup.settingEl.style.borderTop = 'none';

		if (this.plugin.settings.projects.length == 0)
		{
			projectGroup.addButton(btn => btn
				.setButtonText("+")
				.onClick(() => {
					// Append a blank entry and re‑render
					this.plugin.settings.projects.push(new ProjectSetting());
					this.plugin.saveSettings().then(() => this.display());
				})
			)
            return;
		}
        
        this.plugin.settings.projects.forEach((project, idx) => {
            new Setting(containerEl)
                .setName('Project Name')
                .addText(text => text
                    .setPlaceholder("Project name...")
                    .setValue(project.name)
                    .onChange(async (newVal) => {
                        project.name = newVal;
                        await this.plugin.saveSettings();
                    })
                )
                .addExtraButton(extra => extra
                    .setIcon("trash")
                    .setTooltip("Remove this item")
                    .onClick(async () => {
                        this.plugin.settings.projects.splice(idx, 1);
                        await this.plugin.saveSettings();
                        this.display(); // refresh UI
                    })
                );
            // row.settingEl.style.borderTop = 'none';
            const projectDateFormat = new Setting(containerEl)
                .addDropdown(dd => dd
                    .addOption(ETimePeriod.Daily, 'Daily')
                    .addOption(ETimePeriod.Weekly, 'Weekly')
                    .setValue(project.time_period)
                    .onChange(async (newVal) => {
                        project.time_period = newVal as ETimePeriod;
                        await this.plugin.saveSettings();
                    })
                )
            projectDateFormat.settingEl.style.borderTop = 'none';
            this.dateSetting(projectDateFormat, project.time_format, (newValue) => project.time_format = newValue);
            new Setting(containerEl)
                .setName('Template Path')
                .addText(text => text
                    .setValue(project.template_path)
                    .onChange(async (newVal) => {
                        project.template_path = newVal;
                        this.plugin.saveSettings();
                    })
                )
                .settingEl.style.borderTop = 'none';
        });

        new Setting(containerEl)
            .addButton(btn => btn
                .setButtonText("+")
                .onClick(() => {
                    // Append a blank entry and re‑render
                    this.plugin.settings.projects.push(new ProjectSetting());
                    this.plugin.saveSettings().then(() => this.display());
                }))
    }
}
