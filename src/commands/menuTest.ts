import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import { Extension } from '../core/interfaces/Extension'
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    foo: async ctx => {
        // !!!POTENTIAL FOR GLORY!!!

        let profileName = ''
        const totalSteps = 3
        let extensions: Extension[] = await ExtensionService.fetchExtensions()

        const qp = vscode.window.createQuickPick()
        const ib = vscode.window.createInputBox()

        // Start the menu
        defineIB()

        function defineIB() {
            ib.totalSteps = totalSteps
            ib.step = 1
            ib.title = 'Enter the profile\'s name'
            ib.placeholder = 'Very cool profile XD'
            ib.show()
            ib.onDidAccept(async () => {
                if (ib.validationMessage != '') return
                if (ib.value == '') {
                    vscode.window.showErrorMessage('No profile name was defined!')
                    ib.hide()
                    return
                }
                profileName = ib.value
                ib.hide()
                qp.show()
                // Quick pick portion (step 2)
                await defineQP(qp, ib)
            })
            ib.onDidChangeValue(input => {
                if (ProfileService.profile(input, ctx))
                    ib.validationMessage = 'Profile with this name already exists!'
                else
                    ib.validationMessage = ''
            })
        }

        async function defineQP(qp: vscode.QuickPick<vscode.QuickPickItem>, ib: vscode.InputBox) {
            qp.totalSteps = totalSteps
            qp.step = 2
            qp.title = 'Select extensions you want in a profile'
            qp.buttons = [vscode.QuickInputButtons.Back]
            qp.canSelectMany = true
            qp.placeholder = 'Find extensions by name'
            qp.items =
                extensions.map(e => {
                    return {
                        label: e.name,
                        // description:                 ToDo: add shortened descriptions
                    } as vscode.QuickPickItem
                })

            qp.onDidAccept(() => {
                if (qp.selectedItems.length <= 0) {
                    qp.hide()
                    vscode.window.showErrorMessage('No extensions were selected!')
                    return
                }
                qp.hide()
                qp.busy = true
                createProfile(qp.selectedItems.map(i => i.label))
            })
            // Go back a step (re-implement if new buttons are added)
            qp.onDidTriggerButton(e => {
                ib.value = ''
                qp.hide()
                ib.show()
            })
        }

        async function createProfile(selectedExtensions: string[]) {
            // Create profile
            const enabledExtensions = extensions.filter(e => selectedExtensions.includes(e.name))
                .concat(extensions.find(e => e.id === 'sv-cheats-1.xx')!)                           // Add ExEx extension automatically 
            const disabledExtensions = extensions.filter(e => !selectedExtensions.includes(e.name))
            await ProfileService.createProfile(profileName, enabledExtensions, disabledExtensions, ctx)

            qp.busy = false

            vscode.window.showInformationMessage(`Succesfully created "${profileName}"!`)

            // Ask whether enable or skip
            const sqp = vscode.window.createQuickPick()
            sqp.totalSteps = totalSteps
            sqp.step = 3
            sqp.items = [{ label: 'Enable' }, { label: 'Skip' }]
            sqp.title = 'Enable this profile?'
            sqp.placeholder = 'Confirm enablement'

            sqp.onDidAccept(async () => {
                if (sqp.value === 'Enable' || sqp.selectedItems[0].label === 'Enable') {
                    const enabledProfileNames = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
                    enabledProfileNames.push(profileName)
                    await StorageService.setWorkspaceKey('xx.enabledProfiles', enabledProfileNames, ctx)
                    await ProfileService.enableProfiles(ProfileService.enabledProfiles(ctx), ctx)
                }
                sqp.hide()
            })

            sqp.show()
        }
    }
} as Command
export { cmd }



