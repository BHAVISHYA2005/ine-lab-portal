import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.error ?? 'Unable to sign in. Try again.');
    }
  }
  return <main className="auth-page"><div className="auth-card">
    <span className="eyebrow">INE LAB PORTAL</span><h1>Return to your lab bench.</h1><p className="lede">Sign in to continue your hands-on learning path.</p>
    <form onSubmit={handleSubmit} className="stack-form"><Input id="login-email" label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required /><Input id="login-password" label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={error} autoComplete="current-password" required /><Button type="submit">Continue</Button></form>
    <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
  </div></main>;
}
