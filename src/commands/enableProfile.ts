import { profile, profileEnd } from 'console'
import { writeFileSync } from 'fs'
import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    name: 'enableProfile',
    foo: async ctx => {
        console.log(StorageService.getGlobalKey('xx.profiles', ctx))

        const profiles = ProfileService.profiles(ctx)

        const selectedProfile = await vscode.window.showQuickPick(profiles.map(p => p.name), {
            title: 'Select a profile to enable'
        })

        if (!selectedProfile) {
            vscode.window.showErrorMessage('No profile was selected!')
            return
        }

        await ProfileService.enableProfile(selectedProfile, ctx)
        await vscode.commands.executeCommand('workbench.action.reloadWindow')

        // Need to rework to apply multiple profiles

        // const selectedProfiles = await vscode.window.showQuickPick(profiles.map(p => p.name), {
        //     title: 'Select profiles to enable',
        //     canPickMany: true
        // })

        // if (!selectedProfiles) {
        //     vscode.window.showErrorMessage('No profile was selected!')
        //     return
        // }

        // const pickedProfiles = profiles.filter(p => selectedProfiles.includes(p.name))

        // profiles.forEach(async p => {
        //     await ProfileService.enableProfile(p.name, ctx)
        // })
    }
} as Command
export { cmd }