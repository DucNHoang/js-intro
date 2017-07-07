'use strict'

function main() {
  
  const parameters = {
    fromDate: '2017-06-18',
    toDate: '2017-06-19',
    country: 'IT'
  }
  
  return Events({
    from_date: parameters.fromDate,
    to_date: parameters.toDate,
    event_selectors: [{
      event: 'app start'
    }]
  })
  .map(event => ({
      country: event.properties.mp_country_code,
      pushToken: event.properties['push token'],
      operatingSystem: event.properties.$os
    }))
  .filter(event => true //
    && event.country === parameters.country //
    && event.pushToken !== undefined //
    && event.pushToken !== null //
  )
  .map(event => ({
      pushToken: event.pushToken,
      operatingSystem: event.operatingSystem
    }))
  .filter(event => Math.random() < 0.01)
}