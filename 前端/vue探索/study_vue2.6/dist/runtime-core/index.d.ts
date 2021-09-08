import { config } from './config';
import { VNode } from './vnode';
declare class Vue {
    $el: Element;
}
declare class Component {
    $el: Element;
}
interface VNodeComponentOptions {
    Ctor: Component;
    propsData: Record<string, unknown>;
}
export { config, Vue, VNode, Component, VNodeComponentOptions };
