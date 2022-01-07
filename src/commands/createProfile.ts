import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
const cmd = {
    name: 'createProfile',
    foo: async ctx => {
        const profileName = (await vscode.window.showInputBox({
            title: 'Enter the profile\'s name',
            placeHolder: 'Very cool profile XD',
            ignoreFocusOut: true
        }))?.trim()

        if (!profileName) {
            vscode.window.showErrorMessage('No profile name was defined!')
            return
        }

        if (ProfileService.profile(profileName, ctx)) {
            vscode.window.showErrorMessage('Profile with this name already exists!')
            return
        }


        const extensions = await ExtensionService.fetchExtensions()
        const selectedExtensions = await vscode.window.showQuickPick(extensions.map(e => e.name), {
            canPickMany: true,
            title: 'Select extensions you want in a profile',
            placeHolder: 'Find extensions by name'
        })

        if (!selectedExtensions) {
            vscode.window.showErrorMessage('No extensions were selected!')
            return
        }

        const enabledExtensions = extensions.filter(e => selectedExtensions.includes(e.name))
        const disabledExtensions = extensions.filter(e => !selectedExtensions.includes(e.name))

        await ProfileService.createProfile(profileName, enabledExtensions, disabledExtensions, ctx);

        (await vscode.window.showQuickPick(['Enable', 'Skip'], {
            title: "Enable this profile?",
            placeHolder: 'Confirm enablement'
        })) === 'Enable' ? await ProfileService.enableProfiles([ProfileService.profile(profileName, ctx)!], ctx) : null

        await vscode.window.showInformationMessage(`Succesfully created "${profileName}"!`)
    }
} as Command
export { cmd }