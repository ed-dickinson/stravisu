import axios from 'axios'

// set up of double call prevention
let active = false

const exchange = async params => {

  // stops double call
  if (active) return
  active = true

  params = {...params,
    client_id : '70098',
    client_secret : process.env.REACT_APP_CLIENT_SECRET,
    grant_type : 'authorization_code'
  }

  const response = await axios.post('https://www.strava.com/oauth/token', params)

  // part of double call prevention
  if (response) {
    active = false
  }

  return response.data
}

const exported = { exchange }

export default exported
