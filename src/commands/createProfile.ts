import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import validateWorkspace from '../core/modules/validateWorkspace'
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    foo: async ctx => {
        if (!validateWorkspace(ctx)) return
        const newProfileName = (await vscode.window.showInputBox({
            title: 'Enter the profile\'s name',
            placeHolder: 'Very cool profile XD',
            ignoreFocusOut: true
        }))?.trim()

        if (!newProfileName) {
            vscode.window.showErrorMessage('No profile name was defined!')
            return
        }

        if (ProfileService.profile(newProfileName, ctx)) {
            vscode.window.showErrorMessage('Profile with this name already exists!')
            return
        }


        const extensions = await ExtensionService.fetchExtensions()
        const selectedExtensions = await vscode.window.showQuickPick(extensions.map(e => e.name)
            .filter(e => e !== 'ExEx'), {                  // Filter out ExEx extension (is added later)
            canPickMany: true,
            title: 'Select extensions you want in a profile',
            placeHolder: 'Find extensions by name'
        })

        if (!selectedExtensions) {
            vscode.window.showErrorMessage('No extensions were selected!')
            return
        }

        const enabledExtensions = extensions.filter(e => selectedExtensions.includes(e.name))
            .concat(extensions.find(e => e.id === 'sv-cheats-1.xx')!)                           // Add ExEx extension automatically 
        const disabledExtensions = extensions.filter(e => !selectedExtensions.includes(e.name))

        await ProfileService.createProfile(newProfileName, enabledExtensions, disabledExtensions, ctx)

        const shouldEnable = await vscode.window.showQuickPick(['Enable', 'Skip'], {
            title: "Enable this profile?",
            placeHolder: 'Confirm enablement'
        })
        if (shouldEnable === 'Enable') {
            const enabledProfileNames = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
            enabledProfileNames.push(newProfileName)
            await StorageService.setWorkspaceKey('xx.enabledProfiles', enabledProfileNames, ctx)
            await ProfileService.enableProfiles(ProfileService.enabledProfiles(ctx), ctx)
        }
        await vscode.window.showInformationMessage(`Succesfully created "${newProfileName}"!`)
    }
} as Command
export { cmd }