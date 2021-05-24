<template>
  <div>
    <form>
      <fieldset name="contact">
        <legend>Contact information</legend>

        <label for="first-name"> First name </label>
        <br />
        <input
          type="text"
          id="first-name"
          v-model.trim="firstName"
          @input="validator($event)"
        />
        <label v-if="firstNameErrors" for="first-name" class="error">{{
          firstNameErrors
        }}</label>
        <br />

        <label for="last-name"> Last name </label>
        <br />
        <input
          type="text"
          id="last-name"
          v-model.trim="lastName"
          @input="validator($event)"
        />
        <label v-if="lastNameErrors" for="last-name" class="error">{{
          lastNameErrors
        }}</label>
        <br />

        <label for="email"> Email </label>
        <br />
        <input
          type="text"
          id="email"
          v-model.trim="email"
          @input="validator($event)"
        />
        <label v-if="emailErrors" for="email" class="error">{{
          emailErrors
        }}</label>
      </fieldset>
    </form>
  </div>
</template>

<script>
// move to mixin later
const regex = {
  AT_SYMBOL: /@/,
  AT_SYMBOLS_MULTIPLE: /@.*?(@)/,
  DOMAIN: /(?<=@)[^.]+(?=\.|(?=$))/,
  DOT: /\./,
  CONSECUTIVE_DOTS: /\.\./,
  LOCAL: /(?<!@)^(\w+|\.)+/,
  UNDERSCORE: /_/,
  SPECIAL: /[^a-zA-Z\x7f-\xff]/g,
  TLD: /(\.+\w+)?(\.+\w+)/,
  WHITE_SPACE: /\s/,
  QUOTATION_MARKS: /'|"/,
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
      r: regex,
    };
  },
  computed: {
    emailErrors() {
      let filtered = this.errors.filter((err) => err.includes("Email"));
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
      return this.email !== null ? this.email.match(this.r.DOMAIN) : null;
    },
    emailAddressLastCh() {
      return this.email !== null
        ? this.email.charAt(this.email.length - 1)
        : null;
    },
    emailAddressFirstCh() {
      return this.email !== null ? this.email.charAt(0) : null;
    },
  },
  methods: {
    validator(e) {
      const { id, value } = e.target;
      const fields = {
        email: () => {
          this.handleError(
            this.errorMissingString(value, this.r.AT_SYMBOL),
            this.errorMessages.missingString("Email address", "@")
          );

          this.handleError(
            this.errorMissingString(value, this.r.DOMAIN),
            this.errorMessages.missingString("Email address", "domain name")
          );

          this.handleError(
            this.errorMissingString(value, this.r.TLD),
            this.errorMessages.missingString(
              "Email address",
              "top level domain"
            )
          );

          this.handleError(
            this.errorMissingString(value, this.r.LOCAL),
            this.errorMessages.missingString("Email address", "local part")
          );

          this.handleError(
            this.errorTooLong(value),
            this.errorMessages.illegalCharacter(
              "Email address",
              "address is too long"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.WHITE_SPACE),
            this.errorMessages.illegalCharacter("Email address", "white space")
          );

          this.handleError(
            this.errorIllegalCharacter(
              this.emailAddressDomain,
              this.r.UNDERSCORE
            ),
            this.errorMessages.illegalCharacter("Email address", "underscore")
          );

          this.handleError(
            this.errorIllegalCharacter(this.emailAddressLastCh, this.r.DOT),
            this.errorMessages.illegalCharacter(
              "Email address",
              "address ends with dot"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(this.emailAddressFirstCh, this.r.DOT),
            this.errorMessages.illegalCharacter(
              "Email address",
              "address starts with dot"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.CONSECUTIVE_DOTS),
            this.errorMessages.illegalCharacter(
              "Email address",
              "has two consecutive dots"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.AT_SYMBOLS_MULTIPLE),
            this.errorMessages.illegalCharacter(
              "Email address",
              "has multiple @ symbols"
            )
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.QUOTATION_MARKS),
            this.errorMessages.illegalCharacter(
              "Email address",
              "quotation marks"
            )
          );
        },

        "first-name": () => {
          this.handleError(
            this.errorTooShort(value),
            this.errorMessages.tooShort("First name")
          );
          this.handleError(
            this.errorIllegalCharacter(value, this.r.SPECIAL),
            this.errorMessages.illegalCharacter("First name")
          );
        },

        "last-name": () => {
          this.handleError(
            this.errorTooShort(value),
            this.errorMessages.tooShort("Last name")
          );

          this.handleError(
            this.errorIllegalCharacter(value, this.r.SPECIAL),
            this.errorMessages.illegalCharacter("Last name")
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

    errorTooShort(value) {
      let res = null;
      if (value != null) {
        value.length < 2 && value.length >= 1 ? (res = true) : (res = false);
      }
      return res;
    },

    errorTooLong(value) {
      let res = null;
      if (value != null) {
        value.length > 64 ? (res = true) : (res = false);
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
