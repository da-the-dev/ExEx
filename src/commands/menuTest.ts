import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import Profile from '../core/interfaces/Profile'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    foo: async ctx => {

        // !!!POTENTIAL FOR GLORY!!!

        const qp = vscode.window.createQuickPick()
        qp.totalSteps = 3
        qp.step = 1
        qp.buttons = ([
            {
                iconPath: vscode.Uri.file('/Users/alexeytkachenko/Documents/PROJECTS/ExEx/assets/images/icon.png'),
                tooltip: 'Goofy'
            }
        ] as vscode.QuickInputButton[]).concat(vscode.QuickInputButtons.Back)


        qp.show()

        qp.onDidHide(() => {
            console.log('hid qp')
        })

        qp.onDidTriggerButton(button => {
            console.log(button)
            qp.step! += 1
        })

    }
} as Command
export { cmd }
