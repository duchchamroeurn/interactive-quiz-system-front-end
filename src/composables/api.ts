import { ref, type Ref } from 'vue';

interface ApiResponse<T> {
  data: Ref<T | null>;
  error: Ref<string | null>;
  loading: Ref<boolean>;
}

export const useApi = <T>(url: string, options = {}): ApiResponse<T> => {
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<string | null>(null);
  const loading = ref(true);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      data.value = result.data as T; // Adjust based on your API response structure.
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = String(err);
      }
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return {
    data,
    error,
    loading,
  };

};
