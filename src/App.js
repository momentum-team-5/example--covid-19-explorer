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

  useEffect(() => {
    fetch('https://api.covid19api.com/summary')
      .then(response => response.json())
      .then(data => {
        setCountries(data.Countries)
        setGlobalStats(data.Global)
        setLoading(false)
      })
  }, [])

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
      <ul className='list pl0'>
        {countries.map((country) => (
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
