/* globals fetch */

import 'tachyons'
import { useEffect, useState } from 'react'
import LoadingIndicator from './components/LoadingIndicator'
import CountryData from './components/CountryData'

function formatNum (num) {
  return Intl.NumberFormat('en-US').format(num)
}

function App () {
  const [countries, setCountries] = useState([])
  const [globalStats, setGlobalStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [sortBy, setSortBy] = useState('Country')

  useEffect(() => {
    fetch('https://api.covid19api.com/summary')
      .then(response => response.json())
      .then(data => {
        setCountries(data.Countries)
        setGlobalStats(data.Global)
        setLoading(false)
      })
  }, [])

  function updateSort (event) {
    setSortBy(event.target.value)
  }

  if (loading) {
    return (<LoadingIndicator />)
  }

  if (selectedCountry) {
    return (
      <CountryData
        country={selectedCountry}
        clearSelectedCountry={() => setSelectedCountry(null)}
      />
    )
  }

  const sortedCountries = countries.sort(function (countryA, countryB) {
    let sortVal
    if (countryA[sortBy] < countryB[sortBy]) {
      sortVal = -1
    } else if (countryA[sortBy] > countryB[sortBy]) {
      sortVal = 1
    } else {
      sortVal = 0
    }

    if (sortBy !== 'Country') {
      sortVal = -sortVal
    }

    return sortVal
  })

  return (
    <div className='mw7 center pa2'>
      <h2>Global Cases</h2>
      <div>
        <b>New Cases:</b> {formatNum(globalStats.NewConfirmed)}
      </div>
      <div>
        <b>Total Cases:</b> {formatNum(globalStats.TotalConfirmed)}
      </div>
      <h2>Cases by Country</h2>

      <div>
        <b>Sort by</b>{' '}
        <label>
          <input
            type='radio'
            name='sort'
            value='Country'
            checked={sortBy === 'Country'}
            onChange={updateSort}
          /> Country Name
        </label>{' '}
        <label>
          <input
            type='radio'
            name='sort'
            value='NewConfirmed'
            checked={sortBy === 'NewConfirmed'}
            onChange={updateSort}
          /> New Cases
        </label>{' '}
        <label>
          <input
            type='radio'
            name='sort'
            value='TotalConfirmed'
            checked={sortBy === 'TotalConfirmed'}
            onChange={updateSort}
          /> Total Cases
        </label>{' '}
      </div>

      <ul className='list pl0'>
        {sortedCountries.map((country) => (
          <li key={country.CountryCode}>
            <div className='flex mv2'>
              <div className='f4 w5'>
                <button
                  onClick={() => setSelectedCountry(country)}
                  className='pl0 bw0 bg-white underline pointer blue'
                >
                  {country.Country}
                </button>
              </div>
              <div className='w4 tc'>
                <div className='b'>New Cases</div>
                <div>{formatNum(country.NewConfirmed)}</div>
              </div>
              <div className='w4 tc'>
                <div className='b'>Total Cases</div>
                <div>{formatNum(country.TotalConfirmed)}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
