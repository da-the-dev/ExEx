import * as vscode from 'vscode'
import { resolve } from 'path'
import Command from './core/interfaces/Command'
import { readdirSync } from 'fs'

export async function activate(context: vscode.ExtensionContext) {
	// Load all command paths
	const commandPaths = readdirSync(resolve(__dirname, 'commands')).filter(cp => cp.endsWith('.js'))

	// Register each command and assing a function to it
	context.subscriptions.push(...commandPaths.map(cp => {
		const cmd = require(resolve(__dirname, 'commands', cp)).cmd as Command
		const subject = vscode.commands.registerCommand(`xx.${cmd.name}`, () => cmd.foo(context))
		return subject
	}))
}

export function deactivate() { }
