import { configFactory, wrapperFactory } from "./utils.js";
import TheQuestions from "@/components/TheQuestions.vue";
import Form from "@/components/Form.vue";

let wrapper = null;
let config = null;

beforeEach(() => {
  config = {
    propsData: {},
  };
  wrapper = wrapperFactory(TheQuestions, configFactory(config));
});

afterEach(() => {
  wrapper.destroy();
});

const completeQuestionnaire = async () => {
  const questionIds = wrapper.vm._data.questions.map((q) => q.id);
  for (const id of questionIds) {
    await wrapper.find(`#${id}a2`).trigger("click");
  }
};

// test naming convention of id's #q1 denotes the first question
// test naming convention of id's #q1a0 denotes false
// test naming convention of id's #q1a0 denotes true

describe("Questions", () => {
  it("Has a fieldset named questions", () => {
    const questions = wrapper.find("fieldset[name='questions']");
    expect(questions.exists()).toBe(true);
  });
  it("Has a question", () => {
    const question = wrapper.find("fieldset[name='questions'] .question");
    expect(question.exists()).toBe(true);
  });

  it("Question has a statement message", () => {
    const statement = wrapper.find(".question .statement");
    expect(statement.text()).not.toHaveLength(0);
  });
  it("Question has an answer area", () => {
    const answer = wrapper.find(".question .answer");
    expect(answer.exists()).toBe(true);
  });

  it("Answer area has a yes reply", () => {
    const reply = wrapper.find("#q1a1");
    expect(reply.exists()).toBe(true);
  });

  it("Answer area has a no reply", () => {
    const reply = wrapper.find("#q1a2");
    expect(reply.exists()).toBe(true);
  });

  it("All replies has labels", () => {
    const replies = wrapper.findAll(".question .answer input[type='radio']");
    const labels = wrapper.findAll(".question .answer label");
    expect(replies.length).toBe(labels.length);
  });

  it("Question has a status", () => {
    expect(wrapper.find(".status").exists()).toBe(true);
  });

  it("Replying yes sets question status as answered", async () => {
    const reply = wrapper.find("#q1a1");
    await reply.trigger("click");
    expect(wrapper.find("#q1 .status").text()).toContain("answered");
  });

  it("Only one question has status asking", async () => {
    await wrapper.find("#q1a2").trigger("click");
    await wrapper.find("#q2a2").trigger("click");
    expect(
      wrapper.findAll(".status").filter((node) => node.text().match(/asking/))
        .length
    ).toBe(1);
  });

  it("Only question that has been answered or being asked is shown", async () => {
    await wrapper.find("#q1a2").trigger("click");
    await wrapper.find("#q2a2").trigger("click");
    expect(wrapper.findAll(".question").length).toBe(3);
  });

  it("Does not render questions that has not been asked or answered", () => {
    expect(
      wrapper
        .findAll(".status")
        .filter((node) => node.text().match(/^(?![\s\S])/)).length
    ).toBe(0);
  });

  it("Initially displays the first question of all question as asking", () => {
    expect(wrapper.find(".question").text()).toContain("asking");
  });
});

describe("Notifications", () => {
  // How do I assert that the question mandatory reply value is true or fale?
  // Currently it is implied that reply value true violates the mandatory reply value
  it("Displays warning message if a question with mandatory negative reply in answered positive", async () => {
    expect(wrapper.find("#notification-bar").exists()).toBe(false);
    await wrapper.find("#q1a1").trigger("click");
    expect(wrapper.find("#notification-bar").text()).toContain(
      "Sorry, it is not possible to complete your registration."
    );
  });

  it("Asking question is hidden when warning message is shown", async () => {
    await wrapper.find("#q1a1").trigger("click");
    expect(wrapper.find("#notification-bar").text()).toContain(
      "Sorry, it is not possible to complete your registration."
    );
    expect(
      wrapper.findAll(".question").filter((node) => node.text().match(/asking/))
        .length
    ).toBe(0);
  });

  it("Notifys success message if all question are completed", async () => {
    expect(wrapper.find("#notification-bar").exists()).toBe(false);

    await completeQuestionnaire();

    expect(wrapper.find("#notification-bar").text()).toContain(
      "Great! You have completed all questions."
    );
  });

  it("Emits isCompleted event with payload value true when all questions has been successfully answered", async () => {
    await completeQuestionnaire();
    expect(wrapper.emitted().isCompleted.flat().pop()).toEqual(true);
  });

  it("Emits isCompleted event with payload value false if a mandatory question has been negated after completing all questions successfully", async () => {
    await completeQuestionnaire();
    await wrapper.find(`#q1a1`).trigger("click");
    expect(wrapper.emitted().isCompleted.flat().pop()).toEqual(false);
  });
});
