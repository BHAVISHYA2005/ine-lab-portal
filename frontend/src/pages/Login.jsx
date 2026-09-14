import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.includes('@')) return setError('Enter a valid email address.');
    await login({ email, role: 'student' });
    navigate('/dashboard');
  }
  return <main className="auth-page"><div className="auth-card">
    <span className="eyebrow">INE LAB PORTAL</span><h1>Return to your lab bench.</h1><p className="lede">Sign in to continue your hands-on learning path.</p>
    <form onSubmit={handleSubmit} className="stack-form"><Input id="login-email" label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} autoComplete="email" required /><Button type="submit">Continue</Button></form>
    <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
  </div></main>;
}
