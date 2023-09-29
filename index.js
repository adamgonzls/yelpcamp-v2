const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utilities/ExpressError')
const catchAsync = require('./utilities/catchAsync')

mongoose
  .connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(() => {
    console.log('Mongo yelp-camp connection open!')
  })
  .catch((err) => {
    console.log('Oh no mongo error!')
    console.log(err)
  })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds })
  })
)

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/details', { campground })
  })
)

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
  })
)

app.put(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    })
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

app.post(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    if (!req.body.campground)
      throw new ExpressError('Invalid Campground Data', 400)
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`)
  })
)

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
  })
)

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err
  if (!err.message) err.message = 'Oh No, Something Went Wrong'
  res.status(statusCode).render('error', { err })
})

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`)
})
