import { shallowMount } from "@vue/test-utils";
import AppButton from "@/AppButton.vue";

function createConfig (overrides) {
    const text = "hello";
    const propsData = { text };
    return Object.assign({ propsData }, overrides);
  }

const config = createConfig();
const wrapper = shallowMount(AppButton, config);

describe("AppButton.vue", () => {
  it("renders button element", () => {
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true)
  });
  it("renders text from prop text", () => {
    const button = wrapper.find('button');
    expect(button.text()).toBe('hello')
  });
});
