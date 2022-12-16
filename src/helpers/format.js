const exported = {
  time : input => {

    let output

    let seconds = input % 60
    let minutes = input - seconds
    minutes = minutes / 60
    minutes = minutes % 60
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    let hours = Math.floor(input / 3600)

    output = `${hours}:${minutes}:${seconds}`

    return output
  }
  ,
  distance : (input, metric) => {
    let value = input / (metric ? 1000 : 1609.344)
    let output = value.toFixed(2) + (metric ? 'km' : 'mi')
    return output
  }
  ,
  elevation : (input, metric) => {
    let value = input * (metric ? 1 : 3.28084)
    let output = value.toFixed(0) + (metric ? 'm' : 'ft')
    return output
  }
}

export default exported
