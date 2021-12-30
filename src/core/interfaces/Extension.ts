export interface IExtension {
    name: string
    id: string
    uuid: string

}
export class Extension implements IExtension {
    name: string
    id: string
    uuid: string
    constructor(name: string, id: string, uuid: string) {
        this.name = name
        this.id = id
        this.uuid = uuid
    }

    toDeepExtension(): DeepExtension {
        return { id: this.id, uuid: this.uuid }
    }
    toWeakExtension(): WeakExtension {
        return { id: this.id, name: this.name }
    }
}
export interface DeepExtension {
    id: string
    uuid: string
}
export interface WeakExtension {
    id: string
    name: string
}