import { Injectable } from '@nestjs/common';

type FetchJsonOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

@Injectable()
export class ClassmateService {
  private get baseUrl(): string {
    const raw = process.env.CLASSMATE_API_BASE || 'https://cvb-0pd8.onrender.com';
    return raw.replace(/\/$/, '');
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async fetchJson<T = unknown>(pathOrUrl: string, options?: FetchJsonOptions): Promise<T> {
    const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${this.baseUrl}${pathOrUrl}`;

    const res = await fetch(url, {
      method: options?.method ?? 'GET',
      headers: {
        accept: 'application/json',
        ...(options?.body != null ? { 'content-type': 'application/json' } : {}),
      },
      body: options?.body != null ? JSON.stringify(options.body) : undefined,
    });

    const text = await res.text();
    const data = text ? (JSON.parse(text) as T) : (null as T);

    if (!res.ok) {
      const err: any = new Error(`Upstream ${res.status} ${res.statusText}`);
      err.status = res.status;
      err.body = data;
      throw err;
    }

    return data;
  }
}

