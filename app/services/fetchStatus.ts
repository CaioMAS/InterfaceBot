export async function fetchStatus(url: string, token: string) {
  const response = await fetch(`${url}/status`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include', // <-- ESSENCIAL
  });

  if (!response.ok) {
    throw new Error('Falha ao buscar status');
  }

  return response.json();
}
