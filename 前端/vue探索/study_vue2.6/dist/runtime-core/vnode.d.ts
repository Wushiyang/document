import { Component, VNodeComponentOptions } from '.';
export declare class VNode {
    tag: string;
    key: string | number;
    data: VNodeData;
    children: Array<VNode>;
    text: string;
    elm: Node;
    context: Component;
    componentOptions: VNodeComponentOptions;
    isAsyncPlaceholder: boolean;
    asyncFactory: () => void;
    constructor(tag?: string, data?: VNodeData, children?: Array<VNode>, text?: string, elm?: Node, context?: Component, componentOptions?: VNodeComponentOptions, asyncFactory?: () => void);
}
export interface VNodeData {
    key?: string | number;
    slot?: string;
    ref?: string;
    attrs?: {
        [key: string]: string;
    };
}
