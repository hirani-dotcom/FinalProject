function openMenu() {
  document.body.classList += " menu--open"
}

function closeMenu() {
  document.body.classList.remove('menu--open')
}

async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  const sortOption = document.getElementById("sortOption").value;
  const moviesContainer = document.getElementById("moviesContainer");
    const loadingEl = document.getElementById("loading");


  moviesContainer.innerHTML = "";

  if (!query) {
    moviesContainer.innerHTML = "<p class='error-message'>Please enter a movie name.</p>";
    return;
  }

    loadingEl.style.display = "block";


  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${"300143c"}&s=${encodeURIComponent(query)}&type=movie`,
    );
    const data = await response.json(); 

        loadingEl.style.display = "none";

    if (data.Response === "False") {
      moviesContainer.innerHTML = `<p>${data.Error}</p>`;
      return;
    }


    let movies = data.Search;

    // Sort movies
    if (sortOption === "alpha a-z") {
      movies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortOption === "alpha z-a") {
      movies.sort((a, b) => b.Title.localeCompare(a.Title));
    } else if (sortOption === "old-new") {
      movies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    } else if (sortOption === "new-old") {
      movies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    }

    // Limit to first 6 results
    movies = movies.slice(0, 6);

    // Display movies
    movies.forEach((movie) => {
      const poster =
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/200x300?text=No+Image";
      const movieCard = `
        <div class="movie">
          <figure class="movie__img--wrapper">
              <img class="movie__img" src="${poster}" alt="${movie.Title}">
          </figure>
          <div class="movie__title">
              <h3>${movie.Title}</h3>
          </div>
          <div class="movie__year">
              <p>${movie.Year}</p>
          </div>
        </div>
      `;
      moviesContainer.innerHTML += movieCard;
    });
  } catch (error) {
    console.error(error);
    moviesContainer.innerHTML =
      "<p>Something went wrong. Please try again later.</p>";
  }
}