import { localStorageService } from '@/composables/store';
import { defaultOptions, questionTypes } from '@/constants/question';
import { type QuestionType } from '@/models/question';
import { type QuizRequest } from '@/models/request/quiz';
import router from '@/router';
import { quizService } from '@/services/quiz';
import { reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components';

export class CreateQuizViewModel {
  form = ref<InstanceType<typeof VForm> | null>(null);
  valid = ref(false);
  readonly rules = {
    required: (value: unknown) => !!value || 'Required.',
    positiveNumber: (value: number) => value > 0 || 'Must be a positive number',
    selectRquired: (value: unknown) => (value !== null && value !== undefined) || 'Please select an option',
  };

  readonly optionRules = () => {
    return [this.rules.required]; // Apply required rule for other types
  };
  readonly questionTypes = questionTypes

  readonly showConfirmation = ref(false);
  readonly confirmLoading = ref(false);
  private readonly changingQuestionIndex = ref<number | null>(null);
  private readonly changingQuestionType = ref<QuestionType | null>(null)

  readonly quiz: QuizRequest = reactive({
    id: null,
    title: '',
    description: '',
    userId: localStorageService.getUser()?.userId ?? '',
    questions: [
      {
        id: crypto.randomUUID(),
        type: this.questionTypes[0], // This should be a valid QuestionType object from questionTypes
        text: '',
        timeLimit: 60,
        options: defaultOptions(this.questionTypes[0].type),
        isCustomize: null,
      },
    ],
  });

  readonly addQuestion = () => {
    this.quiz.questions.push({
      id: crypto.randomUUID(),
      type: this.questionTypes[0],
      text: '',
      timeLimit: 60,
      options: defaultOptions(this.questionTypes[0].type),
      isCustomize: null,
    });
  };

  readonly removeQuestion = (index: number) => {
    this.quiz.questions.splice(index, 1);
  };

  readonly addOption = (questionIndex: number) => {
    this.quiz.questions[questionIndex].options!.push({
      id: crypto.randomUUID(),
      optionText: '',
      correct: false,
    });
  };

  readonly isMultitpleChoice = (questionType: QuestionType | string ): boolean => {
    if (typeof questionType === 'string') {
      return questionType === 'MULTIPLE_CHOICE';
    }
    return questionType.type === 'MULTIPLE_CHOICE';
  }

  readonly isYesNOOrTrueFalse = (questionType: QuestionType | string ): boolean => {

    if (typeof questionType === 'string') {
      return questionType !== 'MULTIPLE_CHOICE';
    }
    return questionType.type !== 'MULTIPLE_CHOICE';
  }

  readonly handleLabelCustomizeChange = (value: boolean | null, questionIndex: number) => {
    this.quiz.questions[questionIndex].isCustomize = value
  }

  readonly textfiledYesNoOrTrueFalseState = (questionIndex: number) : boolean => {
    const question = this.quiz.questions[questionIndex];
    if(this.isYesNOOrTrueFalse(question.type)) {
      return !question.isCustomize;
    }
    return false;
  }

  readonly removeOption = (questionIndex: number, optionIndex: number) => {
    const question = this.quiz.questions[questionIndex]
    const isCorrectOption = question.options![optionIndex].correct;
    this.quiz.questions[questionIndex].options!.splice(optionIndex, 1);
    // Check remove on option which that correct we will update index correct to 0
    if (isCorrectOption) {
      // As only question type multipleChoice that can remove
      // So we will no need to check for the codition question type
      this.handleCorrectChange(questionIndex, 0);
    }
  };

  readonly handleCorrectChange = (questionIndex: number, optionIndex: number) => {
    const questionType = this.quiz.questions[questionIndex].type;
    if (this.isMultitpleChoice(questionType)) {
      this.quiz.questions[questionIndex].options!.forEach((option, index) => {
        option.correct = index === optionIndex;
      });
    }
  };

  readonly handleTrueFalseChange = (questionIndex: number, optionIndex: number) => {
    let correctAnswer: boolean = true;
    this.quiz.questions[questionIndex].options!.forEach((option, index) => {
      option.correct = index === optionIndex;
      // The Yes/True answer is in index: 0
      // The No/False answer is in index: 1
      if (index === optionIndex) {
        correctAnswer = index == 0 ? true : false
      }
    });

    this.quiz.questions[questionIndex].correctAnswer = correctAnswer;
  };

  readonly handleQuestionTypeChange = (newValue: QuestionType, questionIndex: number) => {
    this.changingQuestionIndex.value = questionIndex;
    this.showConfirmation.value = true;
    this.changingQuestionType.value = newValue;
  };

  readonly proceedQuestionTypeChange = (questionIndex: number) => {
    const currentQuestion = this.quiz.questions[questionIndex];
    const questionType = currentQuestion.type as QuestionType;
    this.quiz.questions[questionIndex].options = defaultOptions(questionType.type)
    if (this.isYesNOOrTrueFalse(questionType)) {
      currentQuestion.isCustomize = false
      this.handleTrueFalseChange(questionIndex, 0);
    } else {
      this.quiz.questions[questionIndex].isCustomize = null;
      this.handleCorrectChange(questionIndex, 0);
    }
  }

  readonly confirmQuestionTypeChange = () => {
    if (this.changingQuestionIndex.value !== null && this.changingQuestionType.value !== null) {
      this.confirmLoading.value = true;
      // Update model value for newValue for question type
      this.quiz.questions[this.changingQuestionIndex.value!].type = this.changingQuestionType.value!
      // Simulate a short delay for the action
      setTimeout(() => {
        this.proceedQuestionTypeChange(this.changingQuestionIndex.value!);
        this.confirmLoading.value = false;
        this.showConfirmation.value = false;
        this.changingQuestionIndex.value = null;
        this.changingQuestionType.value = null;
      }, 300);
    }
  };

  readonly closeConfirmation = () => {
    this.showConfirmation.value = false;
    this.changingQuestionIndex.value = null;
  };

  readonly saveQuiz = async () => {
    if (this.form.value?.validate()) {
      const questionUpdate = this.quiz.questions.map( question => {
        if (this.isYesNOOrTrueFalse(question.type) && !question.isCustomize) {
          const { options, ...questionWithoutOptions } = question;
          console.log(options);
          const questionTypeValue = (question.type as QuestionType).type
          return { ...questionWithoutOptions, type: questionTypeValue };
        }
        const questionTypeValue = (question.type as QuestionType).type
        return { ...question, type: questionTypeValue, correctAnswer: null };
      });
      const newQuiz: QuizRequest = {
        ...this.quiz,
        questions: questionUpdate,
      }
      // console.log('New Quiz = ', newQuiz);
      try {
        const result = await quizService.createQuizWithQuestions(newQuiz);
        router.push('/admin/quizzes/' + result.id)
      } catch(error) {
        console.log('Error here ', error)
      } finally {
        console.log('Happy Ending...')
      }
    }
  };

  get disableAddQuestion () : boolean {
    const questionLimit = 10;
    return this.quiz.questions.length >= questionLimit;
  }

  readonly disableAddOption = (questionIndex: number): boolean => {
    const question = this.quiz.questions[questionIndex]
    if (this.isYesNOOrTrueFalse(question.type)) {
      const trueFalseOptionLimit = 2;
      return question.options!.length >= trueFalseOptionLimit;
    }

    const mulitpleChoiceLimit = 4;
    return question.options!.length >= mulitpleChoiceLimit;
  }

  readonly disableDeleteOption = (questionIndex: number): boolean => {
    const question = this.quiz.questions[questionIndex]
    if (this.isYesNOOrTrueFalse(question.type)) {
      const minimumLimit = 2;
      return question.options!.length >= minimumLimit;
    }

    const minimumLimit = 3;
    return question.options!.length <= minimumLimit;
  }
}
