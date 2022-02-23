import { homedir } from 'os'
import * as vscode from 'vscode'
import * as sqlite from 'sqlite'
import * as sqlite3 from 'sqlite3'
import { slash, slasher } from '../modules/slash'

export default class StorageService {
    constructor() { }

    private static getVSCPath = () => {
        switch (process.platform) {
            case 'linux':
                return slasher(`${homedir()}/.config/Code/`)
            case 'win32':
                return slasher(`${homedir()}/AppData/Roaming/Code/`)
            case 'darwin':
                return slasher(`/Library/Application Support/Code/`)
        }
        return ''
    }

    /*************************************************************************************/

    /**
     * Retrieves data for key from VSCode's global `state.vscdb`.
     * @param key Key to retrieve.
     * @param parse Should the result be parsed into an object or not.
     * @returns By default returns an object. Set `parse` to false to return a string.
     * @example 
     * // Return deep extensions
     * await StorageService.getDeepGlobalKey<Record<string, any>('commandPalette.mru.cache', ctx)
     * // Return some string value 
     * await StorageService.getDeepGlobalKey('workbench.grid.width', ctx, false)
     * // or return it asa string
     * await StorageService.getDeepGlobalKey('commandPalette.mru.cache', ctx)
     */
    static async getDeepGlobalKey(key: string, parse?: false): Promise<string>
    static async getDeepGlobalKey<T>(key: string, parse?: true): Promise<T>
    static async getDeepGlobalKey(key: string, parse = true) {
        const db = await sqlite.open({
            filename: slasher(`${this.getVSCPath()}User/globalStorage/state.vscdb`),
            driver: sqlite3.Database
        })
        const value = (await db.get('select value from ItemTable where key = ?', key)).value
        return parse ? JSON.parse(value) : value
    }

    /**
     * Sets value to a key in global storage using VSCode's API.
     * @param key Key to save to .
     * @param value Value to save
     * @param ctx Extension context
     */
    static async setDeepGlobalspaceKey(key: string, value: any, ctx: vscode.ExtensionContext): Promise<void> {
        const path = `${ctx.globalStorageUri?.path.split(slash).slice(0, -1).join(slash).toString()}/state.vscdb`
        const db = await sqlite.open({
            filename: path,
            driver: sqlite3.Database
        })
        await db.run('insert or replace into ItemTable (key, value) values (?, ?)', key, JSON.stringify(value))
    }

    /*************************************************************************************/

    /**
     * Retrieves value for key from global storage using VSCode's API.
     * @param key Key to retrieve 
     * @param ctx Extension context
     * @param parse Should it parse the value or not
     * @returns By default returns an object. Set `parse` to false to return a string
     * @example 
     * //* Examples *
     * // Return profiles extensions
     * await StorageService.getGlobalKey<Profle[]>('xx.profile', ctx)
     * // Return some string value
     * await StorageService.getGlobalKey('workbench.grid.width', ctx, false)
     */
    static getGlobalKey<T>(key: string, ctx: vscode.ExtensionContext, parse?: true): T | undefined
    static getGlobalKey(key: string, ctx: vscode.ExtensionContext, parse?: false): string | undefined
    static getGlobalKey(key: string, ctx: vscode.ExtensionContext, parse = true) {
        const value = ctx.globalState.get<string>(key)
        return value ? parse ? JSON.parse(value) : value : undefined
    }
    /**
     * Sets value to a key in global storage using VSCode's API.
     * @param key Key to set to
     * @param value Value to save
     * @param ctx Extension context
     */
    static async setGlobalKey(key: string, value: any, ctx: vscode.ExtensionContext) {
        return await ctx.globalState.update(key, JSON.stringify(value))
    }

    /*************************************************************************************/

    /**
     * Retrieves data for key from VSCode's workspace `state.vscdb`
     * @param key Key to retrieve 
     * @param ctx Extension context
     * @param parse Should the result be parsed into an object or not
     * @example
     * //* Examples *
     * // Return deep extensions
     * await StorageService.getDeepWorkspaceKey<DeepExtension[]>('extensionsIdentifiers/enabled', ctx)
     * // Return some string value
     * await StorageService.getDeepWorkspaceKey('workbench.grid.width', ctx, false)
     * 
     */
    static async getDeepWorkspaceKey<T>(key: string, ctx: vscode.ExtensionContext, parse?: true): Promise<T | undefined>
    static async getDeepWorkspaceKey(key: string, ctx: vscode.ExtensionContext, parse?: false): Promise<string | undefined>
    static async getDeepWorkspaceKey(key: string, ctx: vscode.ExtensionContext, parse = true) {
        const path = `${ctx.storageUri?.path.split(slash).slice(0, -1).join(slash).toString()}/state.vscdb`
        const db = await sqlite.open({
            filename: path,
            driver: sqlite3.Database
        })
        const rawValue = (await db.get('select value from ItemTable where key = ?', key))
        return rawValue ? parse ? JSON.parse(rawValue.value) : rawValue.value : undefined
    }

    /**
     * Sets value to a key in workspace storage using VSCode's API.
     * @param key Key to save to .
     * @param value Value to save
     * @param ctx Extension context
     */
    static async setDeepWorkspaceKey(key: string, value: any, ctx: vscode.ExtensionContext): Promise<void> {
        const path = `${ctx.storageUri?.path.split(slash).slice(0, -1).join(slash).toString()}/state.vscdb`
        const db = await sqlite.open({
            filename: path,
            driver: sqlite3.Database
        })
        await db.run('insert or replace into ItemTable (key, value) values (?, ?)', key, JSON.stringify(value))
    }

    /*************************************************************************************/

    /**
     * Retrieves a data for workspace key using VSCode's API
     * @param key Key to retrieve 
     * @param ctx Extension context
     */
    static getWorkspaceKey<T>(key: string, ctx: vscode.ExtensionContext, parse?: true): T | undefined
    static getWorkspaceKey(key: string, ctx: vscode.ExtensionContext, parse?: false): string | undefined
    static getWorkspaceKey(key: string, ctx: vscode.ExtensionContext, parse = true) {
        const value = ctx.workspaceState.get<string>(key)
        return value ? parse ? JSON.parse(value) : value : undefined
    }

    /**
     * Sets value to a key in workspace storage using VSCode's API.
     * @param key Key to set to
     * @param value Value to save
     * @param ctx Extension context
     */
    static async setWorkspaceKey(key: string, value: any, ctx: vscode.ExtensionContext): Promise<void> {
        return await ctx.workspaceState.update(key, JSON.stringify(value))
    }
}