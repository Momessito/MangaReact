
import React, { useState ,useEffect} from 'react';
import '../App.css';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from 'reactstrap';
import axios from "axios";

const Items = (args) => {
  
  const [items, setitems] = useState([]);

  const getItems = async () => {
    try {
      const response = await axios.get(
        "https://q4l8x4.deta.dev/hot"
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

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };
var id = 0

  const slides = items.map((post) => {
    var color = post.base_color
    id = id + 1
    return (
      <CarouselItem 
        key={id}
        id='Itens'
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <img src={post.image} style={{backgroundColor : color+'7e'}} className='carroselImg' alt={post.id} width='200px'/>
        <div className="Text-left" style={{filter : "invert(1)",color : color,borderRight : "2px solid " + color,borderBottom : "2px solid " + color}}>{post.title}</div>
    <div className="Text-right" style={{filter : "invert(1)",color : color,borderLeft : "2px solid " + color,borderBottom : "2px solid " + color}}><h1>Capitulo:<br /><span>{post.chapters_count}</span></h1></div>
      </CarouselItem>

    );
  });

  return (
    <Carousel className='carros' id='carros'
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      {...args}
    >
      <CarouselIndicators className='indicators'
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl

        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}

export default Items;