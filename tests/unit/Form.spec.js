import { configFactory, wrapperFactory } from "./utils.js";
import Form from "@/components/Form.vue";
let wrapper, config;

beforeEach(() => {
  config = {
    propsData: {},
  };
  wrapper = wrapperFactory(Form, configFactory(config));
});

afterEach(() => {
  wrapper.destroy();
});

describe("Form.vue", () => {
  it("Is a Vvue instance", () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });
  it("Has a form element", () => {
    const form = wrapper.find("form");
    expect(form.exists()).toBe(true);
  });
  it("Has a fieldset named contact", () => {
    const contactFieldset = wrapper.find("fieldset[name='contact']");
    expect(contactFieldset.exists()).toBe(true);
  });
});

describe("Contact field inputs for name", () => {
  it("Has first name input field", () => {
    expect(
      wrapper.find("fieldset[name='contact'] #first-name[type='text']").exists()
    ).toBe(true);
  });

  it("Has last name input field", () => {
    expect(
      wrapper.find("fieldset[name='contact'] #last-name[type='text']").exists()
    ).toBe(true);
  });

  it("Displays error if name fields has text value length < 2", async () => {
    await wrapper.find("#first-name").setValue("x");
    expect(wrapper.find("label[for='first-name'].error").text()).toContain(
      "First name is too short"
    );

    await wrapper.find("#last-name").setValue("x");
    expect(wrapper.find("label[for='last-name'].error").text()).toContain(
      "Last name is too short"
    );
  });

  it("Does not display error for name fields that has text value length > 2", async () => {
    await wrapper.find("#first-name").setValue("xxxx");
    expect(wrapper.find("label[for='first-name'].error").exists()).toBe(false);

    await wrapper.find("#last-name").setValue("xxxx");
    expect(wrapper.find("label[for='last-name'].error").exists()).toBe(false);
  });

  it("Does not display name errors if users has not yet interacted", async () => {
    expect(wrapper.find("label[for='first-name'].error").exists()).toBe(false);
    expect(wrapper.find("label[for='last-name'].error").exists()).toBe(false);
  });

  it("Does not allow special charachters in names", async () => {
    await wrapper.find("#first-name").setValue("xx#");

    expect(wrapper.find("label[for='first-name'].error").text()).toContain(
      "First name has unallowed characters"
    );

    await wrapper.find("#last-name").setValue("xx#");

    expect(wrapper.find("label[for='last-name'].error").text()).toContain(
      "Last name has unallowed characters"
    );
  });
});

describe("Contact field email input", () => {
  it("Has email input field", () => {
    expect(wrapper.find("#email").exists()).toBe(true);
  });

  it("Display error if email adress has no @ charachter", async () => {
    await wrapper.find("#email").setValue("hello");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address is missing @"
    );
  });

  it("Display error if email adress has no domain name", async () => {
    await wrapper.find("#email").setValue("hello@.com");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address is missing domain name"
    );
  });

  it("Display error if email adress has no top level domain", async () => {
    await wrapper.find("#email").setValue("hello@world");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address is missing top level domain"
    );
  });

  it("Display error if email adress has no local part", async () => {
    await wrapper.find("#email").setValue("@world.com");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address is missing local part"
    );
  });

  it("Display error if email adress has local part longer than 64 charachters", async () => {
    await wrapper
      .find("#email")
      .setValue(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@world.com"
      );
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: address is too long"
    );
  });

  it("Displays error if address has white space", async () => {
    await wrapper.find("#email").setValue("hello @wo  rld.com");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: white space"
    );
  });

  it("Displays error if underscores is present in domain", async () => {
    await wrapper.find("#email").setValue("hello@wo_rld.com");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: underscore"
    );
    await wrapper.find("#email").setValue("he_llo@world.com");
    expect(wrapper.find("label[for='email'].error").exists()).toBe(false);
  });

  it("Displays error if email ends in a dot", async () => {
    await wrapper.find("#email").setValue("hello@world.co.uk.");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: address ends with dot"
    );
  });

  it("Displays error if email starts with a dot", async () => {
    await wrapper.find("#email").setValue(".hello.world.@globe.co.uk");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: address starts with dot"
    );
  });

  it("Displays error if email adress has consecutive dots", async () => {
    await wrapper.find("#email").setValue("hello@world..com");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: has two consecutive dots"
    );
  });

  it("Displays error if email adress has two multiple @ symbols", async () => {
    await wrapper.find("#email").setValue("hello@@world.com");
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: has multiple @ symbols"
    );
  });

  it("Displays error if email adress has quotation marks", async () => {
    await wrapper.find("#email").setValue(`hello"world"@globe.com`);
    expect(wrapper.find("label[for='email'].error").text()).toContain(
      "Email address has unallowed characters: quotation marks"
    );
  });
});
