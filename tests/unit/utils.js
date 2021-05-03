import { shallowMount } from "@vue/test-utils";

const configFactory = function (overrides) {
    const propsData = {};
    return Object.assign({ propsData }, overrides);
}

const wrapperFactory = (component, conf, computed = {}) => {
    return shallowMount(component, { ...conf, ...computed });
};

export { configFactory, wrapperFactory };
