const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')

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
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find()
  res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('campgrounds/details', { campground })
})

app.post('/campgrounds', async (req, res) => {
  const newCampground = new Campground(req.body.campground)
  await newCampground.save()
  res.redirect(`/campgrounds/${newCampground._id}`)
})

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`)
})
