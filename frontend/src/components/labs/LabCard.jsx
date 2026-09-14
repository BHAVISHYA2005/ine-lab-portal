import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';

const categoryTone = { linux: 'blue', docker: 'cyan', networking: 'green', security: 'amber' };

export default function LabCard({ lab, featured = false }) {
  return <Card className={featured ? 'lab-card lab-card-featured' : 'lab-card'}>
    <div className="lab-card-meta"><Badge tone={categoryTone[lab.category] ?? 'default'}>{lab.category}</Badge><span className="difficulty">{lab.difficulty}</span></div>
    <h2>{lab.title}</h2><p className="muted">{lab.description}</p>
    <Link className="inline-link" to={`/labs/${lab.id}`}>Open lab →</Link>
  </Card>;
}
