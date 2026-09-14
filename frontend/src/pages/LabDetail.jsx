import { Link } from 'react-router-dom';
import Card from '../components/ui/Card.jsx';

export default function LabDetail() {
  return <main className="page-frame"><Link className="back-link" to="/labs">← Back to labs</Link><Card className="empty-state"><span className="eyebrow">LAB DETAIL</span><h1>Connect a lab to begin.</h1><p className="muted">The API-backed lab detail and submission editor will appear here in the next feature layer.</p></Card></main>;
}
