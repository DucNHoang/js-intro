'use strict'

/* global Events */
/* global _ */
/* global mixpanel */

// eslint-disable-next-line no-unused-vars
function main() {

  const parameters = {
    fromDate: '2017-05-31',
    toDate: '2017-06-18',
    targeting: {
      is_xopen_eligible: false, // boolean
      regions: ['DE', 'IT'], // ['DE', 'IT'],
      provider_ids: ['481'],
      not_provider_ids: ['160'],
      languages: ['EN'], // UPPERCASE
      not_languages: undefined,
      platforms: [{
        name: 'android', // or iOS
        min_app_version: '6.0.0',
        max_app_version: '9.0.0',
        min_os_version: '7.0.0',
        max_os_version: '11.0.0'
      }]
    }
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
          enabledRegions: lastEvent.properties['enabled regions'],
          pushToken: lastEvent.properties['push token'],
          operatingSystem: lastEvent.properties.$os,
          providerIdList: lastEvent.properties['provider id list'], // ['98', '160', '481']
          language: lastEvent.properties['language code'],
          appVersion: {
            foriOS: lastEvent.properties.$app_release,
            forAndroid: lastEvent.properties.$app_version
          },
          OS: {
            name: lastEvent.properties.$os,
            version: lastEvent.properties.$os_version
          }

        }
        return lastEventTransformed
      }
      return accumulator
    })
    .map(entry => entry.value)
    .filter(event => true //
      && checkRegions(event, parameters.targeting.regions) //
      && checkProviderIdList(event, parameters.targeting.provider_ids, parameters.targeting.is_xopen_eligible) //
      && checkNotProviderIdList(event, parameters.targeting.not_provider_ids) //
      && checkLanguages(event, parameters.targeting.languages) //
      && checkNotLanguages(event, parameters.targeting.not_languages) //
      && checkAppVersion(event, parameters.targeting.platforms) //
      && checkOsVersion(event, parameters.targeting.platforms)
    )
    .map(event => ({
      pushToken: event.pushToken,
      operatingSystem: event.operatingSystem,
    }))
    .reduce(mixpanel.reducer.count())
}

function checkProviderIdList(event, providerIds, xopen) {
  if (xopen === true) {
    return true
  }
  if (providerIds === undefined || providerIds === null) {
    return true
  }
  const providerIdList = event.providerIdList
  const found = _.intersection(providerIds, providerIdList).length > 0
  return found
}

function checkNotProviderIdList(event, notProviderIds) {
  if (notProviderIds === undefined || notProviderIds === null) {
    return true
  }
  const providerIdList = event.providerIdList
  const notFound = _.intersection(notProviderIds, providerIdList).length === 0
  return notFound
}

function checkRegions(event, regions) {
  if (regions === undefined || regions === null) {
    return true
  }
  const regionsEvent = event.enabledRegions
  const found = _.intersection(regions, regionsEvent).length > 0
  return found
}

function checkLanguages(event, languages) {
  if (languages === undefined || languages === null) {
    return true
  }
  const languageEvent = event.language
  const found = _.intersection(languages, [languageEvent]).length > 0
  return found
}

function checkNotLanguages(event, notLanguages) {
  if (notLanguages === undefined || notLanguages === null) {
    return true
  }
  const languageEvent = event.language
  const notFound = _.intersection(notLanguages, [languageEvent]).length === 0
  return notFound
}

// COMPARING VERSIONS

function checkAppVersion(event, platforms) {
  const minAppVersion = platforms.min_app_version
  const maxAppVersion = platforms.max_app_version
  if (platforms.name !== 'android') {
    const eventAppVersion = event.appVersion.foriOS
    if (gte(eventAppVersion, minAppVersion) && lte(eventAppVersion, maxAppVersion)) {
      return true
    }
    return false
  }
  const eventAppVersion = event.appVersion.forAndroid
  if (gte(eventAppVersion, minAppVersion) && lte(eventAppVersion, maxAppVersion)) {
    return true
  }
  return false
}

function checkOsVersion(event, platforms) {
  if (platforms.name === undefined || platforms.name === null) {
    return true
  }
  if (_.intersection(event.OS.name, platforms.name).length > 0) {
    const minOsVersion = platforms.min_os_version
    const maxOsVersion = platforms.max_os_version
    const osVersion = event.OS.version
    if (gte(osVersion, minOsVersion) && lte(osVersion, maxOsVersion)) {
      return true
    }
    return false
  }
  return false
}
