import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useSubmissions } from '../hooks/useSubmissions.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { submissions, loading } = useSubmissions();
  return <main className="page-frame"><div className="page-heading"><div><span className="eyebrow">STUDENT WORKSPACE</span><h1>Good to see you, {user?.email?.split('@')[0] ?? 'student'}.</h1><p className="lede">A clear place to practice, submit, and review your technical work.</p></div><Link className="button button-primary" to="/labs">Browse labs</Link></div>
    <div className="bento-grid"><Card className="bento-hero"><span className="eyebrow">CURRENT PATH</span><h2>Make the next command count.</h2><p>Choose a lab that matches your current edge. Progress comes from deliberate repetition.</p><Link className="inline-link" to="/labs">View available labs →</Link></Card><Card><span className="eyebrow">SUBMISSIONS</span>{loading ? <Skeleton className="metric-skeleton" /> : <strong className="metric">{submissions.length}</strong>}<p className="muted">Tracked attempts</p><Link className="inline-link" to="/submissions">Review history →</Link></Card><Card><span className="eyebrow">FOCUS</span><Badge tone="blue">Hands-on</Badge><h3>Learn by doing</h3><p className="muted">Every lab is designed around a concrete technical outcome.</p></Card></div>
  </main>;
}
