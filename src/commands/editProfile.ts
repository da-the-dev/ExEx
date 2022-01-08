import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    name: 'editProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        if (profiles.length <= 0) {
            vscode.window.showErrorMessage('No profiles detected! Nothing to edit!')
            return
        }

        const selectedProfileName = await vscode.window.showQuickPick(ProfileService.sortedProfiles(ctx).map(p => p.name), {
            title: 'Select a profile to edit',
            placeHolder: 'Find a profile by name'
        })
        if (!selectedProfileName) {
            vscode.window.showErrorMessage('No profile was selected!')
            return
        }

        const profile = profiles.find(p => p.name === selectedProfileName)
        if (!profile) {
            vscode.window.showErrorMessage(`No profile with name ${selectedProfileName} was found!`)
            return
        }
        const rawExtensions = await ExtensionService.fetchExtensions()
        const extensions: vscode.QuickPickItem[] =
            rawExtensions
                .map(e => {
                    return {
                        label: e.name,
                        picked: profile.enabledExtensions.find(x => x.name === e.name) ? true : false
                    } as vscode.QuickPickItem
                })
                .sort((a, b) => {                         // Sort by name
                    return a.label >= b.label ? 1 : -1
                })
                .sort((a, b) => {                         // Sort by picked
                    if (a.picked && !b.picked) return -1
                    if (!a.picked && b.picked) return 1
                    return 0
                })
                .filter(e => e.label !== 'ExEx')        // Filter out ExEx extension (is added later)




        const selectedExtensions = await vscode.window.showQuickPick(extensions, {
            canPickMany: true,
            title: 'Select extensions you want in a profile',
            placeHolder: 'Find extensions by name',
        })

        if (!selectedExtensions) {
            vscode.window.showErrorMessage('No extensions were selected!')
            return
        }

        await ProfileService.deleteProfile(selectedProfileName, ctx)
        await ProfileService.createProfile(
            selectedProfileName,
            rawExtensions.filter(e => selectedExtensions.find(ex => e.name === ex.label))
                .concat(rawExtensions.find(e => e.id === 'sv-cheats-1.xx')!),               // Add ExEx extension automatically 
            rawExtensions.filter(e => !selectedExtensions.find(ex => e.name === ex.label)),
            ctx
        )

        // Auto-reload if edited profile is enabled
        const enabledProfiles = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx)
        if (enabledProfiles && enabledProfiles.includes(selectedProfileName)) {
            await ProfileService.enableProfiles(ProfileService.profiles(ctx).filter(p => enabledProfiles.find(ep => ep === p.name)), ctx)
            await vscode.commands.executeCommand('workbench.action.reloadWindow')
        }

        await vscode.window.showInformationMessage(`Succesfully edited "${selectedProfileName}"!`)
    }
} as Command
export { cmd }