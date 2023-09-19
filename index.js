const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const path = require('path')
const Campground = require('./models/campground')

mongoose
  .connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(() => {
    console.log('Mongo yelp-camp connection open!')
  })
  .catch((err) => {
    console.log('Oh no mongo error!')
    console.log(err)
  })

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find()
  console.log(campgrounds)
  res.render('campgrounds/index', { campgrounds })
})

// app.get('/makecampground', async (req, res) => {
//   const camp = new Campground({
//     name: 'Old Timers Ridge',
//     price: '9.99',
//     description: 'An amazing place',
//     location: 'Tucson, Arizona',
//   })
//   await camp.save()
//   res.send(camp)
// })

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`)
})
