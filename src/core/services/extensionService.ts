import * as vscode from 'vscode'
import { readdirSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { slash } from '../modules/slash'
import { createUUID } from '../modules/uuid'
import StorageService from './storageService'
import { Extension, DeepExtension, WeakExtension } from "../interfaces/Extension"

export default class ExtensionService {
    constructor() { }


    /**
     * Fetches all installed extensions from `.vscode/extensions` folder
     * !!!ONLY GUARANTEED TO WORK ON LINUX!!!
     */
    static async fetchExtensions(): Promise<Extension[]> {
        const baseDir = `${homedir()}${slash}.vscode${slash}extensions`
        return readdirSync(baseDir)
            .filter(e => e !== '.obsolete')         // Filter out the '.obsolete' thing (maybe it's important, idk, idc)
            .map(e => {                             // Map extensions from a folder
                const json = JSON.parse(readFileSync(`${baseDir}${slash}${e}${slash}package.json`).toString())

                return {
                    id: e.split('-').slice(0, -1).join('-'),
                    name: json.displayName,
                    uuid: json.__metadata?.id
                } as Extension
            })
            .filter(e => !/(%.*%)/gi.test(e.name))                // Filter out %displayName% things
            .sort((a, b) => {                       // Sort in alphabetical order by name
                return a.name > b.name ? 1 : -1
            })
    }

    /**
     * Fetches all installed using VSCode API
     * @deprecated Requires rethinking. VSCode API hides disabled extensions
     */
    static fetchExtensionsAPI(ctx: vscode.ExtensionContext) {
        return vscode.extensions.all
            .filter(e => !/.*(?:\\\\|\/)resources(?:\\\\|\/)app(?:\\\\|\/)extensions(?:\\\\|\/).*/i.test(e.extensionPath))
            .map(e =>
                new Extension(
                    e.packageJSON.displayName,
                    e.id.toLowerCase(),
                    e.packageJSON.uuid,
                )
            )
            .sort((a, b) => {
                return a.name > b.name ? 1 : -1
            })
    }
}