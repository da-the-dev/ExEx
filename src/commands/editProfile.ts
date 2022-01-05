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

        const selectedProfile = await vscode.window.showQuickPick(profiles.map(p => p.name), {
            title: 'Select a profile to edit'
        })
        if (!selectedProfile) {
            vscode.window.showErrorMessage('No profile was selected!')
            return
        }

        const profile = profiles.find(p => p.name === selectedProfile)
        if (!profile) {
            vscode.window.showErrorMessage(`No profile with name ${selectedProfile} was found!`)
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


        const selectedExtensions = await vscode.window.showQuickPick(extensions, {
            canPickMany: true,
            title: 'Select extensions you want in a profile',
            placeHolder: 'Find extensions by name here'
        })

        if (!selectedExtensions) {
            vscode.window.showErrorMessage('No extensions were selected!')
            return
        }

        await ProfileService.deleteProfile(selectedProfile, ctx)
        await ProfileService.createProfile(
            selectedProfile,
            rawExtensions.filter(e => selectedExtensions.find(ex => e.name === ex.label)),
            rawExtensions.filter(e => !selectedExtensions.find(ex => e.name === ex.label)),
            ctx
        )

        await vscode.window.showInformationMessage(
            `Succesfully edited "${selectedProfile}"! ${StorageService.getWorkspaceKey<string>('xx.enabledProfiles', ctx)?.includes(selectedProfile) ? 'Re-enable profile to apply the changes!' : ''}`
        )
    }
} as Command
export { cmd }