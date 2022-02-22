import { InputBox, QuickPick, QuickPickItem } from "vscode"

export default function linkMenuItems(items: (InputBox | QuickPick<QuickPickItem>)[]) {
    for (let i = 0; i < items.length - 1; i++) {
        items[i].totalSteps = items.length
        items[i].step = i + 1
        items[i].onDidAccept(() => {
            items[i].hide()
            items[i + 1].show()
        })
        if ('onDidTriggerButton' in items[i])
            items[i].onDidTriggerButton(() => {
                items[i - i].value = ''
                items[i].hide()
                items[i - 1].show()
            })
    }
    items[0].show()
}
