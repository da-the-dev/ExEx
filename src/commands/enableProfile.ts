import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ProfileService from '../core/services/profileService'
const cmd = {
    name: 'enableProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        const selectedProfiles = await vscode.window.showQuickPick(profiles.map(p => p.name), {
            title: 'Select profiles to enable',
            canPickMany: true
        })

        console.log({ selectedProfiles })

        if (!selectedProfiles) {
            vscode.window.showErrorMessage('No profile was selected!')
            return
        }

        const pickedProfiles = profiles.filter(p => selectedProfiles.includes(p.name))
        await ProfileService.enableProfiles(pickedProfiles, ctx)
        vscode.window.showInformationMessage('Profiles enabled!')
    }
} as Command
export { cmd }
