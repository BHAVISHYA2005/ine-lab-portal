import Card from '../components/ui/Card.jsx';

export default function Submissions() {
  return <main className="page-frame"><div className="page-heading"><div><span className="eyebrow">YOUR WORK</span><h1>Submission history.</h1><p className="lede">Review what you have sent and what to improve next.</p></div></div><Card className="empty-state"><h2>No submissions yet.</h2><p className="muted">Complete a lab and your work will be tracked here.</p></Card></main>;
}
