const API = 'http://localhost:5000/api';
let allUsers = [];

// Get Token
const token = () => localStorage.getItem('token');

//  Auth Headers
const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token()}`
});

//  Redirect if not logged in
if (!localStorage.getItem('token')) {
  window.location.href = 'index.html';
}

//  Load logged-in user info
try {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  document.getElementById('sidebarName').textContent = user.name || 'Admin';
  document.getElementById('sidebarEmail').textContent = user.email || 'admin@vault.com';
  document.getElementById('avatarInitial').textContent = (user.name || 'A')[0].toUpperCase();
} catch(e) {}

//  Show Toast
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.borderLeftColor = type === 'success' ? '#22c55e' : '#ef4444';
  toast.style.borderLeft = `3px solid ${type === 'success' ? '#22c55e' : '#ef4444'}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

//  Show Section
function showSection(section) {
  document.getElementById('usersSection').classList.add('hidden');
  document.getElementById('deletedSection').classList.add('hidden');
  document.getElementById('createSection').classList.add('hidden');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  if (section === 'users') {
    document.getElementById('usersSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = 'All Users';
    document.getElementById('pageSubtitle').textContent = 'Manage your users';
    document.querySelectorAll('.nav-item')[0].classList.add('active');
    loadUsers();
  } else if (section === 'deleted') {
    document.getElementById('deletedSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = 'Deleted Users';
    document.getElementById('pageSubtitle').textContent = 'Restore deleted records';
    document.querySelectorAll('.nav-item')[1].classList.add('active');
    loadDeletedUsers();
  } else if (section === 'create') {
    document.getElementById('createSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = 'Add New User';
    document.getElementById('pageSubtitle').textContent = 'Create a new account';
    document.querySelectorAll('.nav-item')[2].classList.add('active');
  }
}

//  Format Date
function formatDate(dateStr) {
  if (!dateStr) return '<span style="color:#8888aa">Never</span>';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

//  Load Dashboard Stats
async function loadStats() {
  try {
    const res = await fetch(`${API}/users/stats`, { headers: headers() });
    const data = await res.json();
    if (data.success) {
      document.getElementById('totalUsers').textContent = data.stats.totalUsers;
      document.getElementById('activeUsers').textContent = data.stats.totalUsers;
      document.getElementById('deletedUsers').textContent = data.stats.deletedUsers;
      document.getElementById('recentLogins').textContent = data.stats.recentLogins;
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

//  Load All Users
async function loadUsers() {
  try {
    const res = await fetch(`${API}/users`, { headers: headers() });
    const data = await res.json();
    allUsers = data.users || [];
    renderUsers(allUsers);
    loadStats();
  } catch (err) {
    document.getElementById('usersTableBody').innerHTML =
      `<tr><td colspan="7" class="loading-row" style="color:#ef4444">❌ Failed to load users</td></tr>`;
  }
}

//  Render Users Table
function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="loading-row">No users found</td></tr>`;
    return;
  }
  tbody.innerHTML = users.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td><span class="role-badge role-${u.role}">${u.role}</span></td>
      <td>${formatDate(u.created_at)}</td>
      <td>${formatDate(u.last_login)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" onclick="openEditModal(${u.id}, '${u.name}', '${u.email}', '${u.role}')">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="btn-delete" onclick="deleteUser(${u.id}, '${u.name}')">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

//  Search Users
function searchUsers() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (q === '') {
    renderUsers(allUsers);
    return;
  }
  const filtered = allUsers.filter(function(u) {
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });
  renderUsers(filtered);
}

//  Load Deleted Users
async function loadDeletedUsers() {
  try {
    const res = await fetch(`${API}/users/deleted`, { headers: headers() });
    const data = await res.json();
    const users = data.users || [];
    document.getElementById('deletedCount').textContent = `${users.length} deleted`;

    const tbody = document.getElementById('deletedTableBody');
    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="loading-row">✅ No deleted users</td></tr>`;
      return;
    }

    tbody.innerHTML = users.map((u, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="role-badge role-${u.role}">${u.role}</span></td>
        <td>${formatDate(u.deleted_at)}</td>
        <td>
          <button class="btn-restore" onclick="restoreUser(${u.id}, '${u.name}')">
            <i class="fa-solid fa-rotate-left"></i> Restore
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    document.getElementById('deletedTableBody').innerHTML =
      `<tr><td colspan="6" class="loading-row" style="color:#ef4444">❌ Failed to load</td></tr>`;
  }
}

//  CREATE USER
document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('newName').value;
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;
  const role = document.getElementById('newRole').value;
  const btn = e.target.querySelector('button');

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();

    if (data.success) {
      showToast(' User created successfully!');
      document.getElementById('createUserForm').reset();
      loadStats();
    } else {
      const msg = document.getElementById('createMsg');
      msg.textContent = data.message;
      msg.style.display = 'block';
      setTimeout(() => msg.style.display = 'none', 4000);
    }
  } catch (err) {
    showToast('Failed to create user', 'error');
  }

  btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create User';
  btn.disabled = false;
});

//  OPEN EDIT MODAL
function openEditModal(id, name, email, role) {
  document.getElementById('editUserId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editEmail').value = email;
  document.getElementById('editRole').value = role;
  document.getElementById('editModal').classList.remove('hidden');
}

//  CLOSE MODAL
function closeModal() {
  document.getElementById('editModal').classList.add('hidden');
}

//  UPDATE USER
document.getElementById('editUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editUserId').value;
  const name = document.getElementById('editName').value;
  const email = document.getElementById('editEmail').value;
  const role = document.getElementById('editRole').value;
  const btn = e.target.querySelector('button');

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/users/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ name, email, role })
    });
    const data = await res.json();

    if (data.success) {
      closeModal();
      showToast('User updated successfully!');
      loadUsers();
    } else {
      const msg = document.getElementById('editMsg');
      msg.textContent = data.message;
      msg.style.display = 'block';
    }
  } catch (err) {
    showToast('Failed to update user', 'error');
  }

  btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
  btn.disabled = false;
});

//  SOFT DELETE USER
async function deleteUser(id, name) {
  if (!confirm(`Soft delete "${name}"? They can be restored later.`)) return;

  try {
    const res = await fetch(`${API}/users/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    const data = await res.json();

    if (data.success) {
      showToast(`"${name}" moved to deleted users`);
      loadUsers();
    } else {
      showToast('Failed to delete', 'error');
    }
  } catch (err) {
    showToast('Server error', 'error');
  }
}

//  RESTORE USER
async function restoreUser(id, name) {
  if (!confirm(`Restore "${name}"?`)) return;

  try {
    const res = await fetch(`${API}/users/${id}/restore`, {
      method: 'PUT',
      headers: headers()
    });
    const data = await res.json();

    if (data.success) {
      showToast(`"${name}" restored successfully!`);
      loadDeletedUsers();
      loadStats();
    } else {
      showToast('Failed to restore', 'error');
    }
  } catch (err) {
    showToast('Server error', 'error');
  }
}

//  LOGOUT
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
}

//  Close modal on overlay click
document.getElementById('editModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('editModal')) closeModal();
});

//  Search Event Listener
document.getElementById('searchInput').addEventListener('input', searchUsers);
document.getElementById('searchInput').addEventListener('keyup', searchUsers);

// Init
loadUsers();
loadStats();