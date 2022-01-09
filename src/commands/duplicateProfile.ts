import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ProfileService from '../core/services/profileService'
const cmd = {
    name: 'duplicateProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)
        if (profiles.length <= 0) {
            vscode.window.showErrorMessage('No profiles detected! Nothing to duplicate!')
            return
        }

        const targetProfileName = await vscode.window.showQuickPick(
            ProfileService.sortedProfiles(ctx).map(p => p.name), {
            title: 'Select a profile to duplicate',
            placeHolder: 'Find a profile by name'
        })
        if (!targetProfileName) {
            vscode.window.showErrorMessage('No profile was selected!')
            return
        }

        const duplicatedProfileName = (await vscode.window.showInputBox({
            title: 'Enter a new duplicated profile\'s name',
            placeHolder: 'Very cool new duplicated profile XD',
            ignoreFocusOut: true
        }))?.trim()
        if (!duplicatedProfileName) {
            vscode.window.showErrorMessage('No profile name was defined!')
            return
        }
        if (ProfileService.profile(duplicatedProfileName, ctx)) {
            vscode.window.showErrorMessage('Profile with this name already exists!')
            return
        }

        const targetProfile = ProfileService.profile(targetProfileName, ctx)!
        await ProfileService.createProfile(duplicatedProfileName, targetProfile.enabledExtensions, targetProfile.disabledExtensions, ctx);

        await vscode.window.showInformationMessage(`Succesfully duplicated "${duplicatedProfileName}"!`)
    }
} as Command
export { cmd }