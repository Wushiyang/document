import { VNode } from '../runtime-core';
export declare type nodeOps = typeof nodeOps;
export declare const nodeOps: {
    createElement(tagName: string, vnode: VNode): Element;
    createElementNS(namespace: string, tagName: string): Element;
    createTextNode(text: string): Text;
    createComment(text: string): Comment;
    insertBefore(parentNode: Node, newNode: Node, referenceNode: Node): void;
    removeChild(node: Node, child: Node): void;
    appendChild(node: Node, child: Node): void;
    parentNode(node: Node): Node | void;
    nextSibling(node: Node): Node | void;
    tagName(node: Element): string;
    setTextContent(node: Node, text: string): void;
    setStyleScoped(node: Element, scopedId: string): void;
};
