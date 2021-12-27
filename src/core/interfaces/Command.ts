import { ExtensionContext } from "vscode"
export default interface Command {
    name: string,
    foo(ctx: ExtensionContext): void | Promise<void>
}