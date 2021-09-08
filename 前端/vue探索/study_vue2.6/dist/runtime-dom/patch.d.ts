import { nodeOps } from '.';
declare const enum PatchHook {
    create = "create",
    activate = "activate",
    update = "update",
    remove = "remove",
    destroy = "destroy"
}
export declare const createPatchFunction: (backend: {
    modules: {
        create?: (() => void) | undefined;
        activate?: (() => void) | undefined;
        update?: (() => void) | undefined;
        remove?: (() => void) | undefined;
        destroy?: (() => void) | undefined;
    }[];
    nodeOps: nodeOps;
}) => (() => void);
export {};
