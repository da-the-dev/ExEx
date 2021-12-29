import { homedir } from 'os'
import * as vscode from 'vscode'
import * as isWSL from 'is-wsl'
import * as sqlite from 'sqlite'
import * as sqlite3 from 'sqlite3'

export default class StorageService {
    constructor() { }

    private static slash = isWSL ? '/' : process.platform === 'win32' ? '\\' : '/'
    private static slasher = (path: string) => path.replace('/', this.slash)
    private static getVSCPath = () => {
        switch (process.platform) {
            case 'linux':
                return this.slasher(`${homedir()}/.config/Code/`)
        }
        return ''
    }

    /**
     * Retrieves a data for key from VSCode's global `state.vscdb`
     * @param key Key to retrieve 
     * @param parse Should the result be parsed into an object or not
     */
    static async getDeepGlobalKey(key: string, parse = true): Promise<any> {
        const db = await sqlite.open({
            filename: this.slasher(`${this.getVSCPath()}User/globalStorage/state.vscdb`),
            driver: sqlite3.Database
        })
        const value = (await db.get('select value from ItemTable where key = ?', key)).value
        return parse ? JSON.parse(value) : value
    }
    /**
     * Retrieves a data for global key using VSCode's API
     * @param key Key to retrieve 
     * @param ctx Extension context
     */
    static getGlobalKey(key: string, ctx: vscode.ExtensionContext): string | undefined {
        return ctx.globalState.get(key)
    }
    /**
     * Retrieves a data for key from VSCode's workspace `state.vscdb`
     * @param key Key to retrieve 
     * @param ctx Extension context
     * @param parse Should the result be parsed into an object or not
     */
    static async getDeepWorkspaceKey(key: string, ctx: vscode.ExtensionContext, parse = true) {
        const path = `${ctx.storageUri?.path.split(this.slash).slice(0, -1).join(this.slash).toString()}/state.vscdb`
        const db = await sqlite.open({
            filename: path,
            driver: sqlite3.Database
        })
        const value = (await db.get('select value from ItemTable where key = ?', key)).value
        return parse ? JSON.parse(value) : value

    }
    /**
     * Retrieves a data for workspace key using VSCode's API
     * @param key Key to retrieve 
     * @param ctx Extension context
     */
    static getWorkspaceKey(key: string, ctx: vscode.ExtensionContext): string | undefined {
        return ctx.workspaceState.get(key)
    }

}