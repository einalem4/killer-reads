async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="title"]').value;
  const author = document.querySelector('input[name="author"]').value;
  const genre = document.querySelector('#genre').value;
  const text = document.querySelector('textarea[name="text"]').value;
  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      author,
      genre,
      text
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/user-profile/');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('.post-form').addEventListener('submit', editFormHandler);