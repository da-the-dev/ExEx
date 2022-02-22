import * as vscode from 'vscode'
import Command from "../core/interfaces/Command"
import { Extension } from '../core/interfaces/Extension'
import linkMenuItems from '../core/modules/menu'
import ExtensionService from '../core/services/extensionService'
import ProfileService from '../core/services/profileService'
import StorageService from '../core/services/storageService'
const cmd = {
    foo: async ctx => {
        // !!!POTENTIAL FOR GLORY!!!

        let profileName = ''
        let extensions: Extension[] = await ExtensionService.fetchExtensions()

        // Profile name inputbox
        const ib = vscode.window.createInputBox()
        ib.title = 'Enter the profile\'s name'
        ib.placeholder = 'Very cool profile XD'
        ib.onDidAccept(async () => {
            if (ib.validationMessage != '') return
            if (ib.value == '') {
                vscode.window.showErrorMessage('No profile name was defined!')
                ib.hide()
                return
            }
            profileName = ib.value

            // Update qp items 
            qp.items =
                (await ExtensionService.fetchExtensions()).map(e => {
                    return {
                        label: e.name,
                        // description:                 ToDo: add shortened descriptions
                    } as vscode.QuickPickItem
                }).filter(e => e.label != "ExEx")
        })
        ib.onDidChangeValue(input => ib.validationMessage = ProfileService.profile(input, ctx) ? 'Profile with this name already exists!' : '')

        // Extension quickpick
        const qp = vscode.window.createQuickPick()
        qp.title = 'Select extensions you want in a profile'
        qp.placeholder = 'Find extensions by name'
        qp.buttons = [vscode.QuickInputButtons.Back]
        qp.canSelectMany = true

        qp.onDidAccept(async () => {
            if (qp.selectedItems.length <= 0) {
                qp.hide()
                vscode.window.showErrorMessage('No extensions were selected!')
                return
            }

            // Create profile
            const selectedExtensions = qp.selectedItems.map(i => i.label)
            const enabledExtensions = extensions.filter(e => selectedExtensions.includes(e.name))
                .concat(extensions.find(e => e.id === 'sv-cheats-1.xx')!)                           // Add ExEx extension automatically
            const disabledExtensions = extensions.filter(e => !selectedExtensions.includes(e.name))
            await ProfileService.createProfile(profileName, enabledExtensions, disabledExtensions, ctx)

            vscode.window.showInformationMessage(`Succesfully created "${profileName}"!`)
        })

        // Ask whether enable or skip
        const sqp = vscode.window.createQuickPick()
        sqp.title = 'Enable this profile?'
        sqp.placeholder = 'Confirm enablement'
        sqp.items = [{ label: 'Enable' }, { label: 'Skip' }]

        sqp.onDidAccept(async () => {
            if (sqp.value === 'Enable' || sqp.selectedItems[0].label === 'Enable') {
                const enabledProfileNames = StorageService.getWorkspaceKey<string[]>('xx.enabledProfiles', ctx) || []
                enabledProfileNames.push(profileName)
                await StorageService.setWorkspaceKey('xx.enabledProfiles', enabledProfileNames, ctx)
                await ProfileService.enableProfiles(ProfileService.enabledProfiles(ctx), ctx)
            }
            sqp.hide()
        })

        linkMenuItems([ib, qp, sqp])
    }
} as Command
export { cmd }
