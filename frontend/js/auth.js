const API = 'http://localhost:5000/api';

//  Switch Tabs
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  } else {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
  }
}

//  Toggle Password Visibility
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
}

//  Show Error
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

//  Show Success
function showSuccess(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

//  LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const btn = e.target.querySelector('button');

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      showError('loginError', data.message || 'Login failed!');
      btn.innerHTML = '<span>Sign In</span><i class="fa-solid fa-arrow-right"></i>';
      btn.disabled = false;
    }
  } catch (err) {
    showError('loginError', 'Server not reachable. Is backend running?');
    btn.innerHTML = '<span>Sign In</span><i class="fa-solid fa-arrow-right"></i>';
    btn.disabled = false;
  }
});

//  REGISTER
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const btn = e.target.querySelector('button');

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (data.success) {
      showSuccess('registerSuccess', 'Account created! Please login.');
      setTimeout(() => switchTab('login'), 2000);
    } else {
      showError('registerError', data.message || 'Registration failed!');
    }
  } catch (err) {
    showError('registerError', 'Server not reachable. Is backend running?');
  }

  btn.innerHTML = '<span>Create Account</span><i class="fa-solid fa-arrow-right"></i>';
  btn.disabled = false;
});

//  Auto redirect if already logged in
if (localStorage.getItem('token')) {
  window.location.href = 'dashboard.html';
}
