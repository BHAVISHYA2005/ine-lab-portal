import { useCallback, useEffect, useState } from 'react';
import { createSubmission, getSubmissions } from '../api/submissions.js';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });
  const reload = useCallback(async () => {
    setState({ loading: true, error: null });
    try { setSubmissions(await getSubmissions()); setState({ loading: false, error: null }); }
    catch (error) { setState({ loading: false, error: error.response?.data?.error ?? 'Unable to load submissions.' }); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  const submit = useCallback(async (payload) => {
    const submission = await createSubmission(payload);
    setSubmissions((current) => [submission, ...current]);
    return submission;
  }, []);
  return { submissions, ...state, reload, submit };
}
