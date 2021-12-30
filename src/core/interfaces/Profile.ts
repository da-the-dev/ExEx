import { Extension } from "./Extension"

export default interface Profile {
    name: string,
    enabledExtensions: Extension[]
    disabledExtensions: Extension[]
}