import { Inject, Injectable, Logger } from '@nestjs/common';
import FormData from 'form-data';
import fetch, { Response } from 'node-fetch';
import { URL } from 'url';

import { NodeFetchError } from './node-fetch.error';
import { INodeFetchOptions, NodeFetchRequest } from './node-fetch.interfaces';

@Injectable()
export class NodeFetchService {
  private readonly _logger = new Logger(NodeFetchService.name);
  private _requestInterval = 1;
  private _maxRequestPerSecond = 10;
  private _queue = 0;

  constructor(@Inject('THROTTLE_OPTIONS') options?: INodeFetchOptions) {
    this._maxRequestPerSecond = options?.maxRequestPerSecond || this._maxRequestPerSecond;

    if (!this.maxRequestPerSecond || this.maxRequestPerSecond < 1) {
      throw new Error("Can't calculate queue size");
    }

    this._requestInterval = Math.floor(10 / this.maxRequestPerSecond) * 100;
  }

  private prepareURL(request: NodeFetchRequest): URL {
    const { endpoint, query } = request;
    const url = new URL(endpoint);
    new URLSearchParams(query).forEach((value, name) => {
      url.searchParams.append(name, value);
    });

    return url;
  }

  private prepareHeaders(request: NodeFetchRequest): fetch.HeaderInit {
    const { payload, headers } = request;

    return {
      ...(payload && { 'Content-Type': 'application/json' }),
      ...(payload instanceof FormData && { 'Content-Type': 'multipart/form-data' }),
      ...(typeof payload === 'string' && { 'Content-Type': 'text/plain' }),
      ...headers,
      Accept: 'application/json',
      Connection: 'close',
    };
  }

  private prepareBody(request: NodeFetchRequest): fetch.BodyInit {
    const { payload, headers } = request;
    let body: string | FormData | fetch.BodyInit;

    if (payload instanceof FormData || typeof payload === 'string') {
      body = payload;
    } else if (headers?.['Content-Type'] === 'application/x-www-form-urlencoded') {
      const formBody: string[] = [];

      Object.keys(payload).forEach((key) => {
        const encodedKey = encodeURIComponent(key);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const encodedValue = encodeURIComponent(payload[`${key}`]);
        formBody.push(encodedKey + '=' + encodedValue);
      });

      body = formBody.join('&');
    } else if (payload) {
      body = JSON.stringify(payload);
    }

    return body;
  }

  private async parseResponse<Res = Buffer | Record<string, unknown>>(response: fetch.Response): Promise<Res> {
    const contentType = response.headers.get('Content-Type');

    if (!contentType) {
      throw ReferenceError('Content-Type not set');
    }

    return (contentType.includes('application/json') ? response.json() : response.buffer()) as Promise<Res>;
  }

  async request<Res, ErrorRes = string | Record<string, unknown>>(request: NodeFetchRequest): Promise<Res> {
    const response = await this.rawRequest(request);

    if (!response.ok) {
      this._logger.error(`Failed to request. Status: ${response.status} ${response.statusText}`);

      throw new NodeFetchError('Failed to request', {
        statusCode: response.status,
        statusText: response.statusText,
        response: await this.parseResponse<ErrorRes>(response),
      });
    }

    return this.parseResponse<Res>(response);
  }

  async rawRequest(request: NodeFetchRequest): Promise<Response> {
    return this.queueManager(async () => {
      const { method } = request;
      const url = this.prepareURL(request);
      this._logger.log(`${method}, ${url.toString()}`);
      const req = {
        method,
        headers: this.prepareHeaders(request),
        body: this.prepareBody(request),
      };

      return fetch(url, req);
    });
  }

  /**
   * Высчитываем примерный интервал необходимый для соблюдения тротлинга
   */
  get requestInterval(): number {
    return this._requestInterval;
  }

  /**
   * Получение Максимально допустимого количества запросов за секунду
   */
  get maxRequestPerSecond(): number {
    return this._maxRequestPerSecond;
  }

  /**
   * Вывод очереди на запросы
   * @returns Количество ожидающих запросов
   */
  get queueTotal(): number {
    return this._queue;
  }

  /**
   * Менеджер по запросам
   * @param handle - Необходимые запрос, который нужно выполнить
   * @returns
   */
  private async queueManager<T>(handle: () => Promise<T>): Promise<T> {
    this._queue++;
    await this.delay(this._queue * this._requestInterval);
    this._queue--;

    return handle();
  }

  /**
   * Таймер запроса
   */
  private delay = (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));
}
