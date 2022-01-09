import * as vscode from 'vscode'
import { DeepExtension, Extension } from "../interfaces/Extension"
import StorageService from "./storageService"
import Profile from "../interfaces/Profile"
import removeDuplicates from '../modules/duplicates'
import ExtensionService from './extensionService'

export default class ProfileService {
    constructor() { }

    /*************************************************************************************/

    /**
     * All avalible profiles
     * @param ctx Extension context
     * @returns All profiles avalible
     */
    static profiles = (ctx: vscode.ExtensionContext): Profile[] => {
        const profiles = StorageService.getGlobalKey<Profile[]>('xx.profiles', ctx)
        if (!profiles)
            return []
        const enabledProfiles = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
        return profiles.map(p => {
            p.enabled = enabledProfiles.find(ep => p.name == ep) ? true : false
            return p
        })
    }
    /**
     * Returns a profile with a specific name
     * @param profileName Profile name to search for
     * @param ctx Extension context
     * @returns A profile with name `profileName`
     */
    static profile = (profileName: string, ctx: vscode.ExtensionContext): Profile | undefined => this.profiles(ctx).find(p => p.name === profileName)
    /**
     * Saves names of `profiles`
     * @param profiles Profiles to save
     * @param ctx Extension cotnext
     */
    private static updateProfiles = async (profiles: Profile[], ctx: vscode.ExtensionContext) => await StorageService.setGlobalKey('xx.profiles', profiles, ctx)
    /**
     * Returns only enabled profiles
     * @param ctx Extension context
     */
    static enabledProfiles = (ctx: vscode.ExtensionContext) => {
        const enabledProfileNames = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
        return this.profiles(ctx).filter(p => enabledProfileNames.includes(p.name))
    }
    /**
     * Returns sorted profiles or sorted `QuickPickItem[]`
     * @param ctx Extension context
     * @param mapToQPI Maps result to `QuickPickItem[]`. ***False*** by default 
     * @param sortByEnabled Sorts by "enabled". ***False*** by defalut
     * @param sortByName Sorts by name. ***True*** by defalut
     */
    static sortedProfiles(ctx: vscode.ExtensionContext, mapToQPI?: false, sortByEnabled?: boolean, sortByName?: boolean): Profile[]
    static sortedProfiles(ctx: vscode.ExtensionContext, mapToQPI?: true, sortByEnabled?: boolean, sortByName?: boolean): vscode.QuickPickItem[]
    static sortedProfiles(ctx: vscode.ExtensionContext, mapToQPI = false, sortByEnabled = false, sortByName = true) {
        let profiles = this.profiles(ctx)
        profiles = sortByName ? profiles.sort((a, b) => {
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
            return 0
        }) : profiles
        profiles = sortByEnabled ? profiles.sort((a, b) => {
            if (a.enabled && !b.enabled) return -1
            if (!a.enabled && b.enabled) return 1
            return 0
        }) : profiles

        return mapToQPI ? profiles
            .map(p => {
                return {
                    label: p.name,
                    picked: p.enabled
                } as vscode.QuickPickItem
            }) : profiles
    }
    /**
     * Simply sets enabled and disabled extensions in current workspace. 
     * @param enabledExtensions 
     * @param disabledExtensions 
     * @param ctx 
     */
    static async setExtensions(enabledExtensions: Extension[], disabledExtensions: Extension[], ctx: vscode.ExtensionContext) {
        await StorageService.setDeepWorkspaceKey('extensionsIdentifiers/enabled', enabledExtensions.map(e => new Extension(e.name, e.id, e.uuid).toDeepExtension()), ctx)
        await StorageService.setDeepWorkspaceKey('extensionsIdentifiers/disabled', disabledExtensions.map(e => new Extension(e.name, e.id, e.uuid).toDeepExtension()), ctx)
        await vscode.commands.executeCommand('workbench.action.reloadWindow')
    }


    /*************************************************************************************/

    /**
     * Creates and saves a new profile
     * @param name Name of the profile
     * @param extensions List of extensions
     * @returns A new profile
     */
    static async createProfile(name: string, enabledExtensions: Extension[], disabledExtensions: Extension[], ctx: vscode.ExtensionContext) {
        const profiles = this.profiles(ctx)
        const newProfile: Profile = {
            name: name,
            enabledExtensions: enabledExtensions,
            disabledExtensions: disabledExtensions
        }
        profiles.push(newProfile)
        await this.updateProfiles(profiles, ctx)
        return newProfile
    }
    /**
     * Enables a profile
     * @param profileName Profile's name to enable
     * @param ctx Extension context
     * @deprecated This method is obsolete. Use {@link enableProfiles()}
     */
    static async enableProfile(profileName: string, ctx: vscode.ExtensionContext) {
        const profile = this.profile(profileName, ctx)
        if (!profile) throw new Error(`No profile "${profileName}" not found!`)

        await this.setExtensions(profile.enabledExtensions, profile.disabledExtensions, ctx)
    }
    /**
     * Enables many profiles
     * @param profileName Profile names to enable
     * @param ctx Extension context
     */
    static async enableProfiles(profiles: Profile[], ctx: vscode.ExtensionContext) {
        let totalEnabledX: Extension[] = []
        let totalDisabledX: Extension[] = []

        profiles.forEach(async p => {
            totalEnabledX = totalEnabledX.concat(p.enabledExtensions)
            totalDisabledX = totalDisabledX.concat(p.disabledExtensions)
        })

        totalEnabledX = removeDuplicates(totalEnabledX, 'name')
        totalDisabledX = removeDuplicates(totalDisabledX, 'name')

        totalDisabledX.filter(tdx => totalEnabledX.includes(tdx))

        // If no profiles are selected, disable all extensions
        if (totalDisabledX.length <= 0 && totalEnabledX.length <= 0)
            totalDisabledX = await ExtensionService.fetchExtensions()

        const superProfile: Profile = {
            name: 'superProfile',
            enabledExtensions: totalEnabledX,
            disabledExtensions: totalDisabledX
        }

        await StorageService.setWorkspaceKey('xx.enabledProfiles', profiles.map(p => p.name), ctx)
        await this.setExtensions(totalEnabledX, totalDisabledX, ctx)
    }
    /**
     * Deletes a profile
     * @param profileName Profile's name to enable
     * @param ctx Extension context
     */
    static async deleteProfile(profileName: string, ctx: vscode.ExtensionContext) {
        const profiles = this.profiles(ctx)

        const profileIndex = profiles.findIndex(p => p.name === profileName)
        if (profileIndex === -1) throw new Error(`No profile "${profileName}" not found!`)
        profiles.splice(profileIndex, 1)

        await this.updateProfiles(profiles, ctx)
    }
}

