
import React, { useEffect, useState } from "react";
import axios from "axios";

const Scroll = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get(
        "https://q4l8x4.deta.dev/top"
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



  return(
  <div className="ScrollFa">
            <h1>Top Mangas</h1>

  <div className="Scroll" id="Scroll" onScroll={scroll}>
      {posts.length === 0 ? <p>Carregando</p> : (
        posts.map((post) => (
          <div key={post.id}  id="Card" >

                    <div className="Cards">
                        <div id="cardH" >
                           
                            <div className="CardH" onMouseOver={imgCard} onMouseLeave={imgCard2}>
                                <h5>{post.title}</h5>
                                <h5>Capítulo.{post.chapters_count}</h5>
                                <button className="umB">Clique para Ler</button>
                                <button>Mais</button>
                            </div>
                            <img id="imgCard"    src={post.image} alt="logo" />
                        </div>
                    </div>
                    <h5>{post.title}</h5>
            </div>
        ))
      )}
    </div>
    </div>
  )


  function scroll(){
document.getElementById('Scroll').scrollLeft += 5
  }
function imgCard() {

}

function imgCard2(){
    document.querySelector('.CardH').style.animation = 'slide-in-fwd-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
}

}

export default Scroll