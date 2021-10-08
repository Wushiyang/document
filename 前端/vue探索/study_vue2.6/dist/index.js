'use strict';

const namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
};

noop;
noop;
noop;
if (process.env.NODE_ENV !== 'production') ;

const noop = () => {
};

class VNode {
    tag;
    data;
    children;
    text;
    elm;
    ns;
    context;
    key;
    componentOptions;
    componentInstance;
    parent;
    isStatic;
    isRootInsert;
    isComment;
    isCloned;
    isOnce;
    asyncFactory;
    asyncMeta;
    isAsyncPlaceholder;
    fnContext;
    fnOptions;
    fnScopeId;
    constructor(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.isStatic = false;
        this.isRootInsert = false;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.isAsyncPlaceholder = false;
        tag && (this.tag = tag);
        data && (this.data = data);
        children && (this.children = children);
        text && (this.text = text);
        elm && (this.elm = elm);
        context && (this.context = context);
        componentOptions && (this.componentOptions = componentOptions);
        asyncFactory && (this.asyncFactory = asyncFactory);
    }
}

new VNode('', {}, []);

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
    insertBefore(parentNode, newNode, referenceNode = null) {
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
const node = new VNode(nodeOps.tagName(div).toLowerCase(), {}, [], undefined, div);
console.log(node);
