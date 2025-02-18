
let data = [];
const body = document.querySelector("body");
const homePage = document.querySelector(".home-page");
const anchors = () =>document.querySelectorAll("a");
const input = () =>document.querySelector(".search-field");
const buttons = () => document.querySelectorAll("button");
const select = () => document.querySelector("select");
const darkModeBtn = document.querySelector(".dark-mode-btn");

const grid = () => document.querySelector(".countries-grid");
const searchBar = () => document.querySelector(".search-field");
const selectField = () => document.querySelector(".select-region");


selectField().addEventListener("change", () => filter(data));
searchBar().addEventListener("keyup", () => filter(data));

darkModeBtn.addEventListener("click", () => toggleMode());

const mode = localStorage.getItem('mode');
mode === 'dark' ? body.classList.toggle('dark'): {};

fetchData("https://restcountries.com/v3.1/all")
  .then((res) => {
    data = res;
    renderData(data);
  })
  .catch((err) => console.log(err));


function filter(data) {
    renderData(data.filter(
    (country) =>
      country.region.toLowerCase().includes(selectField().value.toLowerCase()) &&
      country.name.official
        .toLowerCase()
        .includes(searchBar().value.toLowerCase())
  ));
}
function back() {
    homePage.innerHTML = `
          <div class="search-filter">
            <div class="search-bar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                
                <input type="text" class="search-field" placeholder="Search for a country..." />
            </div>
            <select name="Filter By Region" class="select-region">
                <option value="" selected disabled>Filter By Region</option>
                <option value="Africa">Africa</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
                <option value="Americas">America</option>
            </select>
        </div>
        <div class="countries-grid">
            
        </div>
`;    
    selectField().addEventListener("change", () => filter(data));
    searchBar().addEventListener("keyup", () => filter(data));
    
}
function renderData(data) {
  const html = data.map((country) => {
    return `
        <a class="country-card" id=${country.cca3}>
                <img class="card-img"  src="${country.flags.png}" alt="country's flag" />
                <div class="card-text">

                    <p class="card-title">${country.name.official}</p>
                    <p>
                        <span><strong>Population: </strong></span> <span> ${country.population}</span>
                    </p>
                    <p>
                        <span><strong>Region: </strong></span> <span>${country.region}</span>
                    </p>
                    <p>
                        <span><strong>Capital: </strong></span> <span>${country.capital}</span>
                    </p>
                </div>
            </a>`;
    
  });
  
  grid().innerHTML = html.join("");
  const allCountries = document.querySelectorAll(".country-card");
  allCountries.forEach((btn) => btn.addEventListener("click", () => renderCountry(btn.id)));
}

async function fetchData(endpoint) {
     try {
        const res = await fetch(endpoint);
        return await res.json();
    } catch (err) {
        return console.error(err);
    }
}


function toggleMode() {
    body.classList.toggle('dark');
    const mode = localStorage.getItem('mode')
    localStorage.setItem('mode', mode === 'dark' ? 'light' : 'dark' )
}

async function renderCountry(code){    
    const country = await fetchData(`https://restcountries.com/v3.1/alpha/${code}`)
    .then((res) => {  
    return res[0];
    })
    .catch((err) => console.log(err));
    homePage.innerHTML = "";

    const html = `
    <main class="details-page">
        <a href="#" id="back-btn" class="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="width: 1.5rem; height: 1.5rem;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg> <p> Back</p>
        </a>
        <div class="details-section">
        <img class="country-flag" src="${country.flags.png}" alt="country's flag" />
        <div class="details-half">
        <h1 class="country-name">${country.name.official}</h1>
        <div class="country-details">
        <div>
        <p>
        <span><strong>Native Name: </strong></span> <span>${country.name.common}</span>
        </p>
        <p>
        <span><strong>Population: </strong></span> <span>${country.population}</span>
        </p>
        <p>
        <span><strong>Region: </strong></span> <span>${country.region}</span>
        </p>
                    <p>
                    <span><strong>Sub Region: </strong></span> <span>${country.subregion}</span>
                    </p>
                    <p>
                    <span><strong>Capital: </strong></span> <span>${country.capital[0]}</span>
                    </p>
                </div>
                <div>
                <p>
                <span><strong>Top Level Domain: </strong></span> <span>${country.tld}</span>
                </p>
                <p>
                <span><strong>Currencies: </strong></span> <span> ${Object.keys(country.currencies)}</span>
                </p>
                <p>
                <span><strong>Languages: </strong></span> <span>${Object.values(country.languages).join(', ')}</span>
                </p>
                </div>
                </div>
                <span class="border-countries-title"><strong>Border Countries: </strong></span> 
                <span class="border-countries">${country.borders ? country.borders.map((border)=> `<a href="#" id="${border}" class="border-btn">${border}</a>`).join('') : "NO Border Countries"}</span>
                </div>
                </div>
                </main>
                `
                homePage.innerHTML = html;
                document.querySelectorAll(".border-btn").forEach((btn) =>
                    btn.addEventListener("click", () => renderCountry(btn.id))
                  );
                  
                const backBtn = document.getElementById("back-btn");
                backBtn.addEventListener("click", () => {
                    back();
                    renderData(data);
                })
                
            };
            