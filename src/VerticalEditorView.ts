import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import { SwitchText } from "./switchtext";

export const VERTICAL_EDITOR_VIEW_TYPE = "vertical-editor";

export class VerticalEditorView extends ItemView {
    file: TFile | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return VERTICAL_EDITOR_VIEW_TYPE;
    }

    getDisplayText(): string {
        return this.file ? this.file.basename : "vertical_editor";
    }

    getIcon(): string {
        return "text";
    }

    async onOpen(): Promise<void> {
        console.log("onOpen");
        const container = this.containerEl.children[1];
        container.empty();

        // make vertical editor
        const editorDiv = container.createDiv({
            cls: VERTICAL_EDITOR_VIEW_TYPE,
        });
        editorDiv.contentEditable = "true";

        // obtain currently active markdown file
        const activeFile = this.app.workspace.getActiveFile();
        console.log(activeFile);
        if (!activeFile) return;

        let sw = new SwitchText(this.app);
        const fileContent = await this.app.vault.read(activeFile);
        const htmlContent = await sw.fromMarkdownToHTML(fileContent);
        console.log(htmlContent);

        editorDiv.innerHTML = htmlContent;
        this.file = activeFile;

        editorDiv.addEventListener("input", async () => {
            if (this.file) {
                const content = editorDiv.innerHTML;
                console.log(content);
                await this.app.vault.modify(this.file, content);
            }
        });
    }

    async onClose(): Promise<void> {
        // add postprocess
    }
}
