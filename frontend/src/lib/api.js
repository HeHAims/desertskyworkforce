const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? `Request failed: ${response.status}`);
  }

  return response.json();
};

export const api = {
  getDashboard: (locale) => request(`/api/dashboard?locale=${encodeURIComponent(locale)}`),
  createTask: (payload) => request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) }),
  updateMilestone: (taskId, payload) => request(`/api/tasks/${encodeURIComponent(taskId)}/milestone`, { method: 'PATCH', body: JSON.stringify(payload) }),
  sendNotification: (payload) => request('/api/notify', { method: 'POST', body: JSON.stringify(payload) })
};
