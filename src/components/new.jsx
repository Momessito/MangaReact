
import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
} from 'reactstrap';
import axios from "axios";
import Mangas from "../backend/mangas";

const Slides = (args) => {

  const [Slides, setSlides] = useState([]);

  const getSlides = async () => {
    try {
      const data = await Mangas.getRecents();
      setSlides(data || [])
    } catch (Error) {
      console.log(Error)
    }
  }

  useEffect(() => {
    getSlides();
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);


  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === Slides.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? Slides.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const slides = Slides.map((post) => {
    return (
      <CarouselItem key={post} className='Week2' id='box2'
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <img src={post.image} className='carroselImg' alt={post.id} height='150px' width='100px' />
      </CarouselItem>

    );
  });

  return (
    <Carousel
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
}

export default Slides;