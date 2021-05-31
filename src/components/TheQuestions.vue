<template>
  <div>
    <fieldset name="questions">
      <legend>Covid-19 Health Check Questions</legend>
      <article
        v-for="question in presentedQuestions"
        :key="question.id"
        :id="question.id"
        class="question"
      >
        <p class="statement">
          {{ question.statement }}
        </p>
        <div class="answer">
          <span
            class="reply"
            v-for="reply in question.replies"
            :key="reply.label + reply.id"
          >
            <label> {{ reply.label }} </label>
            <input
              :id="reply.id"
              type="radio"
              :name="question.id"
              :value="reply.value"
              v-model="question.answer"
            />
          </span>
          <span
            class="status"
            v-if="question.answer !== null"
            style="float: right"
          >
            answered
          </span>
          <span class="status" v-else style="float: right">
            {{ question.id === nextQuestion.id ? "asking" : "" }}
          </span>
        </div>
      </article>
    </fieldset>
    <figure v-if="mandatoryQuestionFail" id="notification-bar">
      <p>Sorry, it is not possible to complete your registration.</p>
    </figure>

    <figure v-else-if="!hasUnansweredQuestions" id="notification-bar">
      <p>Great! You have completed all questions.</p>
    </figure>
  </div>
</template>

<script>
export default {
  name: "Questions",
  data() {
    return {
      questions: [
        {
          id: "q1",
          mandatoryReplyValue: false,
          statement:
            "Did you have one or more of the following symptoms in the past 24 hours ?",
          answer: null,
          replies: [
            {
              id: "q1a1",
              label: "Yes",
              value: true,
            },
            {
              id: "q1a2",
              label: "No",
              value: false,
            },
          ],
        },
        {
          id: "q2",
          mandatoryReplyValue: false,
          statement:
            "Does one of your household members currently have a fever or shortness of breath complaints?",
          answer: null,
          replies: [
            {
              id: "q2a1",
              label: "Yes",
              value: true,
            },
            {
              id: "q2a2",
              label: "No",
              value: false,
            },
          ],
        },
        {
          id: "q3",
          mandatoryReplyValue: false,
          statement:
            "Did you have a (laboratory confirmed) coronavirus infection the past 7 days?",
          answer: null,
          replies: [
            {
              id: "q3a1",
              label: "Yes",
              value: true,
            },
            {
              id: "q3a2",
              label: "No",
              value: false,
            },
          ],
        },
        {
          id: "q4",
          mandatoryReplyValue: false,
          statement:
            "Does/Did someone in your household have a COVID-19 infection, and have you been in contact with them the past 10 days while they still showed symptoms?",
          answer: null,
          replies: [
            {
              id: "q4a1",
              label: "Yes",
              value: true,
            },
            {
              id: "q4a2",
              label: "No",
              value: false,
            },
          ],
        },
        {
          id: "q5",
          mandatoryReplyValue: null,
          statement:
            "About your visit to us: does the group consist only members of the same household?",
          answer: null,
          replies: [
            {
              id: "q5a1",
              label: "Yes",
              value: true,
            },
            {
              id: "q5a2",
              label: "No",
              value: false,
            },
          ],
        },
      ],
    };
  },
  computed: {
    hasUnansweredQuestions() {
      return this.questions.some((q) => q.answer === null);
    },
    mandatoryQuestionFail() {
      return this.questions.some(
        (q) =>
          q.mandatoryReplyValue !== null &&
          q.answer !== null &&
          q.answer !== q.mandatoryReplyValue
      );
    },
    nextQuestion() {
      return this.questions.find((q) => q.answer === null);
    },
    presentedQuestions() {
      return this.mandatoryQuestionFail
        ? this.questions.filter((q) => q.answer !== null)
        : this.questions.filter(
            (q) => q.answer !== null || q.id === this.nextQuestion.id
          );
    },
  },
  methods: {
    isCompleted(bool) {
      return this.$emit("isCompleted", bool);
    },
  },
  watch: {
    questions: {
      deep: true,
      handler: function () {
        !this.hasUnansweredQuestions && !this.mandatoryQuestionFail
          ? this.isCompleted(true)
          : this.isCompleted(false);
      },
    },
  },
};
</script>
