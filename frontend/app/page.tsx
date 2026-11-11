'use client'

import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.replace('/login');
    else setIsAuthenticated(true);
  }, [router]);
  if (!isAuthenticated) return null; 

  return (
    <main className="min-h-screen flex items-center justify-center bg-black font-monospace p-4">
      <button 
        type="button"
        onClick={() => { router.push("/login"); router.refresh(); }}
        className="flex-1 py-2 text-4xl font-semibold rounded-sm transition-all text-slate-400 hover:text-white"
        > Login/Register </button>
      <button 
        type="button"
        onClick={() => { router.push("/dashboard"); router.refresh(); }}
        className="flex-1 py-2 text-4xl font-semibold rounded-sm transition-all text-slate-400 hover:text-white"
        > Dashboard </button> 
    </main>
  );
}
