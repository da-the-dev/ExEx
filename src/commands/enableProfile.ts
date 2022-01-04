import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import Profile from '../core/interfaces/Profile'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    name: 'enableProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        const prevEnabledProfiles = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
        let enabledProfiles: Profile[] = []
        if (prevEnabledProfiles)
            enabledProfiles = profiles.filter(p => prevEnabledProfiles.includes(p.name))

        const selectedProfiles: vscode.QuickPickItem[] =
            enabledProfiles.map(p => {              // Map previously enabled profiles as picked
                return {
                    label: p.name,
                    picked: true
                }
            }).concat(
                profiles.filter(p => !enabledProfiles.includes(p))
                    .map(p => {                     // Map previously disabled profiles as not picked
                        return {
                            label: p.name,
                            picked: false
                        }
                    })
            )


        const selectedProfilesQP = await vscode.window.showQuickPick(selectedProfiles, {
            title: 'Select profiles to enable',
            placeHolder: 'Enter profile name to find',
            canPickMany: true
        })

        if (!selectedProfilesQP) {
            vscode.window.showErrorMessage('No new profile was selected!')
            return
        }

        const pickedProfiles = profiles.filter(p => selectedProfilesQP.find(sp => sp.label === p.name))
        await ProfileService.enableProfiles(pickedProfiles, ctx)
        await vscode.window.showInformationMessage('Profiles enabled!')
    }
} as Command
export { cmd }
