'use client';

const BACKEND_ADDRESS = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;
const API_URL = BACKEND_ADDRESS + '/auth';

export async function loginApi(email: string, pass: string) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pass }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false as const, error: data.message || `Login failed (${res.status})` };
    }

    if (!data.access_token) {
      return { success: false as const, error: 'Login succeeded but the server did not return a JWT token.' };
    }

    return { success: true as const, accessToken: data.access_token };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : 'Failed to connect.' };
  }
}

export async function registerApi(email: string, pass: string) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pass }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false as const, error: data.message || `Registration failed (${res.status})` };
    }

    return { success: true as const, message: 'Account created successfully! You can now log in.' };
  } catch (err) {
    return { success: false as const, error: err instanceof Error ? err.message : 'Failed to connect.' };
  }
}
