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
     */
    static fetchExtensions(ctx: vscode.ExtensionContext) {
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