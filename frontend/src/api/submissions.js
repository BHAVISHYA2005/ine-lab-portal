import client from './client.js';

export async function getSubmissions() {
  const { data } = await client.get('/api/submissions');
  return data.submissions;
}

export async function getSubmission(id) {
  const { data } = await client.get(`/api/submissions/${id}`);
  return data.submission;
}

export async function createSubmission(payload) {
  const { data } = await client.post('/api/submissions', payload);
  return data.submission;
}
