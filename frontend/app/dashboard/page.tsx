'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.replace('/login');
    else setIsAuthenticated(true);
  }, [router]);
  if (!isAuthenticated) return null; 

  return (
    <main className="min-h-screen bg-black font-monospace p-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white text-center">TasKnot</h1>
    </main>
  );
}
