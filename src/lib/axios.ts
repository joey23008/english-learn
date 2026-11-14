import axios, { AxiosResponse } from 'axios';
import { FetchError, Props } from './FetchError';

const baseURL = process.env.NEXT_PUBLIC_WEB_URL + '/api';
const headers = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

export const client = axios.create({
  baseURL,
  headers,
});

client.interceptors.response.use((response) => response, (err) => {
  const props: Props = {
    message: ''
  };
  if (err.response) {
    props.status = err.response.status;
    props.message = err.response.statusText;
  }  else {
    props.message = err.message;
    if (err.request) {
      props.request = true;
    }
  }
  
  throw new FetchError(props);
});

export async function post<T>(url: string, body?: any, headers: any = {}) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return await client.post(url, body, headers) as AxiosResponse<T>;
}

export async function get<T>(url: string, headers?: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return await client.get(url, headers) as AxiosResponse<T>;
}

export async function del<T>(url: string, headers?: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return await client.delete(url, headers) as AxiosResponse<T>;
}

export async function patch<T>(url: string, body?: any, headers: any = {}) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return await client.patch(url, body, headers) as AxiosResponse<T>;
}