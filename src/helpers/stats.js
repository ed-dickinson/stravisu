const matchRunDate = (days, input) => {

  let activities = input

  let d = new Date()

  d.setDate(d.getDate() - days)

  let found = activities.find(x => {
    return new Date(x.start_date_local).toDateString() === new Date(d).toDateString()
  })

  return found
}

const exported = {

  streak : input => {


    let start_on

    if (matchRunDate(0, input)) {
      // starts today
      // inc_today = true
      start_on = 0
      console.log('found run today')
    } else if (matchRunDate(1, input)) {
      // starts yesterday
      // inc_today = false
      start_on = 1
      console.log('found run yesterday')

    }

    let streak = 0

    while (matchRunDate(streak + start_on, input)) {
      streak++
    }
    return streak
  }

  ,

  // distanceAll : input => {
  //
  //   let output = 0
  //
  //   input.forEach(act => {
  //     output += act.distance
  //   })
  //   return output
  // }
  //
  // ,
  //
  // distanceYear : input => {
  //
  //   let output = 0
  //
  //   input.forEach(act => {
  //     if (new Date(act.start_date_local).getYear() === new Date().getYear()) {
  //       output += act.distance
  //     }
  //
  //   })
  //   return output
  // }
  //
  // ,

  totals : input => {
    let output = {
      total_distance : 0,
      total_elevation : 0,
      year_distance : 0,
      year_elevation : 0
    }

    input.forEach(act => {
      output.total_distance += act.distance
      output.total_elevation += act.total_elevation_gain

      if (new Date(act.start_date_local).getYear() === new Date().getYear()) {
        output.year_distance += act.distance
        output.year_elevation += act.total_elevation_gain
      }

    })

    return output
  }

  ,

  month : input => {
    let now = new Date()

    let output = {
      include_today : 0,
      day : now.getDate(),
      days : 0,
      distance : 0,
      projected : 0
    }


    let d = new Date()
    while (d.getMonth() === now.getMonth()) {
      output.days = d.getDate()
      d.setDate(d.getDate() + 1)
    }


    output.include_today = (matchRunDate(0, input) || now.getHours() > 20) ? true : false

    let lookback = 0
    d = new Date()

    while (d.getMonth() === now.getMonth()) {
      let found_run = matchRunDate(lookback, input)
      console.log(lookback, found_run)
      output.distance += found_run ? found_run.distance : 0
      d.setDate(now.getDate() - lookback)
      lookback++
    }

    output.projected = (output.distance / (output.day - (output.include_today ? 0 : 1))) * output.days

    return output
  }

  ,

  cities : (distance, metric) => {
    let output

    if (distance > 40075000) {
      output = "(that's round the Earth"
      let n = 40075000 / distance
      if (n > 1.25) {
        output += ` ${Math.round(n)}${n%1>=0.75?'¾':n%1>=0.5?'½':'¼'} times`
      }
      output += "!)"

    } else {
      const city_distances = [
       ['Vienna to Prague' , 287], ['London to Edinburgh' , 608], ['Berlin to Barcelona' , 1735], ['Paris to Istanbul' , 2675], ['Oslo to Lisbon', 3251], ['Stockholm to Lisbon', 3440], ['Cairo to Cape Town' , 9441], ['Brussels to Beijing' , 14693]
      ]

      const us_city_distances = [
        ['Phoenix to Tucson' , 195], ['LA to Las Vegas' , 441], ['Nashville to Dallas' , 1121], ['Seattle to San Diego' , 2033], ['Miami to Minneapolis' , 2794], ['Boston to Albuquerque' , 3581], ['NY to San Francisco' , 4740], ['Vancouver to Panama' , 8254], ['Anchorage to Buenos Aires' , 7779 + 8028]
      ]

      let dists = metric ? city_distances : us_city_distances

      let chosen

      dists.forEach(x => {
        if (x[1] * 1000 < distance) {
          chosen = x
        }
      })

      output = chosen ? `(that's from ${chosen[0]}${(distance/chosen[1]) > 2000 ? ' and back' : ''}!)` : '-'
    }


    return output
  }

  ,

  mountains : (elevation, metric) => {
    let output = ''

    if (elevation > 413000) {
      output = 'reach the International Space Station'
      if (elevation >= (413000 * 2)) {
        output += ` ${Math.floor(elevation / 413000)} times over`
      }
    }

    else if (elevation > 100000) {
      output = 'climb to Outer Space'
    }

    else if (elevation > 50000) {
      output = 'climb out of the stratosphere'
    } else if (elevation > 8848.86) {
      output = 'climb Everest'
      let amount = Math.floor(elevation / 8848.86)
      if (amount > 1) {
        output += amount === 2 ? ' twice' : ` ${['three', 'four', 'five'][amount-3]} times`
      }
    } else if (elevation > 6190.5 && !metric) {
      output = 'climb Denali'
    } else if (elevation > 4421 && !metric) {
      output = 'climb Mount Whitney'
    } else if (metric && elevation > 5895) {
      output = 'climb Kilimanjaro'
    } else if (metric && elevation > 4807.81) {
      output = 'climb Mont Blanc'
    } else if (!metric && elevation > 3302.3) {
      output = 'climb San Jacinto Peak'
  } else if (metric && elevation > 2917) {
      output = 'climb Mount Olympus'
    } else if (!metric && elevation > 1558) {
      output = 'climb Devils Tower'
    } else if (!metric && elevation > 1482) {
      output = 'climb Spruce Knob'
    } else if (metric && elevation > 1345) {
      output = 'climb Ben Nevis'
    } else if (elevation > 828) {
      output = 'climb the Burj Khalifa'
    } else if (!metric && elevation > 381) {
      output = 'climb the Empire State Building'
    } else if (metric && elevation > 330) {
      output = 'climb the Eiffel Tower'
    }

    // let metric_mtns = [['the Eiffel Tower', 330],['Ben Nevis', 1345],['Mount Olympus', 2917],['Mont Blanc', 4807.81],['Kilimanjaro', 5895]]
    // let imp_mtns = [['the Empire State Building', 381],[]]

    output = output ? `(that's enough to ${output})!` : '-'

    return output
  }
}

export default exported
