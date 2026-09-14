import { describe, expect, it } from 'vitest';
import { getLab, listLabs } from '../services/lab.service.js';

function createFakeDb() {
  const labs = [
    { id: 1, title: 'Linux Basics', category: 'linux', difficulty: 'beginner' },
    { id: 2, title: 'Containerize a Service', category: 'docker', difficulty: 'intermediate' },
  ];
  return {
    prepare(query) {
      return {
        bind(id) {
          return { first: async () => labs.find((lab) => lab.id === id) ?? null };
        },
        all: async () => ({ results: labs }),
      };
    },
  };
}

describe('labs service used by the labs route', () => {
  it('returns all labs in stable order', async () => {
    await expect(listLabs(createFakeDb())).resolves.toEqual([
      { id: 1, title: 'Linux Basics', category: 'linux', difficulty: 'beginner' },
      { id: 2, title: 'Containerize a Service', category: 'docker', difficulty: 'intermediate' },
    ]);
  });

  it('returns a not-found error for an unknown lab', async () => {
    await expect(getLab(createFakeDb(), 99)).rejects.toMatchObject({ status: 404, message: 'Lab not found' });
  });
});
