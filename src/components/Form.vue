<template>
  <div>
    Hello this is form!
    <span class="message" v-if="firstNameError"
      >Error: First Name required to short</span
    >

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
      firstName: "",
    };
  },
  computed: {
    firstNameError() {
      return this.firstName.length < 2 ? true : false;
    },
  },
};
</script>
