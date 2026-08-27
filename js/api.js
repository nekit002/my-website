const API_URL = `http://${location.hostname || '127.0.0.1'}:3010`;

export async function request(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}/${path}`, {
      method,
      signal,
      cache: 'no-store',
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(localStorage.getItem('learnico-lab10-token') ? { Authorization: 'Bearer ' + localStorage.getItem('learnico-lab10-token') } : {})
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Cannot connect to the server. Run npm run server in lab-10, then try again.');
  }
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    const error = new Error(details.message || `Request failed (${response.status}). Please try again.`);
    error.status = response.status;
    error.fields = details.fields || {};
    throw error;
  }
  const data = response.status === 204 ? null : await response.json();
  return { data, total: Number(response.headers.get('X-Total-Count') || 0) };
}

function requireStoredUser() {
  try {
    if (JSON.parse(localStorage.getItem('learnico-lab10-user') || 'null')?.id) return;
  } catch {}
  throw new Error('Sign in on the Account page to continue.');
}

export async function addFavorite(courseId) {
  requireStoredUser();
  const { data } = await request(`favorites?courseId=${encodeURIComponent(courseId)}`);
  if (data.length) return;
  await request('favorites', { method: 'POST', body: { id: String(courseId), courseId } });
}

export async function addToCart(courseId) {
  requireStoredUser();
  const { data } = await request(`cart?courseId=${encodeURIComponent(courseId)}`);
  if (data.length) {
    const item = data[0];
    if (item.quantity >= 99) throw new Error('The maximum quantity per course is 99.');
    await request(`cart/${encodeURIComponent(item.id)}`, {
      method: 'PATCH', body: { quantity: item.quantity + 1 }
    });
  } else {
    await request('cart', { method: 'POST', body: { id: String(courseId), courseId, quantity: 1 } });
  }
}
