
const urlParams = new URLSearchParams(window.location.search);
const reset_token = urlParams.get('token');
if (!reset_token || reset_token.length !== 64) { window.location.href = '/forgot-password' }


async function resetPasswordFormHandler(event) {
  event.preventDefault();

  const new_password = document.querySelector('#password-reset').value.trim();
  const confirm_password = document.querySelector('#confirm-reset').value.trim();
  if (new_password !== confirm_password) { alert(`Passwords don't match`); return; }
  if (new_password.length < 6) { alert('password should be at least 6 characters'); return; }

  if (new_password && reset_token) {
    const response = await fetch('/api/users/reset-password', {
      method: 'PUT',
      body: JSON.stringify({
        new_password,
        confirm_password,
        reset_token
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(response, data)
      alert(data.message)
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector('#reset-form').addEventListener('submit', resetPasswordFormHandler);