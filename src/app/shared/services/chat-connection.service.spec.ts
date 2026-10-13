import { resolveChatOrigin } from './chat-connection.service';

describe('Native chat configuration', () => {
  it('keeps unconfigured native builds offline and permits the web proxy', () => {
    expect(resolveChatOrigin('', true)).toBeNull();
    expect(resolveChatOrigin('', false)).toBe('');
  });
  it('accepts only an HTTPS server origin without secrets or query values', () => {
    expect(resolveChatOrigin('https://study.example.com/', true)).toBe(
      'https://study.example.com',
    );
    for (const value of [
      'http://study.example.com',
      'https://user:key@example.com',
      'https://example.com/?key=x',
      'https://example.com/api',
      'bad URL',
    ]) {
      expect(resolveChatOrigin(value, true)).toBeNull();
    }
  });
});
