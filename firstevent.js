'use strict'

/* global Events */
/* global _ */

// eslint-disable-next-line no-unused-vars
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
        event: 'card displayed'
      }]
    })
    .groupByUser([], (accumulator, events) => {
      if (accumulator !== null && accumulator !== undefined) {
        return accumulator
      }
      if (events.length > 0) {
        let firstEvent = events[0]
        _.each(events, (event) => {
          if (firstEvent.time > event.time) {
            firstEvent = event
          }
        })
        const firstEventTransformed = {
          country: firstEvent.properties.mp_country_code,
          pushToken: firstEvent.properties['push token'],
          operatingSystem: firstEvent.properties.$os,
          providers: firstEvent.properties['provider id'],
          numberCards: firstEvent.properties['number of cards'],
        }
        return firstEventTransformed
      }
      throw new Error('No accumulator and no events!')
    })
    .map(entry => entry.value)
    .filter(event => true //
      && event.country === parameters.country //
      && event.providers === '481' //
      && event.numberCards > 4
    )
    .map(event => ({
      pushToken: event.pushToken,
      operatingSystem: event.operatingSystem,
    }))
}
