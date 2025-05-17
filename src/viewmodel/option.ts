import type { Option } from '@/models/option';
import type { TableOption } from '@/models/table';
import { optionService } from '@/services/option';
import { simulateDelay } from '@/utils/delay';
import { reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components';

class OptionViewModel {

  editForm = ref<VForm | null>(null);
  readonly headers = [
    { title: 'Option ID', key: 'id', sortable: false, width: '40%' },
    { title: 'Option Text', key: 'optionText',sortable: false, width: '40%' },
    { title: 'Correct', key: 'correct', sortable: false, width: '10%' },
    { title: 'Actions', key: 'actions', sortable: false, width: '10%' },
  ];

  readonly optionTextRules = [
    (v: string) => !!v || 'Option Text is required',
    (v: string) => v.length >= 1 || 'Option Text must be at least 1 character',
  ];
  readonly model = reactive({
    loading: false,
    options: [] as Option[],
    totalOptions: 0,
    itemsPerPage: 10,
    editFormValid: false,
    editMode: 'edit' as 'create' | 'edit',
    deleteDialog: {
      show: false,
      option: null as Option | null,
      loading: false,
    },
    editDialog: {
      show: false,
      option: {} as Option,
      loading: false,
    },
  })

  readonly fetchOptions = async (option: TableOption) => {
    this.model.loading = true;
    await simulateDelay()
    optionService.getOptions(option).then(options => {
      this.model.loading = false;
      this.model.options = options.data;
      this.model.totalOptions = options.totalElements;
    })
  }

  readonly openDeleteDialog = (option: Option) => {
    this.model.deleteDialog = {
      show: true,
      option,
      loading: false,
    };
  };

  readonly closeDeleteDialog = () => {
    this.model.deleteDialog.show = false;
    this.model.deleteDialog.option = null;
  };

  readonly confirmDeleteOption = () => {
    if (!this.model.deleteDialog.option) return;

    this.model.deleteDialog.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting option:', this.model.deleteDialog.option);
      // Remove the option from the list
      this.model.options = this.model.options.filter(o => o.id !== this.model.deleteDialog.option!.id);
      this.model.deleteDialog.loading = false;
      this.closeDeleteDialog();
    }, 500);
  };

  readonly openEditDialog = (option: Option) => {
    this.model.editMode = 'edit';
    this.model.editDialog = {
      show: true,
      option: { ...option },
      loading: false,
    };
  };

  readonly openCreateDialog = () => {
    this.model.editMode= 'create';
    this.model.editDialog = {
      show: true,
      option: {
        id: '',
        optionText: '',
        correct: false,
      },
      loading: false,
    };
  };

  readonly closeEditDialog = () => {
    this.model.editDialog.show = false;
    this.model.editDialog.option = {} as Option;
  };

  readonly saveEditOption = () => {
    if (!this.editForm.value?.validate()) return;

    this.model.editDialog.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving option:', this.model.editDialog.option);
      if (this.model.editMode === 'edit') {
        this.model.options = this.model.options.map(o =>
          o.id === this.model.editDialog.option.id ? { ...this.model.editDialog.option } : o
        );
      } else {
        const newOption = {
          ...this.model.editDialog.option,
          id: crypto.randomUUID(),
        };
        this.model.options.push(newOption);
      }

      this.model.editDialog.loading = false;
      this.closeEditDialog();
    }, 500);
  };

}

export const optionViewModel = new OptionViewModel();
