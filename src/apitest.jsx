import React, { useEffect, useState } from "react";
import Mangas from "../backend/mangas";

const MostReaded = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const data = await Mangas.getMostRead();
      setPosts(data || []);
    } catch (Error) {
      console.log(Error)
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  var id = 0

  return <div className="Container" id="Container2">
    <h1>
      Mangás mais lidos
    </h1>

    {posts.length === 0 ? <p>Carregando</p> : (
      posts.map((post) => (
        <div key={post.id} className='SizeC'>
          <div className=" C">
            {foi()}
            <div className="img">
              <div className="spinner"></div>
              <img src={post.image} alt="logo" />
            </div>
            <div className="texts">

              <h5 className="titleh5">{post.title}</h5>
              <p>{post.author}</p>
              <p className="cap">Cap. {post.chapters_count}</p>
              <h6>Generos:</h6>
              <div className="cate">

                <h5>{post.categories[1]}</h5>
                <h5>{post.categories[2]}</h5>
                <h5>{post.categories[3]}</h5>
                <h5>{post.categories[4]}</h5>
                <h5>{post.categories[5]}</h5>
                <h5>{post.categories[6]}</h5>

              </div>
            </div>
          </div>
        </div>
      ))
    )}

  </div>

  function foi() {
    id = id + 1
    return (
      <p id="textS">{id}</p>

    )

  }

}

export default MostReaded