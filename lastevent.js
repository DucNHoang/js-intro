'use strict'

/* global Events */

// eslint-disable-next-line no-unused-vars
function main() {

  const parameters = {
    fromDate: '2017-06-18',
    toDate: '2017-06-19',
    country: 'IT',
    providerId: '481'
  }

  return Events({
      from_date: parameters.fromDate,
      to_date: parameters.toDate,
      event_selectors: [{
        event: 'app start'
      }]
    })
    .groupByUser([], (accumulator, events) => {
      if (events.length > 0) {
        const lastEvent = events[events.length - 1]
        const lastEventTransformed = {
          country: lastEvent.properties.mp_country_code,
          pushToken: lastEvent.properties['push token'],
          operatingSystem: lastEvent.properties.$os,
          providerIdList: lastEvent.properties['provider id list'], // ['98', '160', '481']
          numberCards: lastEvent.properties['number of cards']
        }
        return lastEventTransformed
      }
      return accumulator
    })
    .map(entry => entry.value)
    .filter(event => true //
      && event.country === parameters.country //
      && checkProviderIdList(event, parameters.providerId) //
      && event.numberCards > 4
    )
    .map(event => ({
      pushToken: event.pushToken,
      operatingSystem: event.operatingSystem
    }))
}
