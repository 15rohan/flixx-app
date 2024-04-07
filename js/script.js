const global = {
    currentPage: window.location.pathname,
    search:{
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0
    },
    api:{
        apiKey: '949088e792c8dcb23f61fae28e06a07f',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
};

//Fetch Data from TMDB
async function fetchAPIData(endpoint){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}

async function displayMovieDetails(){
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieId}`);

    displayBackgroundImage('movie', movie.backdrop_path);

    const div=document.createElement('div');
    div.innerHTML=`
    <div class="details-top">
        <div>
            ${movie.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}"/>`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}"/>`
            } 
        </div>
        <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i> ${movie.vote_average.toFixed(1)}/10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}</p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>` ).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>
    </div>

    <div class="details-bottom">
        <h2>Movie Info</h2>
        <ul>
          <li><span class="text-secondary">Budget:</span> $${numberWithCommas(movie.budget)}</li>
          <li><span class="text-secondary">Revenue:</span> $${numberWithCommas(movie.revenue)}</li>
          <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
          <li><span class="text-secondary">Status:</span> ${movie.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">
            ${movie.production_companies.map((company) => `${company.name}`).join(', ')}
        </div>
    </div>`;
    document.querySelector('#movie-details').appendChild(div);
}

async function displayShowDetails(){
    const showId = window.location.search.split('=')[1];
    const show = await fetchAPIData(`tv/${showId}`);

    displayBackgroundImage('show', show.backdrop_path);
    
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="details-top">
    <div>
      ${show.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}"/>`
        : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}"/>`
      }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i> ${show.vote_average.toFixed(1)}/10
      </p>
      <p class="text-muted">Release Date: ${show.first_air_date}</p>
      <p>${show.overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}</ul>
      <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map((company) => `${company.name}`).join(', ')}</div>
  </div>`;
  
  document.querySelector('#show-details').appendChild(div);
}

function displayBackgroundImage(type,path){
    const div = document.createElement('div');
    div.style.backgroundImage=`url(https://image.tmdb.org/t/p/original/${path})`;
    div.style.backgroundSize='cover';
    div.style.backgroundPosition='center';
    div.style.backgroundRepeat='no-repeat';
    div.style.height='100vh';
    div.style.width='100vw';
    div.style.position='absolute';
    div.style.top='0';
    div.style.left='0';
    div.style.zIndex='-1';
    div.style.opacity='0.2';

    if(type==='movie'){
        document.querySelector('#movie-details').appendChild(div);
    }
    else{
        document.querySelector('#show-details').appendChild(div);
    }
}

const search = async() =>{
    const urlParams=new URLSearchParams(window.location.search);
    global.search.type=urlParams.get('type');
    global.search.term=urlParams.get('search-term');
    if(global.search.term !== '' && global.search.term !== null){
        const {results, page, total_pages, total_results}=await searchAPIData();    
        
        global.search.page=page;
        global.search.totalPages=total_pages;
        global.search.totalResults=total_results;

        if(results.length === 0){
            showAlert('Please enter a movie or show');
        }
        else{
            displaySearchResults(results);
        }
        document.querySelector('#search-term').value='';
    }
    else{
        showAlert('Please enter a movie or a show');
    }
};

async function searchAPIData(){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();
    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
    const data = await response.json();
    hideSpinner();
    return data;
}

function showAlert(message){
    const div=document.createElement('div');
    div.classList.add('alert');
    div.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(div);
    setTimeout(()=> div.remove(), 4000);
}

function displaySearchResults(results){
    document.querySelector('#search-results').innerHTML='';
    document.querySelector('#search-results-heading').innerHTML='';
    document.querySelector('#pagination').innerHTML='';

    document.querySelector('#search-results-heading').innerHTML=`<h2>Showing ${results.length} of ${global.search.totalResults} 
    Results for ${global.search.term}</h2>`;

    if(global.search.type==='tv'){
        results.forEach((show)=>{
            div=document.createElement('div');
            div.classList.add('card');
            div.innerHTML=`
            <a href="tv-details.html?id=${show.id}">
              ${show.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.name}"/>`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.name}"/>`
              }
            </a>
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">
                <small class="text-muted">First Air Date: ${show.first_air_date}</small>
              </p>
            </div>`;
            document.querySelector('#search-results').appendChild(div);
        });
    }
    else{
        results.forEach((movie)=>{
            div=document.createElement('div');
            div.classList.add('card');
            div.innerHTML=`
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
            document.querySelector('#search-results').appendChild(div);
        });
    }

    displayPagination();
}

function displayPagination(){
    const div=document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML=`
    <div class="pagination">
      <button class="btn btn-primary" id="prev">Prev</button>
      <button class="btn btn-primary" id="next">Next</button>
      <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    </div>`;
    document.querySelector('#pagination').appendChild(div);

    if(global.search.page === 1){
        document.querySelector('#prev').disabled = true;
    }

    if(global.search.page === global.search.totalPages){
        document.querySelector('#next').disabled = true;
    }

    document.querySelector('#next').addEventListener('click', async ()=>{
        global.search.page++;
        const {results} = await searchAPIData();
        displaySearchResults(results);
    });

    document.querySelector('#prev').addEventListener('click', async ()=>{
        global.search.page--;
        const {results} = await searchAPIData();
        displaySearchResults(results);
    });
}

async function displaySlider(){
    const {results} = await fetchAPIData('movie/now_playing');

    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path
              ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>`
              : `<img src="images/no-image.jpg" alt="${movie.title}"/>`
            }
        </a>
        <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)}/10
        </h4>`;
        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    });
}

function initSwiper(){
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30, 
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
    });
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html':
            displaySlider();
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularTV();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);