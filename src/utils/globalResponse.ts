export interface GlobalResponse<T> {
  ok: boolean;
  message: string;
  data: T;
  dateTime: string;
  detail: string;
  statusCode: number;
}

interface GlobalResponseProp<T> {
  message?: string;
  data: T;
  detail?: string;
  statusCode?: number;
}

export const createResponse = <T>({
  message = "Operation successful",
  data = {} as T,
  detail = "",
  statusCode = 200,
}: GlobalResponseProp<T>): GlobalResponse<T> => ({
  ok: statusCode >= 200 && statusCode < 300,
  message,
  data,
  dateTime: new Date().toISOString(),
  detail,
  statusCode,
});
