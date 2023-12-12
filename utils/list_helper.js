const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const winnerBlog = blogs.reduce((max, blog) =>
    (blog.likes > max.likes ? blog : max), blogs[0])

  return {
    title: winnerBlog.title,
    author: winnerBlog.author,
    likes: winnerBlog.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = blogs.reduce((countMap, blog) => {
    countMap[blog.author] = (countMap[blog.author] || 0) + 1
    return countMap
  }, {})

  const mostBlogsAuthor = Object.keys(blogCounts).reduce((maxAuthor, author) => {
    return blogCounts[author] > blogCounts[maxAuthor] ? author : maxAuthor
  }, Object.keys(blogCounts)[0])

  return {
    author: mostBlogsAuthor,
    blogs: blogCounts[mostBlogsAuthor],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null // Palautetaan null tyhjälle listalle
  }

  // Käytetään reduce-metodia laskemaan kirjoittajien likejen yhteenlaskettu määrä
  const likeCounts = blogs.reduce((countMap, blog) => {
    countMap[blog.author] = (countMap[blog.author] || 0) + blog.likes
    return countMap
  }, {})

  // Etsitään kirjoittaja, jonka blogeilla on eniten tykkäyksiä
  const mostLikesAuthor = Object.keys(likeCounts).reduce((maxAuthor, author) => {
    return likeCounts[author] > likeCounts[maxAuthor] ? author : maxAuthor
  }, Object.keys(likeCounts)[0])

  return {
    author: mostLikesAuthor,
    likes: likeCounts[mostLikesAuthor],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}