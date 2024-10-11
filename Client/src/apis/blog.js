// import axios from '../axios'

// export const apiGetAllBlog = (params) => axios({
//     url: '/blogs',
//     method: 'get',
//     params
//   })

//   export const apiGetBlogById =(bid) => axios ({
//     url: '/blogs/' + bid,
//     method: 'get',
// })

// export const apiLikeBlog = (bid) => axios({
//     url: `/blogs/like/` + bid,
//     method: 'put',
//   })

//   export const apiDislikeBlog = (bid) => axios({
//     url: `/blogs/dislike/` + bid,
//     method: 'put',
//   })

import axios from '../axios';

export const apiGetAllBlog = (params) => axios({
  url: '/blogs',
  method: 'get',
  params,
});

export const apiGetBlog = (bid) => axios({
  url: `/blogs/`+bid,
  method: 'get',
});


export const apiUpdateLike = (bid) => axios({
  url: `/blogs/like/${bid}`,
  method: 'put',
});

export const apiUpdateDislike = (bid) => axios({
  url: `/blogs/dislike/${bid}`,
  method: 'put',
});

export const apiCreateBlogCategory = (data) => axios({
  url: '/blogcategory/',
  method: 'post',
  data
})

export const apiGetAllBlogCategory = (params) => axios({
  url: '/blogcategory',
  method: 'get',
  params,
});

export const apiUpdateBlogCategory  = (data, bcid) => axios({
  url: '/blogcategory/' + bcid,
  method: 'put',
  data
})

export const apiDeleteBlogCategory  = (bcid) => axios({
  url: '/blogcategory/' + bcid,
  method: 'delete',
})

export const apiCreateBlogPost =(data) => axios ({
  url: '/blogs/',
  method: 'post',
  data
})

export const apiUploadBlogImage = (bid) => axios({
  url: `/blogs/uploadimage/${bid}`,
  method: 'put',
  
});

export const apiComment =(data) => axios ({
  url: '/blogs/comment',
  method: 'put',
  data
})

export const apiReplyComment =(data) => axios ({
  url: '/blogs/reply',
  method: 'put',
  data
})

export const apiUpdateBlog = (data, bid) => axios({
  url: `/blogs/${bid}`,
  method: 'put',
  data
})

export const apiDeleteBlog = (bid) => axios({
  url: '/blogs/' +bid,
  method: 'delete',
})