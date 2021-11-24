const favoriteBlog = (blogs) => {
  const max = blogs.reduce((prev, current) => 
    (prev.likes > current.likes) ? prev : current)
  const {_id, url, __v, ...retObj} = max
  return retObj
}

const totalLikes = (blogs) => {
 return blogs.reduce((sum, obj) => {
   return sum + obj.likes
 }, 0)
}

module.exports = {
  favoriteBlog, totalLikes
}