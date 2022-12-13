import axios from 'axios'

// const athlete = async params => {
//
//   const config = {
//     headers: {Authorization: `Bearer ${params.access_token}`}
//   }
//
//   const response = await axios.get('https://www.strava.com/api/v3/athlete', config)
//
//   return response.data
// }

// const activities = async params => {
//   const config = {
//     headers: {Authorization: `Bearer ${params.access_token}`}
//   }
//
//   const response = await axios.get('https://www.strava.com/api/v3/activities', config)
//
//   return response.data
// }

const exported = {
  activities : async params => {
    const config = {
      headers: {Authorization: `Bearer ${params.access_token}`}
    }

    const response = await axios.get('https://www.strava.com/api/v3/activities', config)

    return response.data
  } ,

  allActivities : async params => {
    const config = {
      headers: {Authorization: `Bearer ${params.access_token}`}
    }

    let data = []
    let i = 1

    while (true) {
      const response = await axios.get(`https://www.strava.com/api/v3/activities?per_page=200&page=${i}`, config)

      data = [...data, ...response.data]
      i += 1

      params.setActivities(data)

      if (response.data.length === 0) {
        break
      }
    }


    return data
  }
}

export default exported
