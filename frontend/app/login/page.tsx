'use client';

import React, { useState } from 'react';
import { loginApi, registerApi } from './api';

export default function Page() {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    if (mode === 'REGISTER' && password !== confirmPassword) {
      setError('Passwords do not match.');
      localStorage.removeItem('access_token');
      setLoading(false);
      setConfirmPassword('');
      setSuccessMessage(null);
      setToken(null);
      return;
    }
    
    try {
      if (mode === 'REGISTER') {
        const result = await registerApi(email, password);
        if (!result.success) {
          localStorage.removeItem('access_token');
          setError(result.error);
          setLoading(false);
          setSuccessMessage(null);
          setToken(null);
        } else {
          setSuccessMessage(result.message || 'Account created successfully!');
          localStorage.removeItem('access_token');
          setMode('LOGIN');
          setError(null);
          setConfirmPassword('');
          setPassword('');
          setLoading(false);
          setToken(null);
        }
      } else {
        const result = await loginApi(email, password);
        if (!result.success) {
          localStorage.removeItem('access_token');
          setError(result.error);
          setLoading(false);
          setConfirmPassword('');
          setSuccessMessage(null);
          setToken(null);
        } else if (result.accessToken) {
          localStorage.setItem('access_token', result.accessToken);
          setToken(result.accessToken);
          setLoading(false);
          setError(null);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black font-monospace p-4">
      <div className="w-full max-w-md bg-black rounded-sm shadow-2xl p-8 border border-purple-800"> 
        <div className="flex flex-col gap-4 mb-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center">TasKnot</h1>

          {/* Swapping Register/Login */}
          <div className="flex gap-2 bg-purple-950 p-1 rounded-sm border border-purple-800">
            <button 
              type="button" 
              onClick={() => { setMode('LOGIN'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-all ${ mode === 'LOGIN' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white' }`}
            > LOGIN </button>
            <button
              type="button"
              onClick={() => { setMode('REGISTER'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-all ${ mode === 'REGISTER' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white' }`}
            > REGISTER </button>
          </div>
        </div>

        {/* Form Login/Register */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider"> Email </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-sm border border-purple-950 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder-slate-600"
              placeholder="name@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-sm border border-purple-950 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder-slate-600"
              placeholder="••••••••"
            />
          </div>
          
          {mode === 'REGISTER' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={mode === 'REGISTER'}
                className="w-full px-4 py-2.5 rounded-sm border border-purple-950 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm placeholder-slate-600"
                placeholder="••••••••"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-sm shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer text-sm"
          > {loading ? 'Processing...' : (mode === 'LOGIN' ? 'Sign In' : 'Register Account')} </button>

          {error && <p className="text-red-400 text-m mt-1 text-center font-medium">{error}</p>}
          {successMessage && <p className="text-emerald-400 text-m mt-1 text-center font-medium">{successMessage}</p>}
        </form>

        {/* Token JWT */}
        {token && (
          <div className="mt-6 p-4 bg-slate-950 border border-purple-800 rounded-sm break-all">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Access Token:</h3>
            <p className="font-mono text-xs text-purple-400 leading-relaxed">{token}</p>
          </div>
        )}

      </div>
    </main>
  );
}

