const API_URL = import.meta.env.VITE_API_URL || 'https://diabetic-assitant.vercel.app';

let authToken: string | null = null;

export const setToken = (token: string) => { authToken = token; };
export const getToken = () => authToken;

const headers = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers(), ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

// Auth
export const requestOtp = (phone: string) =>
  request('/auth/otp/request', { method: 'POST', body: JSON.stringify({ phone }) });

export const verifyOtp = (phone: string, code: string) =>
  request<{ access_token: string }>('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code }) });

// Profile
export const getProfile = () => request('/profile/me');
export const syncProfile = (data: unknown) =>
  request('/profile/me', { method: 'POST', body: JSON.stringify(data) });

// Daily Logs
export const getLogs = () => request('/profile/logs');
export const createLog = (data: unknown) =>
  request('/profile/logs', { method: 'POST', body: JSON.stringify(data) });

// Research / RAG Chat
export const chatWithResearcher = (query: string) =>
  request<{ response: string; sources: unknown[] }>('/research/chat', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });

export const triggerAutonomousResearch = (topic?: string) =>
  request(`/research/autonomous-research${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`, { method: 'POST' });

export const clearKnowledge = () => request('/research/clear-knowledge', { method: 'DELETE' });

// Exams
export const getExamSummary = () => request('/exams/summary');
export const getIndicatorEvolution = (indicator: string) => request(`/exams/evolution/${indicator}`);
export const uploadExam = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return fetch(`${API_URL}/exams/upload`, {
    method: 'POST',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    body: form,
  }).then(r => r.json());
};

// Nutrition
export const getNutritionStatus = () => request('/nutrition/status');
export const getNutritionLogs = () => request('/nutrition/logs');
export const logMeal = (data: unknown) =>
  request('/nutrition/log', { method: 'POST', body: JSON.stringify(data) });

// Workouts
export const getActiveProtocol = () => request('/workouts/active-protocol');
export const prescribeWorkout = (req: string) =>
  request('/workouts/ai/prescribe', { method: 'POST', body: JSON.stringify({ request: req }) });
export const workoutChat = (messages: unknown[]) =>
  request('/workouts/ai/chat', { method: 'POST', body: JSON.stringify({ messages }) });
export const logSet = (data: unknown) =>
  request('/workouts/log-set', { method: 'POST', body: JSON.stringify(data) });

// Predict
export const getPredictiveAnalysis = () => request('/predict/user');

// Autonomous
export const getInsights = (userId: string) => request(`/autonomous/insights/${userId}`);
export const markInsightRead = (id: number) =>
  request(`/autonomous/insights/read/${id}`, { method: 'POST' });
export const triggerMorning = (userId: string) =>
  request(`/autonomous/morning-prep/${userId}`, { method: 'POST' });
export const triggerNight = (userId: string) =>
  request(`/autonomous/night-review/${userId}`, { method: 'POST' });

// Recovery
export const getLatestRecovery = () => request('/recovery/latest');
export const logRecovery = (data: unknown) =>
  request('/recovery/log', { method: 'POST', body: JSON.stringify(data) });

// Experiments
export const listExperiments = () => request('/experiments/list');
export const createExperiment = (data: unknown) =>
  request('/experiments/create', { method: 'POST', body: JSON.stringify(data) });

// Voice
export const voiceCommand = (command: string) =>
  request('/automation/voice-log', { method: 'POST', body: JSON.stringify({ command }) });

// Sync
export const getSyncStatus = () => request('/sync/status');
export const syncHealth = (data: unknown) =>
  request('/sync/health', { method: 'POST', body: JSON.stringify(data) });

// Reports
export const getExpertReport = () => request('/reports/expert');
