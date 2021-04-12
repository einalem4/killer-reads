async function sortDiscussion(event) {
    event.preventDefault();

    const genre = document.getElementById('sort-genre');
    const id = genre.options[genre.selectedIndex].value;
    
    if (!id) {
        const response = await fetch(`/api/genres/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            document.location.replace('/discussions');
          } else {
            alert(response.statusText);
          }
    } 
    else {
        const response = await fetch(`/api/genres/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            document.location.replace(`/discussions/${id}`);
        } else {
            alert(response.statusText);
        }
    }
  }
  
document.querySelector('.sort-form').addEventListener('change', sortDiscussion);