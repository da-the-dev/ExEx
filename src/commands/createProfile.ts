import Command from "@interfaces/Command"
import * as vscode from 'vscode'
const cmd = {
    name: 'test',
    foo: () => {
        vscode.window.showInformationMessage('Test is working!')
    }
} as Command
export { cmd }