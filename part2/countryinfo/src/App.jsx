import { useState, useEffect } from 'react'
import axios from 'axios';

const Content = ({filteredCountries, setFilteredCountries}) => {
  if (filteredCountries.length===1) {
    return (
        <ContentLine country={filteredCountries[0]}/>
    )
  }
  if (filteredCountries.length > 1 && filteredCountries.length < 11) {
    return (
    <ul>
      {filteredCountries.map(
          country =>
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={()=>setFilteredCountries([country])}>Show</button>
            </li>
          )}
    </ul>
    )
  }
  return <p>Too many matches, specify another filter</p>
}

const Filter = ({filter, handleFilter}) => {
  return (
      <>
        <h1>Find countries</h1>
        <input value={filter} onChange={handleFilter}/>
      </>
  )
}

const ContentLine = ({country}) => {
  return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital[0]}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.entries(country.languages).map(([key, value]) =>
              <li key={key}>{value}</li>,
          )}
        </ul>
        <img src={country.flags.png}/>
      </div>
  )
}

function App() {
  const [filter, setFilter] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios.get('http://studies.cs.helsinki.fi/restcountries/api/all')
        .then(res=> {
          console.log(res.data)
          setAllCountries(res.data);
        })
        .catch()
  }, []);

  const handleFilter = (event) => {
    setFilter(event.target.value.toLowerCase())
    setFilteredCountries(allCountries.filter(country =>country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  return (
    <>
      <Filter filter={filter} handleFilter={handleFilter}/>
      <Content filteredCountries={filteredCountries} setFilteredCountries={setFilteredCountries}/>
    </>
  )
}

export default App