import { ExtensionContext } from "vscode"
export default interface Command {
    foo(ctx: ExtensionContext): void | Promise<void>
}