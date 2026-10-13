import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

export function resolveChatOrigin(
  value: unknown,
  native: boolean,
): string | null {
  if (typeof value !== 'string' || !value.trim()) return native ? null : '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === '/'
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class ChatConnectionService {
  private origin: string | null = null;
  private readonly ready = this.load();

  async available(): Promise<boolean> {
    await this.ready;
    if (this.origin === null) return false;
    try {
      const response = await this.request(
        `${this.origin}/api/chat/status`,
        {},
        5000,
      );
      return response.ok && (await response.json()).available === true;
    } catch {
      return false;
    }
  }
  async send(body: unknown): Promise<string> {
    await this.ready;
    if (this.origin === null) throw new Error('No chat server configured');
    const response = await this.request(`${this.origin}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Chat unavailable');
    const data = await response.json();
    if (typeof data.reply !== 'string' || !data.reply.trim())
      throw new Error('Empty response');
    return data.reply;
  }
  private async request(url: string, options: RequestInit, timeout = 25000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }
  private async load() {
    try {
      const response = await fetch('assets/app-config.json');
      const config = response.ok ? await response.json() : {};
      this.origin = resolveChatOrigin(
        config.chatApiBaseUrl,
        Capacitor.isNativePlatform(),
      );
    } catch {
      this.origin = Capacitor.isNativePlatform() ? null : '';
    }
  }
}
