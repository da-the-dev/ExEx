import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
const cmd = {
    name: 'createProfile',
    foo: async ctx => {
        const profileName = await vscode.window.showInputBox({
            title: 'Enter the profile\'s name',
            placeHolder: 'Very cool profile XD',
            ignoreFocusOut: true
        })
        if (!profileName) {
            vscode.window.showErrorMessage('No profile name was defined!')
            return
        }

        const extensions = ExtensionService.fetchExtensions(ctx)
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

        ProfileService.createProfile(profileName, enabledExtensions, disabledExtensions, ctx)

        vscode.window.showInformationMessage(`Succesfully created "${profileName}"!`);

        (await vscode.window.showQuickPick(['Enable', 'Skip'], {
            title: "Enable this profile?"
        })) === 'Enable' ? ProfileService.enableProfile(profileName, ctx) : null
    }
} as Command
export { cmd }