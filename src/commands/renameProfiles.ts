import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ProfileService from '../core/services/profileService'
const cmd = {
    name: 'renameProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        if (profiles.length <= 0) {
            vscode.window.showErrorMessage('No profiles detected! Nothing to edit!')
            return
        }

        const profileName = await vscode.window.showQuickPick(profiles.map(p => p.name), {
            title: 'Select a profile to rename'
        })
        if (!profileName) {
            vscode.window.showErrorMessage('No profile was selected!')
            return
        }

        const profile = profiles.find(p => p.name === profileName)
        if (!profile) {
            vscode.window.showErrorMessage(`No profile with name ${profileName} was found!`)
            return
        }

        const newProfileName = await vscode.window.showInputBox({
            title: "Select a new name for the profile",
            placeHolder: `Prev. name: ${profileName}`
        })
        if (!newProfileName) {
            vscode.window.showErrorMessage(`No new profile name was found!`)
            return
        }

        profile.name = newProfileName
        await ProfileService.deleteProfile(profileName, ctx)
        await ProfileService.createProfile(
            newProfileName,
            profile.enabledExtensions,
            profile.disabledExtensions,
            ctx
        )

        await vscode.window.showInformationMessage(
            `Succesfully renamed "${profileName}" to ${newProfileName}!`
        )
    }
} as Command
export { cmd }