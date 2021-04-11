async function forgotFormHandler(event) {
  event.preventDefault();


  const email = document.querySelector('#email-forgot').value.trim();

  if (email) {
    const response = await fetch('/api/users/forgot', {
      method: 'POST',
      body: JSON.stringify({
        email,
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

document.querySelector('.forgot-form').addEventListener('submit', forgotFormHandler);