import React, {useState, useEffect} from 'react'

import logo from './logo.svg';
import './App.css';

import Athlete from './components/Athlete'
import Activities from './components/Activities'

import oAuthService from './helpers/oAuth'
import stravaService from './helpers/strava'
import calcService from './helpers/calcs'


function App() {

  const [token, setToken] = useState({token : null, valid : null})
  const [athlete, setAthlete] = useState(null)
  const [activities, setActivities] = useState([])
  const [state, setState] = useState({})

  const [metric, setMetric] = useState(true)

  useEffect(()=>{
      if (localStorage.getItem('Athlete')) {
        setAthlete(JSON.parse(localStorage.getItem('Athlete')))
      }
      let stored_access_token = localStorage.getItem('AccessToken')
      if (stored_access_token) {
        setToken({
          token : stored_access_token ,
          valid : localStorage.getItem('TokenExpires') * 1000 > new Date().getTime()
        })
      }
    },[])

  // This only happens on a redirect from Strava.
  useEffect(() => {

    // These cancel the useEffect if it's not a redirect.
    const queryString = window.location.search;
    const route = window.location.pathname.slice(1)

    if (queryString === '') return
    if (route !== 'approval') return

    // This triggers if not all of the permissions were checked.
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('scope') !== 'read,activity:read_all,read_all') {
      setState({...state, scope_rerequest : true})
      return
    }

    // This triggers if the token is already valid.
    if (token.valid === true) return

    // This checks the local storage for a valid access token and athlete.
    if (localStorage.getItem('AccessToken') && localStorage.getItem('TokenExpires') * 1000 > new Date().getTime()) {
      setToken({token: localStorage.getItem('AccessToken'), valid: true})
      setAthlete(JSON.parse(localStorage.getItem('Athlete')))
      return
    }

    // This is the actual call to the Strava Authorization.
    oAuthService.exchange({
      code : urlParams.get('code')
    }).then(result => {

      localStorage.setItem('TokenExpires', result.expires_at)
      localStorage.setItem('AccessToken', result.access_token)
      localStorage.setItem('Athlete', JSON.stringify(result.athlete))

      setToken({token: result.access_token, valid: true})
      setAthlete(result.athlete)

      console.log('athlete:', result.athlete)

    }).catch(err=>{
      // setState({error: 'Error authenticating.'})
    })

  }, [token,
    state])



  // This fetches the list of activities from Strava.
  useEffect(()=>{

    // Cancels if there already are activities.
    if (activities.length > 0) {return}

    if (token.valid) {
      setState({...state, fully_loaded : true})
      stravaService.allActivities({
        access_token : token.token,
        activities : activities ,
        setActivities : setActivities
      }).then(res => {
        console.log('fetched runs:', res)
        setState({...state, fully_loaded : true})
      })
    }
  },[token
  ,activities, athlete, state
  ])

  return (
    <div className="App">
    <header>

      {token.valid ?
        <div>{activities.length} activities loaded from Strava.</div>
        : <div>Not connected to Strava.</div>
      }
      {athlete && activities.length > 0 &&
        <div
          className="LoadBar"
          style={{
            width:(state.fully_loaded
              ? 100
              : calcService.loading([athlete, activities]))+'%'
            }}
        >
        </div>
      }

      <button
        className="MetricSwitch"
        onClick={()=>{setMetric(!metric)}}
      >
        {metric ? 'M' : 'I'}
      </button>

    </header>

    {athlete &&
      <Athlete athlete={athlete}/>
    }

    {state.scope_rerequest &&
      <div>You didn't give all the permissions!</div>
    }

    {state.error &&
      <div>{state.error}</div>
    }

    {state.fully_loaded === false &&
      <div>Loading runs...</div>
    }

    {activities.length > 0 &&
      <Activities activities={activities} metric={metric} />
    }

    {!token.valid &&
      <a
        href={
          "http://www.strava.com/oauth/authorize?client_id="
          + process.env.REACT_APP_CLIENT_ID
          + "&response_type=code&redirect_uri="
          + window.location.origin
          + "/approval&approval_prompt=auto&scope=read_all,activity:read_all"
        }
      >
        <img
          src="/assets/strava-connect-button@2x.png"
          alt="StravaConnectButton"
        />
      </a>
    }

    <footer>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={logo}
            className="App-logo"
            alt="React logo"
          />
        </a>

      </footer>
    </div>
  );
}

export default App;
