/* Ambient type references for Cloudflare Workers runtime to satisfy TS in editor without installing types yet.
   Wrangler will provide runtime bindings. For full types, run: npm i -D @cloudflare/workers-types
*/

interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<void>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface R2Object {
  key: string;
}

interface R2SignedUrl {
  url: string;
}

interface R2Bucket {
  get(key: string): Promise<Response | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | string | Blob): Promise<R2Object>;
  createSignedUrl?(key: string, options?: { method?: string; expires?: number }): Promise<R2SignedUrl>;
}

interface VectorizeIndex {
  upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  query(q: { vector: number[]; topK: number; filter?: Record<string, unknown> }): Promise<{ matches: Array<{ id: string; score: number; metadata?: Record<string, unknown> }> }>;
}

interface QueueMessage<T = unknown> {
  body: T;
  ack(): void;
  retry(): void;
}

interface MessageBatch<T = unknown> {
  messages: Array<QueueMessage<T>>;
}

interface Queue<T = unknown> {
  send(message: T): Promise<void>;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}