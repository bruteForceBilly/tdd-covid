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
          v-model="firstName"
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
          v-model="lastName"
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
          v-model="email"
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
// email
// phone number

export default {
  name: "Form",
  data() {
    return {
      errors: [],
      errorMessages: {
        missingString: (target, string) => `${target} is missing ${string}`,
        tooShort: (stringValue) => `${stringValue} is too short`,
        specialCharacter: (stringValue) =>
          `${stringValue} has unallowed special characters`,
      },
      email: null,
      firstName: null,
      lastName: null,
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
  },
  methods: {
    validator(e) {
      const { id, value } = e.target;

      const fields = {
        email: () => {
          this.handleError(
            this.errorMissingString(value, /@/),
            this.errorMessages.missingString("Email address", "@")
          );

          this.handleError(
            this.errorMissingString(value, /(?<=((?<=@)[^.]+(?=\.))).+\w/),
            this.errorMessages.missingString(
              "Email address",
              "top level domain"
            )
          );
        },
        "first-name": () => {
          this.handleError(
            this.errorTooShort(value),
            this.errorMessages.tooShort("First name")
          );
          this.handleError(
            this.errorHasSpecialCharacter(value),
            this.errorMessages.specialCharacter("First name")
          );
        },
        "last-name": () => {
          this.handleError(
            this.errorTooShort(value),
            this.errorMessages.tooShort("Last name")
          );
          this.handleError(
            this.errorHasSpecialCharacter(value),
            this.errorMessages.specialCharacter("Last name")
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
    errorHasSpecialCharacter(value) {
      let res = null;
      let regex = new RegExp(/[^a-zA-Z\x7f-\xff]/g);

      if (regex.test(value)) {
        res = true;
      }
      return res;
    },
  },
};
</script>
