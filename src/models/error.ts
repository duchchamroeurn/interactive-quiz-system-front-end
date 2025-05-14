type ErrorName = 'ZodError' | 'AxiosError' | 'Error' | 'UknowError'
export class ResponseError extends Error {
  name: ErrorName;
  message: string;
  timestamp: string;
  errors: unknown;

  constructor ({ name, message, timestamp, errors }: { name: ErrorName;
    message: string;
    timestamp: string;
    errors: unknown }) {
    super();
    this.name = name;
    this.message = message;
    this.timestamp = timestamp;
    this.errors = errors;
  }
}
