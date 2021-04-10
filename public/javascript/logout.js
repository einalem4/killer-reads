// logout
async function logout() {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('#desktop-logout').addEventListener('click', logout);
document.querySelector('#mobile-logout').addEventListener('click', logout);
document.querySelector('#footer-logout').addEventListener('click', logout);