<template>
  <div @input="log($event)">
    <span class="firstNameError" v-if="firstNameTooShortError">
      Error: First name is too short
    </span>

    <span class="lastNameError" v-if="lastNameTooShortError">
      Error: Last name is too short
    </span>

    <form>
      <fieldset name="contact">
        <input type="text" id="first-name" v-model="firstName" />
        <input type="text" id="last-name" v-model="lastName" />
      </fieldset>
    </form>
  </div>
</template>

<script>
// @input="validate($event)"

// @error="alert($event.target.value)"

// v-bind instead of v-model

export default {
  name: "Form",
  data() {
    return {
      firstName: null,
      lastName: null,
    };
  },
  computed: {
    firstNameTooShortError() {
      let res = null;

      if (this.firstName != null) {
        this.firstName.length < 2 && this.firstName.length >= 1
          ? (res = true)
          : (res = false);
      }
      return res;
    },
    lastNameTooShortError() {
      let res = null;

      if (this.lastName != null) {
        this.lastName.length < 2 && this.lastName.length >= 1
          ? (res = true)
          : (res = false);
      }
      return res;
    },
  },
  methods: {
    log(e) {
      console.log(e.target.value, this._data);
    },
  },
};
</script>
