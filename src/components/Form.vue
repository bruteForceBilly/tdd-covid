<template>
  <div>
    <form>
      <fieldset name="contact">
        <legend>Contact information</legend>
        <p v-for="field in fields" :key="field.id">
          <label :for="field.id"> {{ field.label }} </label>
          <input
            type="text"
            :id="field.id"
            :value="getValue(field)"
            @blur="setActiveInput(field.id)"
            @focus="setActiveInput(field.id)"
            @input="[setValue($event.target.value, field), validator($event)]"
          />
          <label v-if="errors" :for="field.id" class="error">
            {{ errors.filter((err) => err.includes(field.label)).toString() }}
          </label>
        </p>
      </fieldset>
    </form>
  </div>
</template>

<script>
const regex = {
  email: {
    DOMAIN_NAME: /(?<=@)[^.]+(?=\.|(?=$))/,
    LOCAL_PART: /((?<!@)^(\w+|\.)+)/,
    SPECIAL: /[^a-zA-Z\x7f-\xff]/g,
    TLD: /(\.+\w+)?(\.+\w+)$/,
  },
  phone: {
    COUNTRY_CODE: /^(?<prefix>\+|00)(?<country>[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)?/g,
    INTERNATIONAL_PHONE_NUMBER: /^(?<prefix>\+|00)(?<country>[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)(?:\(0\))?(?<number>\d{6,14})$/,
    LOCAL_PHONE_NUMBER: /^0+\d{9}$/,
  },
};

const emailMissingStringParams = [
  [/@/g, "Email address", "@"],
  [regex.email.DOMAIN_NAME, "Email address", "domain name"],
  [regex.email.TLD, "Email address", "top level domain"],
  [regex.email.LOCAL_PART, "Email address", "local part"],
];

const phoneMissingStringParams = [
  [/^0|\+/, "Phone number", "charachter: number must start with 0 or +"],
];

const emailIllegalStringParams = [
  [/\s/, "Email address", "white space"],
  [/\.$/, "Email address", "address ends with dot"],
  [/\.(?=@)/, "Email address", "local part ends with dot"],
  [/^\./, "Email address", "address starts with dot"],
  [/\.\./, "Email address", "has two consecutive dots"],
  [/@.*?(@)/, "Email address", "has multiple @ symbols"],
  [/'|"/, "Email address", "quotation marks"],
  [/(?<=@)[^.]+_/, "Email address", "underscore"],
];

Object.freeze(regex);
Object.freeze(emailMissingStringParams);
Object.freeze(emailMissingStringParams);
Object.freeze(emailIllegalStringParams);

export default {
  name: "Form",
  inheritAttrs: false,
  data() {
    return {
      activeInput: null,
      errors: [],
      errorMessages: {
        missingString: (target, string) => `${target} is missing ${string}`,
        tooShort: (stringValue) => `${stringValue} is too short`,
        tooLong: (stringValue) => `${stringValue} is too long`,
        illegalCharacter: (target, string = null) =>
          string != null
            ? `${target} has unallowed characters: ${string}`
            : `${target} has unallowed characters`,
      },
      email: null,
      fields: [
        {
          id: "first-name",
          label: "First name",
          value: "",
          errors: this.firstNameErrors,
        },
        {
          id: "last-name",
          label: "Last name",
          value: "",
          errors: this.lastNameErrors,
        },
        {
          id: "email",
          label: "Email",
          value: "",
          errors: this.emailErrors,
        },
        {
          id: "phone",
          label: "Phone",
          value: this.phone,
          errors: this.phoneErrors,
        },
      ],
      firstName: null,
      lastName: null,
      isInputActive: false,
      phoneDigits: null,
      r: regex,
      isMissing: {
        email: emailMissingStringParams,
        phone: phoneMissingStringParams,
      },
      isIllegal: {
        email: emailIllegalStringParams,
      },
    };
  },
  methods: {
    getFormatPhoneNumber(value) {
      if (this.activeInput == "phone" && value) {
        return value;
      } else if (value) {
        let res = null;
        let intPhoneMatch = this.r.phone.INTERNATIONAL_PHONE_NUMBER.exec(value);
        if (intPhoneMatch) {
          let { prefix, country, number } = intPhoneMatch.groups;
          prefix = prefix.replace(/^0{2}/g, "+");
          number = number.charAt(0) + " " + number.substr(1);
          res = prefix + country + " " + number;
        } else {
          res = value.replace(/(?<=^0\d)(?!$)/, " ");
        }
        return res;
      } else {
        return null;
      }
    },
    setFormatPhoneNumber(value) {
      let intPhoneMatch = this.r.phone.INTERNATIONAL_PHONE_NUMBER.exec(value);
      if (!intPhoneMatch) return value;
      let { prefix, country, number } = intPhoneMatch.groups;
      return prefix + country + number.replace(/^0/g, "");
    },
    getValue(field) {
      const { id, value } = field;
      return id == "phone" ? this.getFormatPhoneNumber(value) : value;
    },
    setValue(value, field) {
      return field.id === "phone"
        ? (field.value = this.setFormatPhoneNumber(value))
        : (field.value = value);
    },
    setActiveInput(inputId) {
      return this.activeInput === inputId
        ? (this.activeInput = null)
        : (this.activeInput = inputId);
    },
    checkMissingString(value, params) {
      let [r, target, message] = params;
      return this.handleError(
        this.errorMissingString(value, r),
        this.errorMessages.missingString(target, message)
      );
    },
    checkIllegalString(value, params) {
      let [r, target, message] = params;
      return this.handleError(
        this.errorIllegalString(value, r),
        this.errorMessages.illegalCharacter(target, message)
      );
    },
    validator(e) {
      const { id, value } = e.target;

      const fields = {
        email: () => {
          this.isMissing.email.forEach((params) => {
            return this.checkMissingString(value, params);
          });

          this.isIllegal.email.forEach((params) => {
            return this.checkIllegalString(value, params);
          });

          this.handleError(
            this.errorTooLong(value, 64),
            this.errorMessages.illegalCharacter(
              "Email address",
              "address is too long"
            )
          );
        },

        "first-name": () => {
          this.handleError(
            this.errorTooShort(value, 2),
            this.errorMessages.tooShort("First name")
          );
          this.handleError(
            this.errorIllegalString(value, this.r.email.SPECIAL),
            this.errorMessages.illegalCharacter("First name")
          );
        },

        "last-name": () => {
          this.handleError(
            this.errorTooShort(value, 2),
            this.errorMessages.tooShort("Last name")
          );

          this.handleError(
            this.errorIllegalString(value, this.r.email.SPECIAL),
            this.errorMessages.illegalCharacter("Last name")
          );
        },

        phone: () => {
          this.isMissing.phone.forEach((params) => {
            return this.checkMissingString(value, params);
          });

          this.handleError(
            this.errorTooShort(value, 10),
            this.errorMessages.tooShort("Phone number")
          );

          this.handleError(
            this.errorTooLong(value, 12),
            this.errorMessages.tooLong("Phone number")
          );

          this.handleError(
            this.errorIllegalString(value, /(?<!^)[^\d\s]/g),
            this.errorMessages.illegalCharacter("Phone number")
          );
        },
      };
      return fields[id]();
    },
    handleError(errCheckFn, errMsg) {
      return errCheckFn ? this.addError(errMsg) : this.deleteError(errMsg);
    },
    addError(err) {
      if (!this.errors.find((cv) => cv == err)) {
        this.errors.push(err);
      }
    },
    deleteError(err) {
      return (this.errors = this.errors.filter((cv) => !cv.includes(err)));
    },
    errorMissingString(value, q) {
      let res = null;
      let r = new RegExp(q);

      if (value.length > 0) {
        res = !r.test(value);
      }

      return res;
    },

    errorTooShort(value, limit) {
      let res = null;
      if (value != null) {
        value.length < limit && value.length >= 1
          ? (res = true)
          : (res = false);
      }
      return res;
    },

    errorTooLong(value, limit) {
      let res = null;
      if (value != null) {
        value.length > limit ? (res = true) : (res = false);
      }
      return res;
    },

    errorIllegalString(value, q) {
      let res = null;
      let r = new RegExp(q);
      if (r.test(value)) {
        res = true;
      }
      return res;
    },
  },
};
</script>
