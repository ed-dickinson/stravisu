import React, {useState, useEffect, useRef} from 'react'

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

  const freshFromRedirect = useRef(true)

  // useEffect(()=>{
  //     let debug = ''
  //     if (localStorage.getItem('Athlete')) {
  //       setAthlete(JSON.parse(localStorage.getItem('Athlete')))
  //       debug += 'athlete, '
  //     }
  //     let stored_access_token = localStorage.getItem('AccessToken')
  //     if (stored_access_token) {
  //       let token_expiry = localStorage.getItem('TokenExpires')
  //
  //       if (token_expiry * 1000 > new Date().getTime()) {
  //         setToken({token : stored_access_token, valid : true})
  //         debug += 'valid token, '
  //       } else {
  //         setToken({token : stored_access_token, valid : false})
  //         debug += 'expired token, '
  //       }
  //       debug += 'retrieved from localStorage'
  //     }
  //     console.log(debug)
  //   },[])

    // handles redirect
  useEffect(() => {

    const queryString = window.location.search;
    const route = window.location.pathname.slice(1)


    // cancels if not a redirect
    if (queryString === '') return
    if (route !== 'approval') return

    const urlParams = new URLSearchParams(queryString);



    if (urlParams.get('scope') === 'read,activity:read_all,read_all') {
      // if redirect with approval from Strava
      // then login to mongodb
      // a;so do this if athlete is found in storage

      // only do exchange if token needs refreshing
      // although this would be handy to change to recognising only doing it on the first redirect not on app changes

      console.log('routinn', token)

      if (!freshFromRedirect.current) {
        // return
      } else {
        freshFromRedirect.current = false
      }

      // if (token.valid !== false) {
      if (token.valid === true) {
        return
      }
      // if (token.valid === null) {
      //   // DO SOMETHING HERE TO STOP NON-TRIGGERING ON non-refresh REDIRECT
      //   console.log('token is null')
      //   // return
      // }
      if (localStorage.getItem('AccessToken') && localStorage.getItem('TokenExpires') * 1000 > new Date().getTime()) {
        setToken({token: localStorage.getItem('AccessToken'), valid: true})
        setAthlete(JSON.parse(localStorage.getItem('Athlete')))
        return
      }

      console.log('oAuth')
      oAuthService.exchange({
        code : urlParams.get('code')
      }).then(result => {

        localStorage.setItem('TokenExpires', result.expires_at)
        localStorage.setItem('AccessToken', result.access_token)
        localStorage.setItem('Athlete', JSON.stringify(result.athlete))

        setToken({token: result.access_token, valid: true})
        setAthlete(result.athlete)
        console.log(result.athlete)
      }).catch(err=>{
        console.log('bad auth request')
      })

      // setScope('read,activity:read_all,read_all')
      // setTempToken(urlParams.get('code'))
    } else {
      // this leaves redirect page with no

      setState({...state, scope_rerequest : true})
      return
    }

  }, [token,
    state]) // empty array dependency only runs once



  // use effect for fetching activities
  useEffect(()=>{

    if (activities.length > 0) {return}

    if (token.valid) {
      stravaService.allActivities({
        access_token : token.token,
        activities : activities ,
        setActivities : setActivities
      }).then(res => {
        console.log('fetched runs:', res)
        // setActivities(res)
        setState({...state, fully_loaded : true})
      })
    }
  },[token
  ,activities, athlete
  ])

  // useEffect(()=>{
  //   if (activities.length === 0) {return}
  //   if (athlete) {
  //
  //   console.log('workin')
  //   let now = new Date()
  //
  //   let created_at = new Date(athlete.created_at)
  //   let time_since_creation = now - created_at
  //   let furthest_back = new Date(activities[activities.length-1].start_date_local)
  //   let time_latest = furthest_back - created_at
  //   let percent = (time_latest / time_since_creation) * 100
  //   console.log(percent)
  //   setState({...state, load_progress: percent})
  //   }
  // },[athlete, activities])

  // setState({...state, load_progress: 0})


  // could make header cool loader that estimates load completion by activity date compared to profile creation date
  return (
    <div className="App">
    <header>

      {token.valid ?
        <div>{activities.length} activities loaded from Strava.</div>
        : <div>Not connected to Strava.</div>
      }
      {athlete && activities.length > 0 &&
        <div className="LoadBar" style={{width:(state.fully_loaded?100:calcService.loading([athlete, activities]))+'%'}}></div>
      }

    </header>

    {athlete &&
      <Athlete athlete={athlete}/>
    }

    {activities.length > 0 &&
      <Activities activities={activities} />
    }

    {!token.valid &&
      <a href={"http://www.strava.com/oauth/authorize?client_id="+process.env.REACT_APP_CLIENT_ID+"&response_type=code&redirect_uri="+window.location.origin+"/approval&approval_prompt=auto&scope=read_all,activity:read_all"}><img src="/assets/strava-connect-button@2x.png" alt="StravaConnectButton" /></a>
    }

    <footer>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} className="App-logo" alt="logo" />
        </a>

      </footer>
    </div>
  );
}

export default App;
