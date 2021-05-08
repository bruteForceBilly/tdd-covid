<template>
  <div>
    <span class="message" v-if="firstNameError">
      Error: First Name is too short
    </span>

    <form>
      <fieldset name="contact">
        <input type="text" id="first-name" v-model="firstName" />
      </fieldset>
    </form>
  </div>
</template>

<script>
//  Error: First Name required to short

export default {
  name: "Form",
  data() {
    return {
      firstName: "x",
    };
  },
  computed: {
    firstNameError() {
      return this.firstName.length < 2 ? true : false;
    },
  },
};
</script>
