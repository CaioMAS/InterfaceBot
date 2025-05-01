export async function sellNow(url: string, token: string) {
  const response = await fetch(`${url}/sell-now`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include' // ✅ ESSENCIAL para CORS funcionar com JWT e front separado
  });

  if (!response.ok) {
    throw new Error('Falha ao vender');
  }

  return response.json();
}
