import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import Profile from '../core/interfaces/Profile'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        const prevEnabledProfiles = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
        let enabledProfiles: Profile[] = []
        if (prevEnabledProfiles)
            enabledProfiles = profiles.filter(p => prevEnabledProfiles.includes(p.name))


        const enableProfiles = await vscode.window.showQuickPick(ProfileService.sortedProfiles(ctx, true, true), {
            title: 'Select profiles to enable',
            placeHolder: 'Find a profile by name',
            canPickMany: true
        })

        if (!enableProfiles) {
            vscode.window.showErrorMessage('No new profile was selected!')
            return
        }

        await ProfileService.enableProfiles(profiles.filter(p => enableProfiles.find(sp => sp.label === p.name)), ctx)
        await vscode.window.showInformationMessage('Profiles enabled!')
    }
} as Command
export { cmd }
