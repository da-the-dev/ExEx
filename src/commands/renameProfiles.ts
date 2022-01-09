import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ProfileService from '../core/services/profileService'
const cmd = {
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        if (profiles.length <= 0) {
            vscode.window.showErrorMessage('No profiles detected! Nothing to edit!')
            return
        }

        const oldProfileName = await vscode.window.showQuickPick(profiles.map(p => p.name), {
            title: 'Select a profile to rename',
            placeHolder: 'Find a profile by name'
        })
        if (!oldProfileName) {
            vscode.window.showErrorMessage('No profile was selected!')
            return
        }

        const profile = profiles.find(p => p.name === oldProfileName)
        if (!profile) {
            vscode.window.showErrorMessage(`No profile with name ${oldProfileName} was found!`)
            return
        }

        const newProfileName = await vscode.window.showInputBox({
            title: "Select a new name for the profile",
            placeHolder: `Prev. name: ${oldProfileName}`
        })
        if (!newProfileName) {
            vscode.window.showErrorMessage(`No new profile name was found!`)
            return
        }

        profile.name = newProfileName
        await ProfileService.deleteProfile(oldProfileName, ctx)
        await ProfileService.createProfile(
            newProfileName,
            profile.enabledExtensions,
            profile.disabledExtensions,
            ctx
        )

        await vscode.window.showInformationMessage(
            `Succesfully renamed "${oldProfileName}" to ${newProfileName}!`
        )
    }
} as Command
export { cmd }