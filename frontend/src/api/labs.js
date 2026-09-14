import client from './client.js';

export async function getLabs() {
  const { data } = await client.get('/api/labs');
  return data.labs;
}

export async function getLab(id) {
  const { data } = await client.get(`/api/labs/${id}`);
  return data.lab;
}

export async function getLabQuestion(id) {
  const { data } = await client.get(`/api/labs/${id}/question`);
  return data.question;
}
