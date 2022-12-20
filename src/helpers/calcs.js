const exported = {
  loading : input => {

    let athlete = input[0]
    let activities = input[1]

    if (activities.length === 0) {return 0}

    let now = new Date()

    let created_at = new Date(athlete.created_at)
    let time_since_creation = now - created_at
    let furthest_back = new Date(activities[activities.length-1].start_date_local)
    let time_latest = furthest_back - created_at
    let percent = (time_latest / time_since_creation) * 100

    let output = 100 - percent

    return output
  }

  
}

export default exported
