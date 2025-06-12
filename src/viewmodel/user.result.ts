import { localStorageService } from '@/composables/store';
import { ResponseError } from '@/models/error';
import type { Option } from '@/models/option';
import type { Question, QuestionWithOptions } from '@/models/question';
import type { UserQuizResult } from '@/models/result';
import router from '@/router';
import { sessionService } from '@/services/session';
import { simulateDelay } from '@/utils/delay';
import { computed, reactive } from 'vue';

export class UserAnswerResultViewModel {
  private sessionId: string;

  readonly model = reactive({
    loading: true,
    error: null as string | null,
    quizResult: null as UserQuizResult | null,
  })

  constructor (sessionId: string) {
    this.sessionId = sessionId;
  }

  // --- Computed Properties ---

  readonly numberCorrectAnswers = computed<number>(() => {
    if (!this.model.quizResult) return 0;
    let correctCount = 0;
    for (const question of this.model.quizResult.quiz.questions) {
      if (this.isQuestionAnsweredCorrectly(question)) {
        correctCount++;
      }
    }
    return correctCount;
  });

  // --- Methods ---

  /**
   * Fetches the detailed quiz result based on session ID from route params.
   * In a real application, you'd replace this with an actual API call.
   */
  private readonly fetchQuizResult = async () => {
    this.model.loading = true;
    this.model.error = null;
    const userId = localStorageService.getUser()?.userId;

    try {
      // Simulate API call delay
      await simulateDelay();
      const userResult = await sessionService.getResultSessionUser(this.sessionId, userId!);
      this.model.quizResult = userResult

    } catch (e: unknown) {
      console.error('Error fetching quiz result:', e);
      if(e instanceof ResponseError) {
        this.model.error = e.message || 'Failed to load quiz result. Please try again later.';
      }
    } finally {
      this.model.loading = false;
    }
  };

  /**
   * Calculates the percentage score.
   * @param {number} correct - Number of correct answers.
   * @param {number} total - Total number of questions.
   * @returns {string} The score percentage, rounded to 2 decimal places.
   */
  readonly calculateScore = (correct: number, total: number): string => {
    if (total === 0) return '0.00';
    return ((correct / total) * 100).toFixed(2);
  };

  /**
   * Determines the color of the score chip based on the percentage.
   * @param {number} correct - Number of correct answers.
   * @param {number} total - Total number of questions.
   * @returns {string} Vuetify color class (e.g., 'success', 'warning', 'error').
   */
  readonly getScoreColor = (correct: number, total: number): string => {
    const score = parseFloat(this.calculateScore(correct, total));
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  /**
   * Determines if a given option is the correct answer for a question.
   * @param {QuestionOption} option - The option object.
   * @param {QuizQuestion} question - The question object.
   * @returns {boolean} True if the option is correct, false otherwise.
   */
  readonly isCorrectOption = (option: Option): boolean => {
    return option.correct;
  };


  /**
   * Determines if a given option was the user's selected answer for a question.
   * @param {QuestionOption} option - The option object.
   * @param {QuizQuestion} question - The question object.
   * @returns {boolean} True if this option was the user's answer, false otherwise.
   */
  readonly isUserAnswer = (option: Option, question: Question): boolean => {
    if (!this.model.quizResult) return false;
    const userAnswer = this.model.quizResult.answers.find(a => a.questionId === question.id);

    if (!userAnswer) return false;

    return userAnswer.answerId === option.id;
  };


  /**
   * Checks if the user answered a specific question correctly.
   * @param {QuizQuestion} question - The question object.
   * @returns {boolean} True if the user's answer matches the correct answer, false otherwise.
   */
  readonly isQuestionAnsweredCorrectly = (question: QuestionWithOptions): boolean => {
    if (!this.model.quizResult) return false;
    const userAnswer = this.model.quizResult.answers.find(a => a.questionId === question.id);

    if (!userAnswer) return false; // User didn't answer this question

    const correctOption = question.options.find(opt => opt.correct);
    return correctOption?.id === userAnswer.answerId;
  };

  /**
   * Gets the CSS class for the expansion panel header based on correctness.
   * @param {QuizQuestion} question - The question object.
   * @returns {string} CSS class (e.g., 'border-success', 'border-error').
   */
  readonly getQuestionPanelClass = (question: QuestionWithOptions): string => {
    return this.isQuestionAnsweredCorrectly(question) ? 'border-s-lg border-success' : 'border-s-lg border-error';
  };

  /**
   * Gets the display name for a question type.
   * @param {QuestionType} type - The question type enum.
   * @returns {string} User-friendly display name.
   */
  readonly getQuestionTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Multiple Choice';
      case 'TRUE_FALSE': return 'True/False';
      case 'YES_NO': return 'Yes/No';
      default: return 'Unknown';
    }
  };

  /**
   * Gets the icon for an option based on whether it's correct or user's answer.
   * @param {QuestionOption} option - The option object.
   * @param {QuizQuestion} question - The question object.
   * @returns {string} Material Design Icon string.
   */
  readonly getOptionIcon = (option: Option, question: Question): string => {
    const isCorrect = this.isCorrectOption(option);
    const isUser = this.isUserAnswer(option, question);

    if (isCorrect && isUser) return 'mdi-check-circle'; // Correct and selected
    if (isCorrect && !isUser) return 'mdi-check-circle-outline'; // Correct but not selected by user
    if (!isCorrect && isUser) return 'mdi-close-circle'; // Incorrect and selected by user
    return 'mdi-circle-outline'; // Not selected and not correct
  };

  /**
   * Gets the icon color for an option.
   * @param {QuestionOption} option - The option object.
   * @param {QuizQuestion} question - The question object.
   * @returns {string} Vuetify color.
   */
  readonly getOptionIconColor = (option: Option, question: Question): string => {
    const isCorrect = this.isCorrectOption(option);
    const isUser = this.isUserAnswer(option, question);

    if (isCorrect && isUser) return 'success';
    if (isCorrect && !isUser) return 'success';
    if (!isCorrect && isUser) return 'error';
    return 'default'; // Or 'grey' or 'medium-emphasis'
  };

  /**
   * Navigates back to the list of submitted answers.
   * This function will use Vue Router to go back.
   */
  readonly goBackToAnswers = () => {
    router.back();
  };

  // --- Lifecycle Hook ---
  readonly onMounted = () => {
    this.fetchQuizResult();
  };
}
