import React from 'react'

const Post = (departement , text) => {
  return (
    <section>
      <div>
        <h2>{departement}</h2>
        <p>15:36</p>
      </div>
      <div>
        <p>{text}</p>
      </div>
      <img src="" alt="" />
      <div>
        <img src="" alt="" />
      </div>
    </section>
  )
}

export default Post;