import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
const cmd = {
    name: 'createProfile',
    foo: async ctx => {
        const profile = await vscode.window.showInputBox({
            title: 'Enter the profile\'s name',
            placeHolder: 'Very cool profile XD',
            ignoreFocusOut: true
        })
        if (!profile) {
            vscode.window.showErrorMessage('No profile name was defined!')
            return
        }

        const extensions = await ExtensionService.fetchExtensions()
        const selectedExtensions = await vscode.window.showQuickPick(extensions.map(e => e.name), {
            canPickMany: true,
            title: 'Select extensions you want in a profile',
            placeHolder: 'Find an extension here'
        })

        if (!selectedExtensions) {
            vscode.window.showErrorMessage('No extensions were selected!')
            return
        }

        const enabledExtensions = extensions.filter(e => selectedExtensions.includes(e.name))
        const disabledExtensions = extensions.filter(e => !selectedExtensions.includes(e.name))

        await ProfileService.createProfile(profile, enabledExtensions, disabledExtensions, ctx);

        (await vscode.window.showQuickPick(['Enable', 'Skip'], {
            title: "Enable this profile?"
        })) === 'Enable' ? await ProfileService.enableProfiles([ProfileService.profile(profile, ctx)!], ctx) : null

        await vscode.window.showInformationMessage(`Succesfully created "${profile}"!`)
    }
} as Command
export { cmd }