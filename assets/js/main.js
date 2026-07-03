/**
 * ============================================
 * SCM Garam — Global JavaScript
 * Auth Token, Dark Mode, API Helpers
 * ============================================
 */

// ---- Konfigurasi API ----
const API_BASE_URL = 'http://localhost:8000/api';

// ---- Dark Mode Toggle ----
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'
    ? '<i class="fas fa-sun"></i> Light'
    : '<i class="fas fa-moon"></i> Dark';
}

// ---- Auth Token Management ----
function getToken() {
  return localStorage.getItem('auth_token');
}

function setToken(token) {
  localStorage.setItem('auth_token', token);
}

function removeToken() {
  localStorage.removeItem('auth_token');
}

function getUser() {
  const data = localStorage.getItem('auth_user');
  return data ? JSON.parse(data) : null;
}

function setUser(user) {
  localStorage.setItem('auth_user', JSON.stringify(user));
}

function isAuthenticated() {
  return !!getToken();
}

function logout() {
  removeToken();
  localStorage.removeItem('auth_user');
  window.location.href = '/scm-garam/frontend/auth/login.html';
}

// ---- API Helper Functions ----
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.status === 401) {
      showAlert('error', 'Sesi habis', 'Silakan login kembali.');
      logout();
      return null;
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error('API Error:', error);
    showAlert('error', 'Gagal!', 'Tidak dapat terhubung ke server.');
    return null;
  }
}

async function apiGet(endpoint) {
  return apiRequest(endpoint, 'GET');
}

async function apiPost(endpoint, body) {
  return apiRequest(endpoint, 'POST', body);
}

async function apiPut(endpoint, body) {
  return apiRequest(endpoint, 'PUT', body);
}

async function apiDelete(endpoint) {
  return apiRequest(endpoint, 'DELETE');
}

// ---- SweetAlert2 Wrapper ----
function showAlert(icon, title, text) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({ icon, title, text, confirmButtonColor: '#1565c0' });
  } else {
    alert(`${title}: ${text}`);
  }
}

function showConfirm(title, text) {
  if (typeof Swal !== 'undefined') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1565c0',
      cancelButtonColor: '#e53935',
      confirmButtonText: 'Ya, lanjut!',
      cancelButtonText: 'Batal'
    });
  }
  return Promise.resolve({ isConfirmed: confirm(`${title}\n${text}`) });
}

function showToast(icon, title) {
  if (typeof Swal !== 'undefined') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    Toast.fire({ icon, title });
  }
}

// ---- Utility: Format Rupiah ----
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
}

// ---- Utility: Format Tanggal ----
function formatDate(dateStr) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

// ---- Init saat halaman load ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Bind toggle button
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }

  // Bind logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showConfirm('Logout?', 'Anda yakin ingin keluar?').then((result) => {
        if (result.isConfirmed) logout();
      });
    });
  }

  // Set nama user di navbar
  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    const user = getUser();
    if (user) userNameEl.textContent = user.name;
  }
});
