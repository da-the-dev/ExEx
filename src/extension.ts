import * as vscode from 'vscode'

export async function activate(context: vscode.ExtensionContext) {
	// Register each command individually
	context.subscriptions.push(
		vscode.commands.registerCommand(`xx.createProfile`, async () => (await import('./commands/createProfile')).cmd.foo(context)),
		vscode.commands.registerCommand(`xx.deleteProfile`, async () => (await import('./commands/deleteProfile')).cmd.foo(context)),
		vscode.commands.registerCommand(`xx.duplicateProfile`, async () => (await import('./commands/duplicateProfile')).cmd.foo(context)),
		vscode.commands.registerCommand(`xx.editProfile`, async () => (await import('./commands/editProfile')).cmd.foo(context)),
		vscode.commands.registerCommand(`xx.enableProfile`, async () => (await import('./commands/enableProfile')).cmd.foo(context)),
		vscode.commands.registerCommand(`xx.mergeProfile`, async () => (await import('./commands/mergeProfile')).cmd.foo(context)),
		vscode.commands.registerCommand(`xx.renameProfiles`, async () => (await import('./commands/renameProfiles')).cmd.foo(context)),
		// vscode.commands.registerCommand(`xx.menuTest`, async () => (await import('./commands/menuTest')).cmd.foo(context)),
	)
}

export function deactivate() { }
