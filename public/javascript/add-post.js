async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="title"]').value;
  const author = document.querySelector('input[name="author"]').value;
  const genre = document.querySelector('#genre').value;
  const text = document.querySelector('#text').value;

  const response = await fetch(`/api/new-post`, {
    method: 'POST',
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
    document.location.replace('/new-post');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('.post-form').addEventListener('submit', newFormHandler);