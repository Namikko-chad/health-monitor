export interface ICache {
  set(key: string, value: unknown, seconds?: number): Promise<void>;
  get<R>(key: string): Promise<R | null>;
  del(key: string): Promise<void>;
  flushAll(): Promise<void>;
  close(): Promise<void>;
}
