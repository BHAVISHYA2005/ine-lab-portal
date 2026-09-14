import app from './app.js';

function createRequest(request, env, body) {
  const url = new URL(request.url);
  return {
    method: request.method,
    url: `${url.pathname}${url.search}`,
    originalUrl: `${url.pathname}${url.search}`,
    headers: Object.fromEntries(request.headers),
    body,
    env,
    socket: { encrypted: url.protocol === 'https:' },
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    on() { return this; },
    once() { return this; },
    resume() {},
  };
}

function createResponse() {
  const headers = new Headers();
  const chunks = [];
  const listeners = new Map();
  return {
    statusCode: 200,
    headersSent: false,
    writableEnded: false,
    setHeader(name, value) { headers.set(name, Array.isArray(value) ? value.join(', ') : String(value)); },
    getHeader(name) { return headers.get(name); },
    removeHeader(name) { headers.delete(name); },
    writeHead(status, values) {
      this.statusCode = status;
      for (const [name, value] of Object.entries(values ?? {})) this.setHeader(name, value);
      return this;
    },
    write(chunk) { chunks.push(chunk); return true; },
    end(chunk) {
      if (chunk !== undefined) chunks.push(chunk);
      this.writableEnded = true;
      this.headersSent = true;
      this.emit('finish');
      return this;
    },
    on(event, listener) { listeners.set(event, listener); return this; },
    once(event, listener) { listeners.set(event, listener); return this; },
    emit(event, ...args) { listeners.get(event)?.(...args); },
    toResponse() {
      const body = chunks.map((chunk) => typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk)).join('');
      return new Response(this.statusCode === 204 ? null : body, { status: this.statusCode, headers });
    },
  };
}

export default {
  async fetch(request, env) {
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
    const bodyText = hasBody ? await request.text() : '';
    const body = bodyText ? JSON.parse(bodyText) : undefined;
    const req = createRequest(request, env, body);
    const res = createResponse();
    await new Promise((resolve, reject) => {
      res.once('finish', resolve);
      try {
        app(req, res, reject);
      } catch (error) {
        reject(error);
      }
    });
    return res.toResponse();
  },
};

export { app };
