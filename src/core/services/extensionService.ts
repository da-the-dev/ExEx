import * as vscode from 'vscode'
import { readdirSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { slash } from '../modules/slash'
import StorageService from './storageService'
import { Extension, DeepExtension, WeakExtension } from "../interfaces/Extension"
import Profile from "../interfaces/Profile"

export default class ExtensionService {
    constructor() { }

    /**
     * Fetches all installed extensions from `.vscode/extensions` folder
     * !!!ONLY GUARANTEED TO WORK ON LINUX!!!
     */
    static async fetchExtensions(ctx: vscode.ExtensionContext) {
        const deepExtensions = [...(await StorageService.getDeepWorkspaceKey<DeepExtension[]>('extensionsIdentifiers/enabled', ctx))!,
        ...(await StorageService.getDeepWorkspaceKey<DeepExtension[]>('extensionsIdentifiers/disabled', ctx))!] as DeepExtension[]

        const baseDir = `${homedir()}${slash}.vscode${slash}extensions`
        const weakExtensions = readdirSync(baseDir)
            .filter(ed => ed !== '.obsolete')
            .map(ed => {
                const name = JSON.parse(readFileSync(`${baseDir}${slash}${ed}${slash}package.json`).toString()).displayName
                return {
                    id: ed.split('-').slice(0, -1).join('-'),
                    name: name
                } as WeakExtension
            })

        return weakExtensions
            .map(we => {
                const de = deepExtensions.find(de => de.id === we.id)
                if (!de) return undefined
                return new Extension(we.name, we.id, de.uuid)
            })
            .filter((e): e is Extension => !!e)
    }
}