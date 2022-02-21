import * as vscode from 'vscode'
import { readdirSync, readFileSync, readSync, existsSync } from 'fs'
import { homedir } from 'os'
import { slash } from '../modules/slash'
import { createUUID } from '../modules/uuid'
import StorageService from './storageService'
import { Extension, DeepExtension, WeakExtension } from "../interfaces/Extension"

export default class ExtensionService {
    constructor() { }

    /**
     * Fetches all valid and installed extensions from `.vscode/extensions` folder
     */
    static async fetchExtensions(): Promise<Extension[]> {
        const baseDir = `${homedir()}${slash}.vscode${slash}extensions${slash}`
        const obsolete = existsSync(`${baseDir}.obsolete`) ? new Set(Object.keys(JSON.parse(readFileSync(`${baseDir}.obsolete`).toString()))) : new Set()
        const dir = readdirSync(baseDir)
        const found: Set<string> = new Set()
        console.log({ baseDir, obsolete, dir, found })

        return dir
            .filter(a => {
                if (a === '.obsolete' || a === '.DS_Store' || obsolete.has(a))
                    return false

                const aSplit = a.split('-').slice(0, -1).join('-')
                if (!found.has(aSplit)) {
                    const reps = dir.filter(b => b.split('-').slice(0, -1).join('-') == aSplit)
                    const str = [a, ...reps].sort((x, y) => {
                        const xVer = x.split('-').pop()!
                        const yVer = y.split('-').pop()!
                        if (xVer < yVer) return 1
                        if (xVer === yVer) return 0
                        return -1
                    })[0]
                    found.add(str.split('-').slice(0, -1).join('-'))
                    return true
                }
                return false
            })
            .map(e => {                             // Map extensions from a folder
                const json = JSON.parse(readFileSync(`${baseDir}${e}${slash}package.json`).toString())

                console.log(json.displayName, /(%.*%)/gi.test(json.displayName))
                return {
                    id: e.split('-').slice(0, -1).join('-'),
                    name: /(%.*%)/gi.test(json.displayName ? json.displayName : json.name) ? JSON.parse(readFileSync(`${baseDir}${e}${slash}package.nls.json`).toString())[json.displayName.slice(1, -1)] : json.displayName ? json.displayName : json.name,
                    uuid: json.__metadata?.id
                } as Extension
            })
            .sort((a, b) => {                       // Sort in alphabetical order by name
                return a.name > b.name ? 1 : -1
            })
    }
}