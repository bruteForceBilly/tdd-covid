<template>
  <div>
    <form>
      <fieldset name="contact">
        <input
          type="text"
          id="first-name"
          v-model="firstName"
          @input="validator($event)"
        />
        {{ firstNameErrors }}
        <br />
        <input
          type="text"
          id="last-name"
          v-model="lastName"
          @input="validator($event)"
        />
        {{ lastNameErrors }}
        <br />
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
      errors: [],
      errorMessages: {
        tooShort: (name) => `${name} is too short`,
        specialCharacter: (name) => `${name} has unallowed special characters`,
      },
      firstName: null,
      lastName: null,
    };
  },
  computed: {
    firstNameErrors() {
      let filtered = this.errors.filter((err) => err.includes("first name"));
      return filtered;
    },
    lastNameErrors() {
      let filtered = this.errors.filter((err) => err.includes("last name"));
      return filtered;
    },
  },
  methods: {
    validator(e) {
      const { id, value } = e.target;
      const fields = {
        "first-name": () => {
          this.errorTooShort(value)
            ? this.addError(this.errorMessages.tooShort("first name"))
            : this.deleteError(this.errorMessages.tooShort("first name"));
          this.errorHasSpecialCharacter(value)
            ? this.addError(this.errorMessages.specialCharacter("first name"))
            : this.deleteError(
                this.errorMessages.specialCharacter("first name")
              );
        },
        "last-name": () => {
          this.errorTooShort(value)
            ? this.addError(this.errorMessages.tooShort("last name"))
            : this.deleteError(this.errorMessages.tooShort("last name"));
          this.errorHasSpecialCharacter(value)
            ? this.addError(this.errorMessages.specialCharacter("last name"))
            : this.deleteError(
                this.errorMessages.specialCharacter("last name")
              );
        },
      };
      return fields[id]();
    },
    addError(err) {
      if (!this.errors.find((cv) => cv == err)) {
        this.errors.push(err);
      }
    },
    deleteError(err) {
      return (this.errors = this.errors.filter((cv) => !cv.includes(err)));
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
      if (value.includes("#")) {
        res = true;
      }
      return res;
    },
  },
};
</script>
