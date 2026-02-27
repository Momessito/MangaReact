import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Mangas from "../backend/mangas";

const Top2 = ({ isExpanded }) => {
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

  const [isLoading, setIsLoading] = useState(true);

  function onLoad() {
    // delay for demo only
    setTimeout(() => setIsLoading(false), 1000);

    // setIsLoading(false)
  }

  return <div className="Container" id="Container3" style={{ height: isExpanded ? 'auto' : '90vh' }}>
    <div className="TopText">
      <Link to={'/Maislidos'}>
        <h1>Mangás Mais Lidos</h1></Link>

    </div>


    {posts.length === 0 ? <p>Carregando</p> : (
      posts.map((post) => (
        <div key={post.title}>
          <Link to={'/mangas/' + post.id} key={post.id} >
            <div className="MostC">
              <div className="img2">
                <img src={post.image} alt="logo"
                  style={{ display: isLoading ? "none" : "block" }}
                  onLoad={onLoad} /></div>
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