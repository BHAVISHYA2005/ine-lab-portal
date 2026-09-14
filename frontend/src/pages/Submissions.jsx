import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { useSubmissions } from '../hooks/useSubmissions.js';

const STATUS_LABEL = { approved: 'Approved', rejected: 'Needs changes', needs_review: 'Needs human review', pending: 'Pending' };

export default function Submissions() {
  const { submissions, loading, error, reload } = useSubmissions();
  return <main className="page-frame"><div className="page-heading"><div><span className="eyebrow">YOUR WORK</span><h1>Submission history.</h1><p className="lede">Review what you have sent and what to improve next.</p></div></div>
    {loading && <div className="submission-list">{[1, 2].map((item) => <Skeleton key={item} className="submission-skeleton" />)}</div>}
    {error && <Card className="error-state"><h2>Could not load submissions.</h2><p className="muted">{error}</p><button className="button button-secondary" onClick={reload}>Try again</button></Card>}
    {!loading && !error && submissions.length === 0 && <Card className="empty-state"><h2>No submissions yet.</h2><p className="muted">Complete a lab and your work will be tracked here.</p></Card>}
    {!loading && !error && submissions.length > 0 && <div className="submission-list">{submissions.map((submission) => <Card key={submission.id} className="submission-row">
      <div className="submission-row-main">
        <div>
          <span className="eyebrow">{submission.lab_title ?? `Lab #${submission.lab_id}`}</span>
          <p className="muted submission-date">{new Date(submission.submitted_at).toLocaleString()}</p>
        </div>
        <span className={`status status-${submission.status}`}>{STATUS_LABEL[submission.status] ?? submission.status}</span>
      </div>
      {submission.ai_feedback && <p className="submission-feedback">{submission.ai_feedback}</p>}
    </Card>)}</div>}
  </main>;
}
