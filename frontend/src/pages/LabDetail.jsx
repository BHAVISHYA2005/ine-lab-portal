import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useLab, useLabQuestion } from '../hooks/useLabs.js';
import { useSubmissions } from '../hooks/useSubmissions.js';

const VERDICT_LABEL = { approved: 'Approved', rejected: 'Needs changes', needs_review: 'Needs human review' };

function AiResultPanel({ result }) {
  if (!result) return null;
  const label = VERDICT_LABEL[result.status] ?? result.status;
  return <div className={`ai-result ai-result-${result.status}`}>
    <div className="ai-result-heading"><span className="eyebrow">AI first-pass review</span><span className={`status status-${result.status}`}>{label}</span></div>
    {result.ai_feedback ? <p>{result.ai_feedback}</p> : <p className="muted">The reviewer could not reach a confident verdict this time. This submission is marked for human review.</p>}
    {typeof result.ai_confidence === 'number' && <p className="ai-confidence">Confidence: {Math.round(result.ai_confidence * 100)}%</p>}
  </div>;
}

export default function LabDetail() {
  const { id } = useParams();
  const { data: lab, loading, error } = useLab(id);
  const { data: quiz, loading: quizLoading } = useLabQuestion(id);
  const { submit } = useSubmissions();
  const [solution, setSolution] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [aiResult, setAiResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setAiResult(null);
    try {
      const submission = await submit({ labId: Number(id), solution });
      setSolution('');
      setMessage('Submission received.');
      setAiResult(submission);
    } catch (requestError) {
      setMessage(requestError.response?.data?.error ?? 'Unable to submit your solution.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="page-frame"><Skeleton className="h-10 detail-skeleton" /><div className="detail-layout"><Skeleton className="h-96" /><Skeleton className="h-96" /></div></main>;
  if (error || !lab) return <main className="page-frame"><Link className="back-link" to="/labs">← Back to labs</Link><Card className="error-state"><h1>Lab unavailable.</h1><p className="muted">{error ?? 'This lab could not be found.'}</p></Card></main>;

  return <main className="page-frame">
    <Link className="back-link" to="/labs">← Back to labs</Link>
    <div className="detail-heading"><div><span className="eyebrow">{lab.category} / {lab.difficulty}</span><h1>{lab.title}</h1></div><Badge tone="blue">Practical lab</Badge></div>
    <div className="detail-layout">
      <Card>
        <span className="eyebrow">THE BRIEF</span>
        <p className="detail-description">{lab.description}</p>
        <h2>Starter context</h2>
        <pre className="code-block"><code>{lab.starter_code || '# No starter code provided.'}</code></pre>
        {quizLoading && <Skeleton className="quiz-skeleton" />}
        {!quizLoading && quiz && <div className="quiz-panel"><span className="eyebrow">Think it through</span><p>{quiz}</p></div>}
      </Card>
      <Card>
        <span className="eyebrow">YOUR SUBMISSION</span>
        <h2>Show your work.</h2>
        <p className="muted">Write the commands, explanation, or code that solves this lab. An AI reviewer gives you an instant first-pass verdict.</p>
        <form className="submission-form" onSubmit={handleSubmit}>
          <label className="field" htmlFor="solution"><span className="field-label">Solution</span><textarea id="solution" className="solution-input code-font" value={solution} onChange={(event) => setSolution(event.target.value)} placeholder="Paste your solution here..." rows="14" required /></label>
          <Button type="submit" disabled={saving}>{saving ? 'Submitting…' : 'Submit solution'}</Button>
        </form>
        <AiResultPanel result={aiResult} />
      </Card>
    </div>
    <Toast message={message} onClose={() => setMessage('')} />
  </main>;
}
