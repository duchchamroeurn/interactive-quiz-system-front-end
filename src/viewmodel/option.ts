import type { Option } from '@/models/option';
import type { TableOption } from '@/models/table';
import { optionService } from '@/services/option';
import { simulateDelay } from '@/utils/delay';
import { reactive } from 'vue';

class OptionViewModel {

  readonly headers = [
    { title: 'Option Text', key: 'optionText',sortable: false },
    { title: 'Correct', key: 'correct', sortable: false },
  ];

  readonly model = reactive({
    loading: false,
    options: [] as Option[],
    totalOptions: 0,
    itemsPerPage: 10,
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

}

export const optionViewModel = new OptionViewModel();
