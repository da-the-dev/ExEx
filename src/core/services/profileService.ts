import * as vscode from 'vscode'
import { DeepExtension, Extension } from "../interfaces/Extension"
import StorageService from "./storageService"
import Profile from "../interfaces/Profile"
import removeDuplicates from '../modules/duplicates'

export default class ProfileService {
    constructor() { }

    static profiles = (ctx: vscode.ExtensionContext): Profile[] => StorageService.getGlobalKey<Profile[]>('xx.profiles', ctx) || []
    static profile = (profileName: string, ctx: vscode.ExtensionContext): Profile | undefined => this.profiles(ctx).find(p => p.name === profileName)
    private static updateProfiles = async (profiles: Profile[], ctx: vscode.ExtensionContext) => await StorageService.setGlobalKey('xx.profiles', profiles, ctx)

    /**
     * Creates and saves a new profile
     * @param name Name of the profile
     * @param extensions List of extensions
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

    /**
     * Enables a profile
     * @param profileName Profile's name to enable
     * @param ctx Extension context
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

        const superProfile: Profile = {
            name: 'superProfile',
            enabledExtensions: totalEnabledX,
            disabledExtensions: totalDisabledX
        }

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