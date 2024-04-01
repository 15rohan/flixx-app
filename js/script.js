const global = {
    currentPage: window.location.pathname
};

//Fetch Data from TMDB
async function fetchAPIData(endpoint){
    const API_KEY = '949088e792c8dcb23f61fae28e06a07f';
    const API_URL = 'https://api.themoviedb.org/3/';
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}

async function displayPopularMovies(){
    const {results} = await fetchAPIData('movie/popular');
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}"/>`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}"/>`
            }
        </a>
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
        </div>`;

        document.querySelector('#popular-movies').appendChild(div);
    });
}

async function displayPopularTV(){
    const {results} = await fetchAPIData('tv/popular');
    results.forEach((tv) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="tv-details.html?id=${tv.id}">
            ${tv.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${tv.poster_path}" class="card-img-top" alt="${tv.name}"/>`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="${tv.name}"/>`
            }
        </a>
        <div class="card-body">
            <h5 class="card-title">${tv.name}</h5>
            <p class="card-text">
                <small class="text-muted">Aired: ${tv.first_air_date}</small>
            </p>
        </div>`;

        document.querySelector('#popular-shows').appendChild(div);
    });
}

function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}
function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}

function highlightActiveLink(){
    const links=document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if(link.getAttribute('href') === global.currentPage){
            link.classList.add('active');
        }
    });
}

function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html':
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularTV();
            break;
        case '/movie-details.html':
            console.log('Movie Details');
            break;
        case '/tv-details.html':
            console.log('TV Details');
            break;
        case '/search.html':
            console.log('Search');
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);