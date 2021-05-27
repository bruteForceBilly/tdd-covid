import { regex } from "./regex.js";

const illegalString = {
  email: [
    [/\s/, "Email address", "white space"],
    [/\.$/, "Email address", "address ends with dot"],
    [/\.(?=@)/, "Email address", "local part ends with dot"],
    [/^\./, "Email address", "address starts with dot"],
    [/\.\./, "Email address", "has two consecutive dots"],
    [/@.*?(@)/, "Email address", "has multiple @ symbols"],
    [/'|"/, "Email address", "quotation marks"],
    [/(?<=@)[^.]+_/, "Email address", "underscore"],
  ],
};

const missingString = {
  email: [
    [/@/g, "Email address", "@"],
    [regex.email.DOMAIN_NAME, "Email address", "domain name"],
    [regex.email.TLD, "Email address", "top level domain"],
    [regex.email.LOCAL_PART, "Email address", "local part"],
  ],
  phone: [
    [/^0|\+/, "Phone number", "charachter: number must start with 0 or +"],
  ],
};

export { missingString, illegalString };
