async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Email & password required');
    return;
  }

  const { data, error } =
    await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    alert(error.message);
    return;
  }

  // session flag
  sessionStorage.setItem('admin', 'true');

  // redirect to dashboard
  location.href = 'admin/dashboard.html';
}
