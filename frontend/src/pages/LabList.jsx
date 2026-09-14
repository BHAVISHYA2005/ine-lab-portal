import { useMemo, useState } from 'react';
import LabCard from '../components/labs/LabCard.jsx';
import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { useLabs } from '../hooks/useLabs.js';

const filters = ['all', 'linux', 'docker', 'networking', 'security'];

export default function LabList() {
  const { data: labs, loading, error, reload } = useLabs();
  const [category, setCategory] = useState('all');
  const filteredLabs = useMemo(() => category === 'all' ? labs : labs.filter((lab) => lab.category === category), [category, labs]);
  return <main className="page-frame"><div className="page-heading"><div><span className="eyebrow">THE CATALOG</span><h1>Labs built for practice.</h1><p className="lede">Choose a focused challenge and work from a real technical prompt.</p></div></div>
    <div className="filter-row" aria-label="Filter labs by category">{filters.map((item) => <button key={item} className={`filter-button ${category === item ? 'selected' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
    {loading && <div className="lab-grid">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="lab-skeleton" />)}</div>}
    {error && <Card className="error-state"><h2>Labs are temporarily unavailable.</h2><p className="muted">{error}</p><button className="button button-secondary" onClick={reload}>Try again</button></Card>}
    {!loading && !error && filteredLabs.length === 0 && <Card className="empty-state"><h2>No labs in this category.</h2><p className="muted">Try another focus area.</p></Card>}
    {!loading && !error && filteredLabs.length > 0 && <div className="lab-grid">{filteredLabs.map((lab, index) => <LabCard key={lab.id} lab={lab} featured={index === 0} />)}</div>}
  </main>;
}
