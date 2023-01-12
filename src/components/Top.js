import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';


const Top2 = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get(
        "https://q4l8x4.deta.dev/mostread/total"
      );



      const data = response.data;

      setPosts(data)
    } catch (Error) {
      console.log(Error)
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  function onLoad() {
    // delay for demo only
    setTimeout(() => setIsLoading(false), 1000);

    // setIsLoading(false)
  }

  return <div className="Container" id="Container3">
    <div className="TopText">    
    <h1>Mangás Mais Lidos</h1>
    
    </div>


    {posts.length === 0 ? <p>Carregando</p> : (
      posts.map((post) => (
        <div key={post.title}>
          <Link to={'/mangas/' + post.id} key={post.id} >
            <div className="MostC">
              <img
                alt="ad-img"
                width={300}
                src="https://via.placeholder.com/300x200/8d99ae"
                style={{ display: isLoading ? "block" : "none" }}
              />
              <img src={post.image} alt="logo"
                style={{ display: isLoading ? "none" : "block" }}
                onLoad={onLoad} />
              <div className="texts2">
                <h5>{post.title}</h5>
                <div className="cate2">
                  <h5>⭐{post.score}</h5>
                </div>
                <h4>{post.author}</h4>
                <h6 className="cap">Cap.{post.chapters_count}</h6>
              </div>
            </div>
          </Link>
        </div>
      ))
    )}

  </div>
}

export default Top2