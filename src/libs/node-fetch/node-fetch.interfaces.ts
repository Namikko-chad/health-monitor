import FormData from 'form-data';
import { HeadersInit } from 'node-fetch';

export interface INodeFetchOptions {
  instanceName: string;
  maxRequestPerSecond: number;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface NodeFetchRequest {
  method: HttpMethod;
  endpoint: string | URL;
  query?: Record<string, string | readonly string[]>;
  payload?: FormData | object | string;
  headers?: HeadersInit;
}
