const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json({ error: 'Title and URL are required fields.' })
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request
  const { id } = request.params

  const updatedBlog = await Blog.findByIdAndUpdate(id, { likes: body.likes }, { new: true })

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.status(200).json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Tarkistetaan, onko poistopyynnön tekijä sama kuin blogin lisääjä
  if (blog.user.toString() === decodedToken.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).json({ error: 'forbidden: you are not the creator of this blog' })
  }
})

// blogsRouter.get('/info', (request, response, next) => {
//   Blog.countDocuments({})
//     .then((numberOfBlogs) => {
//       const currentDate = new Date()
//       response.send(`
//             <p>Bloglist has info for ${numberOfBlogs} Blogs</p>
//             <p>${currentDate}</p>
//           `)
//     })
//     .catch((error) => next(error))
// })

module.exports = blogsRouter