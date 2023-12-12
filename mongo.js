const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://andreasluoto1:${password}@cluster0.4rqb1uh.mongodb.net/bloglist?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0,
  }
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Amazing blogi4',
  author: 'Andreas Luoto4',
  url: 'some url4',
})

Blog
  .find({})
  .then(result => {
    result.forEach(blog => {
      console.log(blog)
    })
    mongoose.connection.close()
  })

blog
  .save()
  .then(() => {
    console.log('blog saved!')
    mongoose.connection.close()
  })