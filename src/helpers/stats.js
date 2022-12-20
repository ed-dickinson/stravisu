const exported = {

  streak : input => {

    const matchRunDate = (days) => {

      let activities = input

      let d = new Date()

      d.setDate(d.getDate() - days)

      let found = activities.find(x => {
        return new Date(x.start_date_local).toDateString() === new Date(d).toDateString()
      })

      return found
    }

    let start_on

    if (matchRunDate(0)) {
      // starts today
      // inc_today = true
      start_on = 0
      console.log('found run today')
    } else if (matchRunDate(1)) {
      // starts yesterday
      // inc_today = false
      start_on = 1
      console.log('found run yesterday')
    // } else if (matchRunDate(2)) {
    //   // starts yesterday
    //   // inc_today = false
    //   start_on = 2
    //   console.log('found run 2 days ago')
    // } else if (matchRunDate(3)) {
    //   start_on = 3
    //   console.log('found run 3 days ago')
    }

    let streak = 0

    while (matchRunDate(streak + start_on)) {
      streak++
    }
    return streak
  }

  ,

  distanceAll : input => {

    let output = 0

    input.forEach(act => {
      output += act.distance
    })
    return output
  }

  ,

  distanceYear : input => {

    let output = 0

    input.forEach(act => {
      if (new Date(act.start_date_local).getYear() === new Date().getYear()) {
        output += act.distance
      }

    })
    return output
  }
}

export default exported
