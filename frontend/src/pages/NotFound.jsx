import { Link } from 'react-router-dom';
export default function NotFound() { return <main className="auth-page"><div className="auth-card"><span className="eyebrow">404</span><h1>That page moved.</h1><p className="lede">The route you requested is not part of this workspace.</p><Link className="button button-primary" to="/dashboard">Return to dashboard</Link></div></main>; }
