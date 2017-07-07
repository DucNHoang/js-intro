'use strict'

const _ = require('lodash')

// previous versions
// var name = 'Lukas'

// new syntax
let lastName = 'Stehr'
lastName = 'Anslinger'
console.log(lastName)

const firstName = 'Lukas'
  // firstName = 'Melanie'
console.log(firstName)
  // Use const, until you get an error => chgange to let

const person = {
    firstName: 'Lukas',
    lastName: 'Stehr'
  }
  // person = {
  //   firstName: 'Duc'
  // }
person.firstName = 'Melanie'
person['number of cards'] = 4

const users = [person, { firstName: 'Duc', 'number of cards': 10 }]
console.log(users)

// "Functional programming"
// First clean variant
// const cardNumbers = users.map(user => user['number of cards'])
// const totalCards = _.sum(cardNumbers)
// console.log(totalCards)

// 2nd clean variant
const totalCards = _.chain(users)
  .filter(user => user.firstName === 'Duc')
  .map(user => user['number of cards'])
  .sum()
  .value()
console.log(totalCards)

// Loop
_.each(users, (user, index) => {
  console.log(`User ${user.firstName} is at position ${index}`)
})

// Function syntax
// Old way
// const firstNames = _.map(function(user) {
//   return user.firstName
// })
// New syntax without shortcuts
const firstNames1 = _.map((user) => {
  return user.firstName
})
const firstNames2 = _.map(user => {
  return user.firstName
})
const firstNames3 = _.map((user) => user.firstName)
const firstNames4 = _.map(user => user.firstName)
console.log(firstNames1)
console.log(firstNames2)
console.log(firstNames3)
console.log(firstNames4)

// Our rules say:
const firstNames5 = _.map(user => user.firstName)
const firstNames6 = _.map((user) => {
  const firstName2 = user.firstName
  return firstName2
})
const firstNames7 = _.map((user, index) => index)
console.log(firstNames5)
console.log(firstNames6)
console.log(firstNames7)

// Also interesting:
// 1. Asyncronity and event loop
// 2. Callbacks, Promises, yields
// 3. Object destructuring, array destructuring, object shorthand syntax
