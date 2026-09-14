import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setError('');
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.error ?? 'Unable to create your account. Try again.');
    }
  }
  return <main className="auth-page"><div className="auth-card">
    <span className="eyebrow">START PRACTICING</span><h1>Build skill through reps.</h1><p className="lede">Create your student account and begin with a focused lab.</p>
    <form onSubmit={handleSubmit} className="stack-form"><Input id="signup-email" label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" required /><Input id="signup-password" label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={error} autoComplete="new-password" required /><Button type="submit">Create account</Button></form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </div></main>;
}
