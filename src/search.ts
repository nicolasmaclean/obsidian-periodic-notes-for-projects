import { App, FuzzySuggestModal, FuzzyMatch } from "obsidian";


export class StringSelectModal extends FuzzySuggestModal<string> {
    public selected: string
    private readonly options: string[];

    // open and wait for selection
    private resolve!: () => void;
    pick(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.resolve = resolve;
            this.open();
        });
    }

    // lifetime
    constructor(app: App, options: string[], placeholder: string) {
        super(app);
        this.options = options;
        this.setPlaceholder(placeholder);
    }

    onClose(): void {
        super.onClose();
        if (this.resolve) this.resolve();
    }
    
    // search modal implementation
    getItems(): string[] { return this.options; }
    getItemText(item: string): string { return item; }
    renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement): void { el.createEl("div", { text: item.item }); }

    onChooseItem(item: string, _evt: MouseEvent | KeyboardEvent): void {
        if (this.resolve) this.resolve();
        this.selected = item;
    }
}