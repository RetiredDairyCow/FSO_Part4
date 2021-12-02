/* Unit tests */
const _ = require('lodash')

const mostLikedAuthor = (blogsList) => {
  const mapAuthorandLikes = new Map()
  blogsList.forEach(({author, likes}) => {
    if (!mapAuthorandLikes.has(author)) {
      mapAuthorandLikes.set(author, likes)
    }
    else {
      mapAuthorandLikes.set(author, mapAuthorandLikes.get(author) + likes)
    }
  })
  const mostLikes = [...mapAuthorandLikes.entries()].reduce((acc, auth) => auth[1] > acc[1] ? auth : acc)
  const retObj = {
    author : mostLikes[0],
    likes : mostLikes[1]
  }
  return retObj

}

const mostCommonAuthor = (blogsList) => {
  const arr1 = blogsList.map(e => e.author)
  
  /**Function to calculate most common string in blogs author array */
  var mf = 0 /*max freq*/
  var m = 0 /*current max*/
  var author
  for (var i=0; i<arr1.length; i++)
  {
    for (var j=i; j<arr1.length; j++)
    {
      if (arr1[i] == arr1[j])
        m++;
      if (mf<m)
      {
        mf=m; 
        author = arr1[i];
      }
    }
    m=0;
  }
  const blogs = mf
  const retObj = {
    author,
    blogs
  }
  return retObj
}

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
  mostLikedAuthor,
  mostCommonAuthor,
  favoriteBlog,
  totalLikes
}