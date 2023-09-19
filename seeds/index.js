const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places, descriptions, prices } = require('./seedHelpers')
const campground = require('../models/campground')

mongoose
  .connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(() => {
    console.log('Mongo yelp-camp connection open!')
  })
  .catch((err) => {
    console.log('Oh no mongo error!')
    console.log(err)
  })

function getRandomElement(arr) {
  const randomEl = arr[Math.floor(Math.random() * arr.length)]
  return randomEl
}

const seedDB = async () => {
  for (let i = 0; i <= 20; i++) {
    const location = getRandomElement(cities)
    const descriptor = getRandomElement(descriptors)
    const place = getRandomElement(places)
    const description = getRandomElement(descriptions)
    const price = getRandomElement(prices)
    const campgroundDetails = new Campground({
      name: `${descriptor} ${place}`,
      price,
      location: `${location.city}, ${location.state}`,
      description,
    })
    await campgroundDetails.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
