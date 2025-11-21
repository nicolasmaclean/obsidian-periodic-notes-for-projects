import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
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
			text: 'iso format',  
			attr: { href: 'https://momentjs.com/docs/#/parsing/string/', target: '_blank' }  
		});  
		dateDesc.createEl('br');  
		dateDesc.appendText('Your current syntax looks like this: ');  
		const dateSampleEl = dateDesc.createEl('b', 'u-pop');
        dateDesc.createEl('br');  
		return setting 
			.setName('Date format')  
			.setDesc(dateDesc)  
			.addMomentFormat(momentFormat => momentFormat  
				.setValue(initialValue)  
				.setSampleEl(dateSampleEl)  
				.onChange((value) => {  
                    setter(value)
					this.saveSettings()
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

		if (this.plugin.settings.projects.length == 0)
		{
			projectGroup.addButton(btn => btn
				.setButtonText("+")
				.onClick(() => {
					// Append a blank entry and re‑render
					this.plugin.settings.projects.push(new ProjectSetting());
                    this.saveSettings(true)
				})
			)
            return;
		}
        
        this.plugin.settings.projects.forEach((project, idx) => {
            new Setting(containerEl)
                .setName('Project name')
                .addText(text => text
                    .setPlaceholder("Project name...")
                    .setValue(project.name)
                    .onChange( (newVal) => {
                        project.name = newVal;
                        this.saveSettings()
                    })
                )
                .addExtraButton(extra => extra
                    .setIcon("trash")
                    .setTooltip("Remove this item")
                    .onClick(() => {
                        this.plugin.settings.projects.splice(idx, 1);
                        this.saveSettings(true)
                    })
                );
            const projectDateFormat = new Setting(containerEl)
                .addDropdown(dd => dd
                    .addOption(ETimePeriod.Daily, 'Daily')
                    .addOption(ETimePeriod.Weekly, 'Weekly')
                    .setValue(project.time_period)
                    .onChange((newVal) => {
                        project.time_period = newVal as ETimePeriod;
                        this.saveSettings()
                    })
                )
                .setClass('setting-no-border')
            this.dateSetting(projectDateFormat, project.time_format, (newValue) => project.time_format = newValue);
            new Setting(containerEl)
                .setName('Template path')
                .addText(text => text
                    .setValue(project.template_path)
                    .onChange((newVal) => {
                        project.template_path = newVal;
                        this.saveSettings()
                    })
                )
                .setClass('setting-no-border')
        });

        new Setting(containerEl)
            .addButton(btn => btn
                .setButtonText("+")
                .onClick(() => {
                    // Append a blank entry and re‑render
                    this.plugin.settings.projects.push(new ProjectSetting());
                    this.saveSettings(true)
                }))
    }

    saveSettings(refreshUI = false)
    {
        this.plugin.saveSettings().then(
            () => { 
                if (refreshUI) 
                    this.display()
            },
            (reason) => {
                console.error(`Failed to save settings:\n\n${reason}`);
                new Notice(`Failed to save settings`);
            }
        );
    }
}
