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

describe("Name", () => {
  it("Has first name input field", () => {
    expect(
      wrapper.find("fieldset[name='contact'] #first-name[type='text']").exists()
    ).toBe(true);
  });

  //Displays error if not both name fields are filled in

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

describe("Email", () => {
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
    // hello.world@gmail <- should give error tld is missing, right now no error
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

  // local part cant end wigh dot

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

describe("Phone", () => {
  it("Has phone number input field", () => {
    expect(wrapper.find("#phone").exists()).toBe(true);
  });

  // 0123456789
  //  +31 6 CBBBBBBB

  it("Replaces starting digits 00 with + in number", async () => {
    await wrapper.find("#phone").setValue("0099123456789");
    expect(wrapper.find("#phone").element.value).toBe("+99123456789");
  });

  // it removes areacode null prefix (0) if present

  // it("Display error if no country code is entered", () => {
  //   await wrapper.find("#phone").setValue("0123456789");
  //    expect(wrapper.find("label[for='phone'].error").text()).toContain(
  //     "Phone number is missing country code"
  //   );

  //   await wrapper.find("#phone").setValue("+99123456789");
  //   expect(wrapper.find("label[for='phone'].error").exists()).toBe(false);
  // })

  // Displays error if alphabetic charachters

  // Displays error if special charachters except for + or paranthesis

  // Displays error if number has too few digits

  // Displays error if number has too many digits

  // Field should add international

  // +31 6 12 28 24 60
});
