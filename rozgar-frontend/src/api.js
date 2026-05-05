// ⚡ RozgarConnect — Central API Service
// All backend calls go through this file
// Base URL — backend running on port 5000

const BASE_URL = 'http://localhost:5000/api';

// ── Helper: get token from localStorage ──
const getToken = () => localStorage.getItem('rozgar_token');

// ── Helper: make API call ──
const apiCall = async (endpoint, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// ── Helper: save login response ──
const saveAuth = (data) => {
    localStorage.setItem('rozgar_token', data.token);
    localStorage.setItem('rozgar_user', JSON.stringify(data.user));
};

// ── Helper: get logged in user ──
export const getUser = () => {
    const user = localStorage.getItem('rozgar_user');
    return user ? JSON.parse(user) : null;
};

// ── Helper: logout ──
export const logout = () => {
    localStorage.removeItem('rozgar_token');
    localStorage.removeItem('rozgar_user');
};

// ── Helper: is logged in ──
export const isLoggedIn = () => !!getToken();

/* ════════════════════════════════════════
   AUTH APIs
════════════════════════════════════════ */

// Worker Register (5-step signup)
export const workerRegister = async (workerData) => {
    const data = await apiCall('/auth/worker/register', 'POST', workerData);
    saveAuth(data);
    return data;
};

// Worker Login
export const workerLogin = async (mobile, password) => {
    const data = await apiCall('/auth/worker/login', 'POST', { mobile, password });
    saveAuth(data);
    return data;
};

// Regular Hirer Register
export const hirerRegister = async (hirerData) => {
    const data = await apiCall('/auth/hirer/register', 'POST', hirerData);
    saveAuth(data);
    return data;
};

// Business Register
export const businessRegister = async (businessData) => {
    const data = await apiCall('/auth/business/register', 'POST', businessData);
    return data; // no token — goes to admin verification queue
};

// Hirer Login
export const hirerLogin = async (email, password) => {
    const data = await apiCall('/auth/hirer/login', 'POST', { email, password });
    saveAuth(data);
    return data;
};

// Admin Login
export const adminLogin = async (email, password) => {
    const data = await apiCall('/auth/admin/login', 'POST', { email, password });
    saveAuth(data);
    return data;
};

// Send OTP
export const sendOtp = async (mobile) => {
    return await apiCall('/auth/send-otp', 'POST', { mobile });
};

// Verify OTP
export const verifyOtp = async (otp) => {
    return await apiCall('/auth/verify-otp', 'POST', { otp });
};

/* ════════════════════════════════════════
   WORKER APIs
════════════════════════════════════════ */

// Get my profile
export const getMyWorkerProfile = async () => {
    return await apiCall('/workers/me');
};

// Update my profile
export const updateWorkerProfile = async (profileData) => {
    return await apiCall('/workers/profile', 'PUT', profileData);
};

// Toggle availability
export const updateAvailability = async (isAvailable, unavailableUntil = null) => {
    return await apiCall('/workers/availability', 'PUT', { isAvailable, unavailableUntil });
};

// Browse workers (for hirers)
export const browseWorkers = async (city, skill, page = 1) => {
    let url = `/workers?page=${page}`;
    if (city) url += `&city=${city}`;
    if (skill) url += `&skill=${skill}`;
    return await apiCall(url);
};

/* ════════════════════════════════════════
   JOB APIs
════════════════════════════════════════ */

// Browse jobs (for workers)
export const browseJobs = async (city, skill, page = 1) => {
    let url = `/jobs?page=${page}`;
    if (city) url += `&city=${city}`;
    if (skill) url += `&skill=${skill}`;
    return await apiCall(url);
};

// Post a new job
export const postJob = async (jobData) => {
    return await apiCall('/jobs', 'POST', jobData);
};

// Apply to a job
export const applyToJob = async (jobId) => {
    return await apiCall(`/jobs/${jobId}/apply`, 'POST');
};

// Withdraw application
export const withdrawApplication = async (jobId) => {
    return await apiCall(`/jobs/${jobId}/apply`, 'DELETE');
};

// Hirer confirms job complete
export const hirerConfirmJob = async (jobId) => {
    return await apiCall(`/jobs/${jobId}/hirer-confirm`, 'PUT');
};

// Worker confirms job complete
export const workerConfirmJob = async (jobId) => {
    return await apiCall(`/jobs/${jobId}/worker-confirm`, 'PUT');
};

// Rate after completion
export const rateJob = async (jobId, stars, comment) => {
    return await apiCall(`/jobs/${jobId}/rate`, 'POST', { stars, comment });
};

/* ════════════════════════════════════════
   HIRER APIs
════════════════════════════════════════ */

// Get my hirer profile
export const getMyHirerProfile = async () => {
    return await apiCall('/hirers/me');
};

// Update hirer profile
export const updateHirerProfile = async (profileData) => {
    return await apiCall('/hirers/profile', 'PUT', profileData);
};

// Get my job posts
export const getMyJobs = async () => {
    return await apiCall('/hirers/jobs');
};

// Get applicants for a job
export const getJobApplicants = async (jobId) => {
    return await apiCall(`/hirers/jobs/${jobId}/applicants`);
};

// Contact a worker
export const contactWorker = async (jobId, workerId) => {
    return await apiCall(`/hirers/jobs/${jobId}/contact/${workerId}`, 'PUT');
};

/* ════════════════════════════════════════
   ADMIN APIs
════════════════════════════════════════ */

export const getAdminStats = async () => await apiCall('/admin/stats');
export const getAdminWorkers = async (search) => await apiCall(`/admin/workers${search ? `?search=${search}` : ''}`);
export const getVerifications = async (status) => await apiCall(`/admin/verifications?status=${status || 'pending'}`);
export const approveBusiness = async (id) => await apiCall(`/admin/verifications/${id}/approve`, 'PUT');
export const rejectBusiness = async (id, reason) => await apiCall(`/admin/verifications/${id}/reject`, 'PUT', { reason });
export const getAdminJobs = async () => await apiCall('/admin/jobs');
export const suspendWorker = async (id) => await apiCall(`/admin/workers/${id}/suspend`, 'PUT');
export const deleteJob = async (id) => await apiCall(`/admin/jobs/${id}`, 'DELETE');