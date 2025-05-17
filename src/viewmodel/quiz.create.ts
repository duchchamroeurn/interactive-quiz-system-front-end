import { localStorageService } from '@/composables/store';
import type { QuestionType, QuizRequest } from '@/models/request/quiz';
import router from '@/router';
import { quizService } from '@/services/quiz';
import { reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components';

class CreateQuizViewModel {
  form = ref<InstanceType<typeof VForm> | null>(null);
  valid = ref(false);
  readonly rules = {
    required: (value: unknown) => !!value || 'Required.',
    positiveNumber: (value: number) => value > 0 || 'Must be a positive number',
  };

  readonly optionRules = () => {
    return [this.rules.required]; // Apply required rule for other types
  };
  readonly questionTypes: QuestionType[] = ['MULTIPLE_CHOICE', 'TRUE_FALSE']

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
        type: 'MULTIPLE_CHOICE',
        text: '',
        timeLimit: 60,
        options: [
          { id: crypto.randomUUID(), text: '', isCorrect: true },
          { id: crypto.randomUUID(), text: '', isCorrect: false },
          { id: crypto.randomUUID(), text: '', isCorrect: false },
        ],
      },
    ],
  });

  readonly addQuestion = () => {
    this.quiz.questions.push({
      id: crypto.randomUUID(),
      type: 'MULTIPLE_CHOICE',
      text: '',
      timeLimit: 60,
      options: [
        { id: crypto.randomUUID(), text: '', isCorrect: true },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
      ],
    });
  };

  readonly removeQuestion = (index: number) => {
    this.quiz.questions.splice(index, 1);
  };

  readonly addOption = (questionIndex: number) => {
    this.quiz.questions[questionIndex].options!.push({
      id: crypto.randomUUID(),
      text: '',
      isCorrect: false,
    });
  };

  readonly removeOption = (questionIndex: number, optionIndex: number) => {
    const question = this.quiz.questions[questionIndex]
    const isCorrectOption = question.options![optionIndex].isCorrect;
    this.quiz.questions[questionIndex].options!.splice(optionIndex, 1);
    // Check remove on option which that correct we will update index correct to 0
    if (isCorrectOption) {
      // As only question type multipleChoice that can remove
      // So we will no need to check for the codition question type
      this.handleCorrectChange(questionIndex, 0);
    }
  };

  readonly handleCorrectChange = (questionIndex: number, optionIndex: number) => {
    // Ensure only one option is correct for multiple choice
    if (this.quiz.questions[questionIndex].type === 'MULTIPLE_CHOICE') {
      this.quiz.questions[questionIndex].options!.forEach((option, index) => {
        option.isCorrect = index === optionIndex;
      });
    }
  };

  readonly handleTrueFalseChange = (questionIndex: number) => {
    const selectedAnswer = this.quiz.questions[questionIndex].correctAnswer;
    this.quiz.questions[questionIndex].options!.forEach((option, index) => {
      option.isCorrect = index === selectedAnswer;
    });
  };

  readonly handleQuestionTypeChange = (newValue: QuestionType, questionIndex: number) => {
    this.changingQuestionIndex.value = questionIndex;
    this.showConfirmation.value = true;
    this.changingQuestionType.value = newValue;
  };

  readonly proceedQuestionTypeChange = (questionIndex: number) => {
    const currentQuestion = this.quiz.questions[questionIndex];
    const questionType = currentQuestion.type;
    if (questionType === 'TRUE_FALSE') {
      this.quiz.questions[questionIndex].options = [
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
      ];
      currentQuestion.correctAnswer = 0
      this.handleTrueFalseChange(questionIndex)
    } else {
      this.quiz.questions[questionIndex].options = [
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
        { id: crypto.randomUUID(), text: '', isCorrect: false },
      ];
      this.handleCorrectChange(questionIndex, 0)
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
        if (question.type === 'TRUE_FALSE') {
          const { options, ...questionWithoutOptions } = question;
          console.log(options);
          return questionWithoutOptions;
        }
        return question;
      });
      const newQuiz: QuizRequest = {
        ...this.quiz,
        questions: questionUpdate,
      }
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
    const questionLimit = 5;
    return this.quiz.questions.length >= questionLimit;
  }

  readonly disableAddOption = (questionIndex: number): boolean => {
    const question = this.quiz.questions[questionIndex]
    if (question.type === 'TRUE_FALSE') {
      const trueFalseOptionLimit = 2;
      return question.options!.length >= trueFalseOptionLimit;
    }

    const mulitpleChoiceLimit = 4;
    return question.options!.length >= mulitpleChoiceLimit;
  }

  readonly disableDeleteOption = (questionIndex: number): boolean => {
    const question = this.quiz.questions[questionIndex]
    if (question.type === 'TRUE_FALSE') {
      const minimumLimit = 2;
      return question.options!.length >= minimumLimit;
    }

    const minimumLimit = 3;
    return question.options!.length <= minimumLimit;
  }
}

export const createQuizViewModel = new CreateQuizViewModel();
