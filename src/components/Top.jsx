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


    {posts.length === 0 ?
      <div style={{ padding: '60px 0', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <svg width="40" height="40" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color5)" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 150" />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </svg>
      </div> : (
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