<template>
  <div>
    <form>
      <fieldset name="questions">
        <legend>Covid-19 Health Check Questions</legend>
        <article
          v-for="question in questions"
          :key="'question-' + question.id"
          :id="question.id"
          class="question"
        >
          <p class="statement">
            {{ question.statement }}
          </p>
          <div class="answer">
            <span
              v-for="reply in question.replies"
              :key="reply.label + reply.id"
            >
              <label> {{ reply.label }} </label>
              <input
                :id="`answer-${reply.id}__reply--${reply.label}`"
                type="radio"
                name="reply"
                :value="reply.value"
                v-model="question.answer"
              />
            </span>
            <span v-if="question.answer" style="float: right"> answered </span>
          </div>
        </article>
      </fieldset>

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
import { regex } from "@/utils/regex.js";
import * as rules from "@/utils/rules.js";

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
      questions: [
        {
          id: "one",
          statement:
            "Does one of your household members currently have a fever or shortness of breath complaints?",
          answer: null,
          replies: [
            {
              id: "1",
              label: "Yes",
              value: true,
            },
            {
              id: "1",
              label: "No",
              value: false,
            },
          ],
        },
      ],
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
    };
  },
  methods: {
    log(msg) {
      return console.log("log", msg);
    },
    getFormatPhoneNumber(value) {
      if (this.activeInput == "phone" && value) return value;

      if (value) {
        let res = null;
        let intPhoneMatch = regex.phone.INTERNATIONAL_PHONE_NUMBER.exec(value);
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
      let intPhoneMatch = regex.phone.INTERNATIONAL_PHONE_NUMBER.exec(value);
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
          rules.missingString.email.forEach((params) => {
            return this.checkMissingString(value, params);
          });
          rules.illegalString.email.forEach((params) => {
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
            this.errorIllegalString(value, regex.email.SPECIAL),
            this.errorMessages.illegalCharacter("First name")
          );
        },

        "last-name": () => {
          this.handleError(
            this.errorTooShort(value, 2),
            this.errorMessages.tooShort("Last name")
          );

          this.handleError(
            this.errorIllegalString(value, regex.email.SPECIAL),
            this.errorMessages.illegalCharacter("Last name")
          );
        },

        phone: () => {
          rules.missingString.phone.forEach((params) => {
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
            this.errorIllegalString(value, /(?<!^)[^\d\s()]/g),
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
      if (!value || value.length === 0) return null;
      let r = new RegExp(q);
      return !r.test(value);
    },
    errorTooShort(value, limit) {
      if (!value) return null;
      return value.length < limit && value.length >= 1 ? true : false;
    },
    errorTooLong(value, limit) {
      if (!value) return null;
      return value.length > limit ? true : false;
    },
    errorIllegalString(value, q) {
      if (!value) return null;
      let r = new RegExp(q);
      return r.test(value) ? true : null;
    },
  },
};
</script>
