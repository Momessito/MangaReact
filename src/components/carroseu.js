
import React, { useState ,useEffect} from 'react';
import '../App.css';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
} from 'reactstrap';
import axios from "axios";
import { Link } from 'react-router-dom';

const Items = (args) => {
  
  const [items, setitems] = useState([]);

  const getItems = async () => {
    try {
      const response = await axios.get(
        "https://q4l8x4.deta.dev/mostread/week"
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);


  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const slides = items.map((post) => {
    return (
        <CarouselItem className='Week' id='box'
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={post.id} 
        interval={10000}
        slide={false}
      >
        <Link to={'/manga/' + post.id} onLoad={categorias}>
        <img src={post.image} className='carroselImg' alt={post.id} />
        <h6 className='bottom-title'>{post.title}</h6>
        <h6 className='bottom-author'>{post.author}</h6>
        <h6 className='top-cap'>Cap.{post.chapters_count}</h6>
        <div>{post.categories[0]}</div>
        <div>{post.categories[1]}</div>
        <div>{post.categories[2]}</div>
        </Link>
      </CarouselItem>

    );
  });

  return (
    <Carousel
    slide={false}
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      {...args}
    >

      {slides}
      <CarouselControl
            className='voltar'
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
                  className='next'
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );

  function categorias(prop) {
    var a = prop.target.parentElement.getElementsByTagName('div')[0]
    var b = prop.target.parentElement.getElementsByTagName('div')[1]
    var c = prop.target.parentElement.getElementsByTagName('div')[2]
    if (a.innerHTML === 'Hentai' || a.innerHTML === 'Ecchi' || b.innerHTML === 'Hentai' || b.innerHTML === 'Ecchi' || c.innerHTML === 'Hentai' || c.innerHTML === 'Ecchi') {
        prop.target.style.filter = 'blur(4px)'

    }
}
}

export default Items;