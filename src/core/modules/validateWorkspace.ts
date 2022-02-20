import * as vscode from 'vscode'

export default function validateWorkspace(ctx: vscode.ExtensionContext) {

    if (vscode.workspace.name)
        return true
    else {
        vscode.window.showErrorMessage('You have to open a workspace first!')
        return false
    }
}