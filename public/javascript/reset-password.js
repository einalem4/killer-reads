async function resetPasswordFormHandler(event) {
  event.preventDefault();

  const new_password = document.querySelector('#reset-password').value.trim();
  const urlParams = new URLSearchParams(window.location.search);
  const reset_token = urlParams.get('token');

  if (new_password && reset_token) {
    const response = await fetch('/api/users/reset-password', {
      method: 'PUT',
      body: JSON.stringify({
        new_password,
        reset_token
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      alert(response.json().message);
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector('.reset-form').addEventListener('submit', resetPasswordFormHandler);