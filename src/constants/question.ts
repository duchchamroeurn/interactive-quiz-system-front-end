import type { Option } from '@/models/option';
import type { QuestionType } from '@/models/question';

const defaultMultipleOptions: Option[] = [
  {
    id: crypto.randomUUID(),
    optionText: '',
    correct: true,
  },
  {
    id: crypto.randomUUID(),
    optionText: '',
    correct: false,
  },
  {
    id: crypto.randomUUID(),
    optionText: '',
    correct: false,
  },
];

const defaultYesNoOptions: Option[] = [
  {
    id: crypto.randomUUID(),
    optionText: 'Yes',
    correct: true,
  },
  {
    id: crypto.randomUUID(),
    optionText: 'No',
    correct: false,
  },
]
const defaultTrueFalseOptions: Option[] = [
  {
    id: crypto.randomUUID(),
    optionText: 'True',
    correct: true,
  },
  {
    id: crypto.randomUUID(),
    optionText: 'False',
    correct: false,
  },
]

export const defaultOptions = (questionType: string): Option[] => {

  switch(questionType) {
    case 'MULTIPLE_CHOICE':
      return JSON.parse(JSON.stringify(defaultMultipleOptions));
    case 'TRUE_FALSE':
      return JSON.parse(JSON.stringify(defaultTrueFalseOptions));
    case 'YES_NO':
      return JSON.parse(JSON.stringify(defaultYesNoOptions));
    default:
      return [];
  }
}

export const questionTypes: QuestionType[] = [
  { title: 'Multiple Choice',
    type: 'MULTIPLE_CHOICE',
    options: defaultOptions('MULTIPLE_CHOICE'),
  },
  { title: 'True/False',
    type: 'TRUE_FALSE',
    options: defaultOptions('TRUE_FALSE'),
  },
  { title: 'Yes/No',
    type: 'YES_NO',
    options: defaultOptions('YES_NO'),
  },
];
