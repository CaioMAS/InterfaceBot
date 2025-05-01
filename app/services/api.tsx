'use client';

export async function fetchStatus(url: string) {
    const response = await fetch(`${url}/status`);
    return response.json();
  }
  
  export async function sellNow(url: string) {
    const response = await fetch(`${url}/sell-now`, { method: 'POST' });
    return response.json();
  }