'use strict';

const namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
};

const createBaseVNode = (tag = null, data = null, children = null, text = null, elm = null, context = null, componentOptions = null, asyncFactory = null) => {
    return {
        tag,
        key: null,
        data,
        children,
        text,
        elm,
        context,
        componentOptions,
        ns: null,
        isAsyncPlaceholder: false,
        asyncFactory
    };
};

const nodeOps = {
    createElement(tagName, vnode) {
        const elm = document.createElement(tagName);
        if (tagName !== 'select')
            return elm;
        if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined)
            elm.setAttribute('multiple', 'multiple');
        return elm;
    },
    createElementNS(namespace, tagName) {
        return document.createElementNS(namespaceMap[namespace], tagName);
    },
    createTextNode(text) {
        return document.createTextNode(text);
    },
    createComment(text) {
        return document.createComment(text);
    },
    insertBefore(parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    },
    removeChild(parentnode, child) {
        parentnode.removeChild(child);
    },
    appendChild(node, child) {
        node.appendChild(child);
    },
    parentNode(node) {
        return node.parentNode;
    },
    nextSibling(node) {
        return node.nextSibling;
    },
    tagName(node) {
        return node.tagName;
    },
    setTextContent(node, text) {
        node.textContent = text;
    },
    setStyleScoped(node, scopedId) {
        node.setAttribute(scopedId, '');
    }
};

const div = document.createElement('div');
const node = createBaseVNode(nodeOps.tagName(div).toLowerCase(), {}, [], undefined, div);
console.log(node);
