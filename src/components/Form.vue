<template>
  <div>
    <form>
      <fieldset name="contact">
        <legend>Contact information</legend>

        <p>
          <label for="first-name"> First name </label>
          <input
            type="text"
            id="first-name"
            v-model.trim="firstName"
            @input="validator($event)"
          />
          <label v-if="firstNameErrors" for="first-name" class="error">{{
            firstNameErrors
          }}</label>
        </p>

        <p>
          <label for="last-name"> Last name </label>
          <input
            type="text"
            id="last-name"
            v-model.trim="lastName"
            @input="validator($event)"
          />
          <label v-if="lastNameErrors" for="last-name" class="error">{{
            lastNameErrors
          }}</label>
        </p>

        <p>
          <label for="email"> Email </label>
          <input
            type="text"
            id="email"
            v-model.trim="email"
            @input="validator($event)"
          />
          <label v-if="emailErrors" for="email" class="error">{{
            emailErrors
          }}</label>
        </p>

        <p>
          <label for="phone"> Phone {{ isInputActive }} </label>
          <input
            type="text"
            id="phone"
            v-model="phoneNumber"
            @blur="isInputActive = false"
            @focus="isInputActive = true"
            @input="validator($event)"
          />
          <label v-if="phoneErrors" for="phone" class="error">{{
            phoneErrors
          }}</label>
        </p>
      </fieldset>
    </form>
  </div>
</template>

<script>
// move to mixin later
const regex = {
  email: {
    AT_SYMBOL: /@/,
    AT_SYMBOLS_MULTIPLE: /@.*?(@)/,
    DOMAIN_NAME: /(?<=@)[^.]+(?=\.|(?=$))/,
    DOT: /\./,
    DOTS_CONSECUTIVE: /\.\./,
    LOCAL_PART: /(?<!@)^(\w+|\.)+/,
    UNDERSCORE: /_/,
    SPECIAL: /[^a-zA-Z\x7f-\xff]/g,
    TLD: /(\.+\w+)?(\.+\w+)/,
    WHITE_SPACE: /\s/,
    QUOTATION_MARKS: /'|"/,
  },
  phone: {
    COUNTRY_CODE: /^(?<prefix>\+|00)(?<country>[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)?/g,
    INTERNATIONAL_PHONE_NUMBER: /^(?<prefix>\+|00)(?<country>[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)(?:\(0\))?(?<number>\d{6,14})$/,
    LOCAL_PHONE_NUMBER: /^0+\d{9}$/,
  },
};

Object.freeze(regex);

export default {
  name: "Form",
  data() {
    return {
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
      firstName: null,
      lastName: null,
      isInputActive: false,
      phoneDigits: null,
      r: regex,
    };
  },
  computed: {
    emailErrors() {
      let filtered = this.errors.filter((err) => err.includes("Email"));
      return filtered.toString();
    },
    phoneErrors() {
      let filtered = this.errors.filter((err) => err.includes("Phone"));
      return filtered.toString();
    },
    firstNameErrors() {
      let filtered = this.errors.filter((err) => err.includes("First name"));
      return filtered.toString();
    },
    lastNameErrors() {
      let filtered = this.errors.filter((err) => err.includes("Last name"));
      return filtered.toString();
    },
    emailAddressDomain() {
      return this.email !== null
        ? this.email.match(this.r.email.DOMAIN_NAME)
        : null;
    },
    emailAddressLastCh() {
      return this.email !== null
        ? this.email.charAt(this.email.length - 1)
        : null;
    },
    emailAddressFirstCh() {
      return this.email !== null ? this.email.charAt(0) : null;
    },
    phoneNumber: {
      get: function () {
        if (this.isInputActive && this.phoneDigits) {
          return this.phoneDigits.toString();
        } else if (this.phoneDigits) {
          let res = null;

          let intPhoneMatch = this.r.phone.INTERNATIONAL_PHONE_NUMBER.exec(
            this.phoneDigits
          );

          if (intPhoneMatch) {
            let { prefix, country, number } = intPhoneMatch.groups;
            prefix = prefix.replace(/^0{2}/g, "+");
            number = number.charAt(0) + " " + number.substr(1);
            res = prefix + country + " " + number;
          } else {
            res = this.phoneDigits.replace(/(?<=^0\d)(?!$)/, " ");
          }

          return res;
        } else {
          return null;
        }
      },
      set: function (value) {
        let intPhoneMatch = this.r.phone.INTERNATIONAL_PHONE_NUMBER.exec(value);

        if (intPhoneMatch) {
          let { prefix, country, number } = intPhoneMatch.groups;
          //prefix = prefix.replace(/^\+/g, "00");
          this.phoneDigits = prefix + country + number.replace(/^0/g, "");
        } else {
          this.phoneDigits = value;
        }
      },
    },
  },
  methods: {
    validator(e) {
      const { id, value } = e.target;
      const fields = {
        email: () => {
          this.handleError(
            this.errorMissingString(value, this.r.email.AT_SYMBOL),
            this.errorMessages.missingString("Email address", "@")
          );

          this.handleError(
            this.errorMissingString(value, this.r.email.DOMAIN_NAME),
            this.errorMessages.missingString("Email address", "domain name")
          );

          this.handleError(
            this.errorMissingString(value, this.r.email.TLD),
            this.errorMessages.missingString(
              "Email address",
              "top level domain"
            )
          );

          this.handleError(
            this.errorMissingString(value, this.r.email.LOCAL_PART),
            this.errorMessages.missingString("Email address", "local part")
          );

          this.handleError(
            this.errorTooLong(value, 64),
            this.errorMessages.illegalCharacter(
              "Email address",
              "address is too long"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.email.WHITE_SPACE),
            this.errorMessages.illegalCharacter("Email address", "white space")
          );

          this.handleError(
            this.errorIllegalCharacter(
              this.emailAddressDomain,
              this.r.email.UNDERSCORE
            ),
            this.errorMessages.illegalCharacter("Email address", "underscore")
          );

          this.handleError(
            this.errorIllegalCharacter(
              this.emailAddressLastCh,
              this.r.email.DOT
            ),
            this.errorMessages.illegalCharacter(
              "Email address",
              "address ends with dot"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(
              this.emailAddressFirstCh,
              this.r.email.DOT
            ),
            this.errorMessages.illegalCharacter(
              "Email address",
              "address starts with dot"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.email.DOTS_CONSECUTIVE),
            this.errorMessages.illegalCharacter(
              "Email address",
              "has two consecutive dots"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.email.AT_SYMBOLS_MULTIPLE),
            this.errorMessages.illegalCharacter(
              "Email address",
              "has multiple @ symbols"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.email.QUOTATION_MARKS),
            this.errorMessages.illegalCharacter(
              "Email address",
              "quotation marks"
            )
          );
        },

        "first-name": () => {
          this.handleError(
            this.errorTooShort(value, 2),
            this.errorMessages.tooShort("First name")
          );
          this.handleError(
            this.errorIllegalCharacter(value, this.r.email.SPECIAL),
            this.errorMessages.illegalCharacter("First name")
          );
        },

        "last-name": () => {
          this.handleError(
            this.errorTooShort(value, 2),
            this.errorMessages.tooShort("Last name")
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.email.SPECIAL),
            this.errorMessages.illegalCharacter("Last name")
          );
        },

        phone: () => {
          this.handleError(
            this.errorMissingString(value, /^0|\+/),
            this.errorMessages.missingString(
              "Phone number",
              "charachter: number must start with 0 or +"
            )
          );

          this.handleError(
            this.errorTooShort(value, 10),
            this.errorMessages.tooShort("Phone number")
          );

          this.handleError(
            this.errorTooLong(value, 12),
            this.errorMessages.tooLong("Phone number")
          );

          this.handleError(
            this.errorIllegalCharacter(value, /(?<!^)[^\d\s]/g),
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

    // errorIllegalLength dfines legal length 3

    // errorIllegalString
    errorIllegalCharacter(value, q) {
      let res = null;
      let r = new RegExp(q);
      if (r.test(value)) {
        res = true;
      }
      return res;
    },
  },

  // the issue of mutating value before passing it in validator
  // issue of accruing error messages to designated field
};
</script>
