import * as vscode from "vscode"

export default class MultiStepPick<T extends vscode.QuickPickItem> {
    private options: vscode.QuickPick<T>
    private qp = vscode.window.createQuickPick()
    constructor(options: vscode.QuickPick<T>) {
        this.options = options;
        (this.qp as any) = (this.options as any)
    }
}