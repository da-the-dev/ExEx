import * as vscode from 'vscode'
import StorageService from "../core/services/storageService"
import Command from "../core/interfaces/Command"
const cmd = {
    name: 'createProfile',
    foo: async ctx => {
        const data = await StorageService.getDeepWorkspaceKey('extensionsIdentifiers/disabled', ctx)
        if (data)
            console.log(data)
        else
            throw new Error('No data receieved!')
    }
} as Command
export { cmd }