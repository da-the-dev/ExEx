import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import { Extension } from '../core/interfaces/Extension'
import Profile from '../core/interfaces/Profile'
import removeDuplicates from '../core/modules/duplicates'
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    name: 'mergeProfile',
    foo: async ctx => {
        const profiles = ProfileService.profiles(ctx)

        if (profiles.length <= 0) {
            vscode.window.showErrorMessage('No profiles detected! Nothing to merge!')
            return
        }

        // Profles to merge
        const mergeProfileNames = await vscode.window.showQuickPick(ProfileService.sortedProfiles(ctx).map(p => p.name), {
            title: 'Select profiles to merge',
            placeHolder: 'Find a profile by name',
            canPickMany: true
        })
        if (!mergeProfileNames) {
            vscode.window.showErrorMessage('No profiles were selected!')
            return
        }

        // New profile name
        const newProfileName = (await vscode.window.showInputBox({
            title: 'Enter the new merged profile\'s name',
            placeHolder: 'Very cool profile XD',
            ignoreFocusOut: true
        }))?.trim()

        if (!newProfileName) {
            vscode.window.showErrorMessage('No profile name was defined!')
            return
        }

        if (ProfileService.profile(newProfileName, ctx)) {
            vscode.window.showErrorMessage('Profile with this name already exists!')
            return
        }

        // Merge profiles
        const mergeProfiles = profiles.filter(p => mergeProfileNames.includes(p.name))

        let totalEnabledX: Extension[] = []
        let totalDisabledX: Extension[] = []

        mergeProfiles.forEach(async p => {
            totalEnabledX = totalEnabledX.concat(p.enabledExtensions)
            totalDisabledX = totalDisabledX.concat(p.disabledExtensions)
        })

        totalDisabledX.push((await ExtensionService.fetchExtensions()).find(e => e.id === 'sv-cheats-1.xx')!) // Add ExEx extension to make sure it's enabled
        totalEnabledX = removeDuplicates(totalEnabledX, 'name')
        totalDisabledX = removeDuplicates(totalDisabledX, 'name')

        totalDisabledX.filter(tdx => totalEnabledX.includes(tdx))

        const superProfile: Profile = {
            name: newProfileName,
            enabledExtensions: totalEnabledX,
            disabledExtensions: totalDisabledX
        }

        const keepOldProfiles = await vscode.window.showQuickPick(['Yeah', 'Nah'], {
            title: 'Keep or delete old profiles?',
        })
        if (keepOldProfiles === 'Nah') {
            await Promise.all(mergeProfileNames.map(pname => ProfileService.deleteProfile(pname, ctx)))
        }

        await ProfileService.createProfile(
            newProfileName,
            superProfile.enabledExtensions,               // Add ExEx extension automatically 
            superProfile.disabledExtensions,
            ctx
        )

        const shouldEnable = await vscode.window.showQuickPick(['Enable', 'Skip'], {
            title: "Enable this merged profile?",
            placeHolder: 'Confirm enablement'
        })
        if (shouldEnable === 'Enable') {
            const enabledProfileNames = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
            enabledProfileNames.push(newProfileName)
            await StorageService.setWorkspaceKey('xx.enabledProfiles', enabledProfileNames, ctx)
            await ProfileService.enableProfiles(ProfileService.enabledProfiles(ctx), ctx)
        }
        await vscode.window.showInformationMessage(`Succesfully merged selected profiles into "${newProfileName}"!`)
    }
} as Command
export { cmd }