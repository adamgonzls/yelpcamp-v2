const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places, descriptions, prices } = require('./seedHelpers')
require('dotenv').config()

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

async function getPhotos() {
  const response = await fetch(
    'https://api.unsplash.com/collections/9046579/photos?per_page=100',
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  )
  const data = await response.json()
  return data
}

const seedDB = async () => {
  await Campground.deleteMany({})
  const photos = await getPhotos()
  for (let i = 0; i <= 20; i++) {
    const location = getRandomElement(cities)
    const descriptor = getRandomElement(descriptors)
    const place = getRandomElement(places)
    const description = getRandomElement(descriptions)
    const price = getRandomElement(prices)
    const randomImage = getRandomElement(photos)
    const image = randomImage.urls.regular
    const campgroundDetails = new Campground({
      name: `${descriptor} ${place}`,
      price,
      location: `${location.city}, ${location.state}`,
      description,
      image,
    })
    // console.log(`image: ${image}`)
    // console.log(campgroundDetails)
    await campgroundDetails.save()
  }
}

// getPhotos()

seedDB().then(() => {
  mongoose.connection.close()
})
