import * as vscode from 'vscode'
import { DeepExtension, Extension } from "../interfaces/Extension"
import StorageService from "./storageService"
import Profile from "../interfaces/Profile"

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
     * Enables a profile
     * @param profileName Profile's name to enable
     * @param ctx Extension context
     */
    static async enableProfile(profileName: string, ctx: vscode.ExtensionContext) {
        console.log(ctx.storageUri?.path)
        const profile = this.profile(profileName, ctx)
        if (!profile) throw new Error(`No profile "${profileName}" not found!`)
        // const deepExtensions = [...(await StorageService.getDeepWorkspaceKey<DeepExtension[]>('extensionsIdentifiers/enabled', ctx))!,
        // ...(await StorageService.getDeepWorkspaceKey<DeepExtension[]>('extensionsIdentifiers/disabled', ctx))!] as DeepExtension[]

        StorageService.setDeepWorkspaceKey('extensionsIdentifiers/enabled', profile.enabledExtensions.map(e => new Extension(e.name, e.id, e.uuid).toDeepExtension()), ctx)
        StorageService.setDeepWorkspaceKey('extensionsIdentifiers/disabled', profile.disabledExtensions.map(e => new Extension(e.name, e.id, e.uuid).toDeepExtension()), ctx)
        vscode.commands.executeCommand('workbench.action.reloadWindow')
    }
}