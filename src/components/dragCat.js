import React, { useEffect,useState } from 'react'
import axios from 'axios';
import ScrollContainer from 'react-indiana-drag-scroll'
import { Link } from 'react-router-dom';

function Categories() {
  const [items, setitems] = useState([]);

  const getItems = async () => {
    try {
      const response = await axios.get(
        "https://q4l8x4.deta.dev/mostread/total"
      );



      const data = response.data;

      setitems(data)
    } catch (Error) {
      console.log(Error)
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  return (<ScrollContainer className="scroll-container scrollH">
                    {items.length === 0 ? <p>Carregando</p> : (
                    items.map((post) => (
    <div className='categories' key={post.id}>
      <Link to={'/manga/' + post.id}>
      <img src={post.image} className='carroselImg' alt={post.id} />
      <h6 className='bottom-title'>{post.title}</h6>
      <h6 className='bottom-author'>{post.author}</h6>
      </Link>
    </div>
                    )))}
  </ScrollContainer>)

}

export default Categories