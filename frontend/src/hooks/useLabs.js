import { useCallback, useEffect, useState } from 'react';
import { getLab, getLabQuestion, getLabs } from '../api/labs.js';

function useRequest(request, initialValue) {
  const [data, setData] = useState(initialValue);
  const [state, setState] = useState({ loading: true, error: null });
  const reload = useCallback(async () => {
    setState({ loading: true, error: null });
    try { setData(await request()); setState({ loading: false, error: null }); }
    catch (error) { setState({ loading: false, error: error.response?.data?.error ?? 'Unable to load labs.' }); }
  }, [request]);
  useEffect(() => { reload(); }, [reload]);
  return { data, ...state, reload };
}

export function useLabs() { return useRequest(getLabs, []); }

export function useLab(id) {
  const request = useCallback(() => getLab(id), [id]);
  return useRequest(request, null);
}

export function useLabQuestion(id) {
  const request = useCallback(() => getLabQuestion(id), [id]);
  return useRequest(request, null);
}
