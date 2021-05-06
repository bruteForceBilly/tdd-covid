import { configFactory, wrapperFactory } from "./utils.js";
import Form from "@/components/Form.vue";
let wrapper;

beforeEach(() => {
  const config = {
    propsData: {},
  };
  wrapper = wrapperFactory(Form, configFactory(config));
});

afterEach(() => {
  wrapper.destroy();
});

describe("Form.vue", () => {
  it("is a Vvue instance", () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });
  it("has a form element", () => {
    const form = wrapper.find("form");
    expect(form.exists()).toBe(true);
  });
  it("has a fieldset named contact", () => {
    const contactFieldset = wrapper.find("fieldset[name='contact']");
    expect(contactFieldset.exists()).toBe(true);
  });
});
