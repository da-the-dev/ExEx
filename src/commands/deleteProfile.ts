import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    name: 'deleteProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        if (profiles.length <= 0) {
            vscode.window.showErrorMessage('No profiles detected! Nothing to delete!')
            return
        }

        const deleteProfile = await vscode.window.showQuickPick(
            ProfileService.sortedProfiles(ctx).map(p => p.name), {
            title: 'Select a profile to delete',
            placeHolder: 'Find a profile by name'
        })

        if (!deleteProfile) {
            vscode.window.showErrorMessage('No profile name was selected!')
            return
        }

        const confirmDelete = await vscode.window.showQuickPick(["Yeah", "Nah"], {
            title: 'Are you sure you want to delete this profile?',
            placeHolder: 'Confirm deletion'
        })

        if (confirmDelete === 'Yeah') {
            await ProfileService.deleteProfile(deleteProfile, ctx)
            if (deleteProfile && ProfileService.enabledProfiles(ctx).find(p => p.name === deleteProfile)) {
                const enabledProfileNames = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
                enabledProfileNames.splice(enabledProfileNames.indexOf(deleteProfile), 1)
                await StorageService.setWorkspaceKey('xx.enabledProfiles', enabledProfileNames, ctx)
                await ProfileService.enableProfiles(ProfileService.enabledProfiles(ctx), ctx)

                await vscode.commands.executeCommand('workbench.action.reloadWindow')
            } else {
                await vscode.window.showInformationMessage(`Succesfully deleted "${deleteProfile}"!`)
            }
        } else {
            await vscode.window.showErrorMessage(`Aborted deletion of "${deleteProfile}"!`)
        }
    }
} as Command
export { cmd }