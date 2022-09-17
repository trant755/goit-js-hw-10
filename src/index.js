import './css/styles.css';
var debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchForm.addEventListener('input', debounce(searchCountry, 300));

function searchCountry(e) {
  let country = e.target.value.trim();

  if (country.length < 1) {
    clearInreface();
    return;
  }

  fetchCountries(country)
    .then(resault => {
      if (resault.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        ),
          {
            timeout: 5000,
          };
        clearInreface();
        return;
      }

      if (resault.length > 1) {
        createCountryList(resault);
      }
      if (resault.length === 1) {
        createCountryInfo(resault);
      }
    })
    .catch(error => {
      clearInreface();
      Notify.failure('Oops, there is no country with that name'),
        {
          timeout: 4000,
        };
    });
}

function createCountryList(resault) {
  refs.countryInfo.innerHTML = '';

  const markupLi = resault
    .map(
      res => `
      <li class="country-list__item country-title-box">
        <img class="country-list__svg" src="${res.flags.svg}" width="30"/>
        <p class="country-list__name">${res.name.official}</p>
      </li>
      `
    )
    .join('');

  refs.countryList.innerHTML = markupLi;
}

function createCountryInfo(resault) {
  refs.countryList.innerHTML = '';

  let capital = resault[0].capital.join(', ');
  let languages = Object.values(resault[0].languages).join(', ');
  let res = resault[0];

  const markupInfo = `      
    <div class="country-info__title country-title-box">
        <img class="country-info__svg" src="${res.flags.svg}" width="50" />
        <p class="country-list__name">${res.name.official}</p>
      </div>
      <ul>
        <li>
          <p>Capital: <span class="span">${capital}</span></p>
        </li>
        <li>
          <p>Population: <span class="span">${res.population}</span></p>
        </li>
        <li>
          <p>Languages: <span class="span">${languages}</span></p>
        </li>
      </ul>
      `;

  refs.countryInfo.innerHTML = markupInfo;
}

function clearInreface() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
