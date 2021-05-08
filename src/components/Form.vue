<template>
  <div>
    <span class="firstNameError" v-if="firstNameError">
      Error: First name is too short
    </span>

    <span class="lastNameError" v-if="lastNameError">
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
export default {
  name: "Form",
  data() {
    return {
      errors: [],
      firstName: "",
      lastName: "",
    };
  },
  computed: {
    firstNameError() {
      return this.firstName.length < 2 ? true : false;
    },
    lastNameError() {
      return this.lastName.length < 2 ? true : false;
    },
  },
};
</script>
