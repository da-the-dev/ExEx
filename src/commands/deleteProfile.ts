import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ProfileService from '../core/services/profileService'
const cmd = {
    name: 'deleteProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        if (profiles.length <= 0) {
            vscode.window.showErrorMessage('No profiles detected! Nothing to delete!')
            return
        }

        const selectedProfile = await vscode.window.showQuickPick(
            ProfileService.sortedProfiles(ctx).map(p => p.name), {
            title: 'Select a profile to delete',
            placeHolder: 'Find a profile by name'
        })

        if (!selectedProfile) {
            vscode.window.showErrorMessage('No profile name was selected!')
            return
        }

        const confirmDelete = await vscode.window.showQuickPick(["Yeah", "Nah"], {
            title: 'Are you sure you want to delete this profile?',
            placeHolder: 'Confirm deletion'
        })

        if (selectedProfile && ProfileService.sortedProfiles(ctx).filter(p => p.enabled).find(e => e.name === selectedProfile)) {
            await ProfileService.deleteProfile(selectedProfile, ctx)
            await vscode.commands.executeCommand('workbench.action.reloadWindow')
        } else {
            await ProfileService.deleteProfile(selectedProfile, ctx)
            await vscode.window.showInformationMessage(`Succesfully deleted "${selectedProfile}"!`)
        }

    }
} as Command
export { cmd }