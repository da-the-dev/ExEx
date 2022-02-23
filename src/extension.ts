import * as vscode from 'vscode'
import ProfileService from './core/services/profileService'

export async function activate(ctx: vscode.ExtensionContext) {
	// Register each command individually
	ctx.subscriptions.push(
		vscode.commands.registerCommand(`xx.createProfile`, async () => (await import('./commands/createProfile')).cmd.foo(ctx)),
		vscode.commands.registerCommand(`xx.deleteProfile`, async () => (await import('./commands/deleteProfile')).cmd.foo(ctx)),
		vscode.commands.registerCommand(`xx.duplicateProfile`, async () => (await import('./commands/duplicateProfile')).cmd.foo(ctx)),
		vscode.commands.registerCommand(`xx.editProfile`, async () => (await import('./commands/editProfile')).cmd.foo(ctx)),
		vscode.commands.registerCommand(`xx.enableProfile`, async () => (await import('./commands/enableProfile')).cmd.foo(ctx)),
		vscode.commands.registerCommand(`xx.mergeProfile`, async () => (await import('./commands/mergeProfile')).cmd.foo(ctx)),
		vscode.commands.registerCommand(`xx.renameProfiles`, async () => (await import('./commands/renameProfiles')).cmd.foo(ctx)),
		// vscode.commands.registerCommand(`xx.menuTest`, async () => (await import('./commands/menuTest')).cmd.foo(context)),
	)

	// Create an empty global profile if one doesn't exist
	if (!ProfileService.profiles(ctx).find(p => p.name == 'Global'))
		await ProfileService.createProfile('Global', [], [], ctx)
}

export function deactivate() { }
