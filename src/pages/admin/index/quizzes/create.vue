<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-form :ref="createQuizViewModel.form" v-model="createQuizViewModel.valid.value" @submit.prevent="createQuizViewModel.saveQuiz">
          <v-text-field
            v-model="createQuizViewModel.quiz.title"
            label="Quiz Title"
            required
            :rules="[createQuizViewModel.rules.required]"
          />
          <v-textarea
            v-model="createQuizViewModel.quiz.description"
            label="Quiz Description"
            required
            :rules="[createQuizViewModel.rules.required]"
          />
          <v-card flat>
            <v-card-title>Questions</v-card-title>
            <v-card-text>
              <v-card
                v-for="(question, questionIndex) in createQuizViewModel.quiz.questions"
                :key="questionIndex"
                class="mt-5"
              >
                <v-card-title class="d-flex align-center">
                  Question {{ questionIndex + 1 }}
                  <v-spacer />
                  <v-btn
                    class="ml-auto"
                    color="error"
                    icon
                    small
                    title="Delete Question"
                    @click="createQuizViewModel.removeQuestion(questionIndex)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="question.text"
                    label="Question Text"
                    required
                    :rules="[createQuizViewModel.rules.required]"
                  />
                  <v-select
                    :items="createQuizViewModel.questionTypes"
                    label="Question Type"
                    :model-value="question.type as QuestionType"
                    required
                    return-object
                    :rules="[createQuizViewModel.rules.required]"
                    @update:model-value="createQuizViewModel.handleQuestionTypeChange($event, questionIndex)"
                  />
                  <v-text-field
                    v-model="question.timeLimit"
                    label="Time Limit (seconds)"
                    min="1"
                    required
                    :rules="[createQuizViewModel.rules.required, createQuizViewModel.rules.positiveNumber]"
                    type="number"
                  />
                  <v-card flat>
                    <v-card-title>
                      <v-row>
                        <v-col>Options</v-col>
                        <v-col v-if="createQuizViewModel.isYesNOOrTrueFalse(question.type)">
                          <v-switch
                            v-model:model-value="question.isCustomize"
                            color="success"
                            hide-details
                            inset
                            :label="`Customize ${(question.type as QuestionType).title} Labels`"
                            @update:model-value="createQuizViewModel.handleLabelCustomizeChange($event, questionIndex)"
                          />
                        </v-col>
                      </v-row>
                    </v-card-title>
                    <v-card-text>
                      <v-card
                        v-for="(option, optionIndex) in question.options"
                        :key="optionIndex"
                        flat
                      >
                        <v-card-text>
                          <v-row>
                            <v-col>
                              <v-text-field
                                v-model="option.optionText"
                                :disabled="createQuizViewModel.textfiledYesNoOrTrueFalseState(questionIndex)"
                                label="Option Text"
                                :readonly="createQuizViewModel.textfiledYesNoOrTrueFalseState(questionIndex)"
                                required
                                :rules="createQuizViewModel.optionRules()"
                              />
                            </v-col>
                            <v-col>
                              <v-row>
                                <v-col>
                                  <v-checkbox
                                    v-if="createQuizViewModel.isMultitpleChoice(question.type)"
                                    v-model="option.correct"
                                    class="mr-2"
                                    label="Correct"
                                    @update:model-value="createQuizViewModel.handleCorrectChange(questionIndex, optionIndex)"
                                  />
                                  <template v-if="createQuizViewModel.isYesNOOrTrueFalse(question.type)">
                                    <v-radio-group v-model="question.correctAnswer" class="mr-2" :rules="[createQuizViewModel.rules.selectRquired]" @change="createQuizViewModel.handleTrueFalseChange(questionIndex, optionIndex)">
                                      <v-radio :label="option.optionText" :value="optionIndex === 0" />
                                    </v-radio-group>
                                  </template>
                                </v-col>
                                <v-col class="d-flex align-center justify-end">
                                  <v-btn
                                    color="error"
                                    :disabled="createQuizViewModel.disableDeleteOption(questionIndex)"
                                    icon
                                    small
                                    title="Delete Option"
                                    @click="createQuizViewModel.removeOption(questionIndex, optionIndex)"
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>

                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" :disabled="createQuizViewModel.disableAddOption(questionIndex)" @click="createQuizViewModel.addOption(questionIndex)">
                        <v-icon class="mr-2">mdi-plus</v-icon>
                        Add Option
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" :disabled="createQuizViewModel.disableAddQuestion" @click="createQuizViewModel.addQuestion">
                <v-icon class="mr-2">mdi-plus</v-icon>
                Add Question
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :disabled="!createQuizViewModel.valid.value" @click="createQuizViewModel.saveQuiz">Save Quiz</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="createQuizViewModel.showConfirmation.value" max-width="500">
      <v-card>
        <v-card-title class="headline">Confirm Question Type Change</v-card-title>
        <v-card-text>
          If you change the question type, any existing options for this question will be removed. This action cannot be undone. Continue?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="createQuizViewModel.closeConfirmation">Cancel</v-btn>
          <v-btn color="blue" :loading="createQuizViewModel.confirmLoading.value" @click="createQuizViewModel.confirmQuestionTypeChange">
            <span v-if="createQuizViewModel.confirmLoading.value">Changing...</span>
            <span v-else>Continue</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
  import type { QuestionType } from '@/models/question';
  import { CreateQuizViewModel } from '@/viewmodel/quiz.create';

  const createQuizViewModel = new CreateQuizViewModel();


</script>
<route lang="json">
  {
    "meta": {
      "title": "Create Quiz",
      "requiresAuth": true,
      "isAdmin": true
    }
  }
</route>
