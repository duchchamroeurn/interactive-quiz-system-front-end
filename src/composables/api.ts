import { ResponseError } from '@/models/error';
import { type SuccessResponse, successResponseSchema } from '@/models/success';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { z } from 'zod';


const apiClient = axios.create({
  baseURL: 'http://localhost:9099/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const apiRequest = async <T, TDataSchema extends z.ZodType<T>>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  dataSchema: TDataSchema,
  data = {}
): Promise<SuccessResponse<T>> => {
  const finalApiResponseSchema = successResponseSchema(dataSchema);
  try {
    const response: AxiosResponse = await apiClient({
      method,
      url,
      data,
    });
    console.log('Response = ', response.data)
    //  Parse the entire response using the schema
    const validatedResponse = finalApiResponseSchema.parse(response.data)
    return validatedResponse as SuccessResponse<T>

  } catch (error: unknown) {
    //  Improved error handling
    if (error instanceof z.ZodError) {
      const zodError = new ResponseError({
        name: 'ZodError',
        message: `Invalid API response: ${error.errors.map(e => e.message).join(', ')}`,
        timestamp: new Date().toISOString(),
        errors: error.errors,
      })
      throw zodError

    } else if (error instanceof AxiosError) {
      //  Handle HTTP errors (from Axios)
      const axiosError = new ResponseError({
        name: 'AxiosError',
        message: `HTTP error! Status: ${error?.response?.status}`,
        timestamp: new Date().toISOString(),
        errors: {
          status: error?.response?.status,
          data: error?.response?.data,
        },
      });
      throw axiosError
    }
    else if (error instanceof Error) {
      // Handle network errors or other Axios errors
      const _error = new ResponseError({
        name: 'Error',
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        errors: error.message,
      });
      throw _error;
    }
    else {
      const unknownError = new ResponseError({
        name: 'UknowError',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        errors: 'Unexpected Error',
      });
      throw unknownError;
    }
  }
};
