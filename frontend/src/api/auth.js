import client from './client.js';

export async function signup(credentials) {
  const { data } = await client.post('/api/auth/signup', credentials);
  return data;
}

export async function login(credentials) {
  const { data } = await client.post('/api/auth/login', credentials);
  return data;
}

export async function getMe() {
  const { data } = await client.get('/api/auth/me');
  return data.user;
}
