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

const createBaseVNode = (tag, data, children, text, elm, context, componentOptions, asyncFactory) => {
    const vn = {
        isStatic: false,
        isRootInsert: false,
        isComment: false,
        isCloned: false,
        isAsyncPlaceholder: false
    };
    tag && (vn.tag = tag);
    data && (vn.data = data);
    children && (vn.children = children);
    text && (vn.text = text);
    elm && (vn.elm = elm);
    context && (vn.context = context);
    componentOptions && (vn.componentOptions = componentOptions);
    asyncFactory && (vn.asyncFactory = asyncFactory);
    return vn;
};

createBaseVNode('', {}, []);

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
