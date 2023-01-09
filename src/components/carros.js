import ImageGallery from 'react-image-gallery';
import React from 'react';

const images = [
  {
    original: 'https://i.ibb.co/zsrptxz/Y-Sh.png',
  },
  {
    original: 'https://i.ibb.co/Ny923x1/My-hero-Academia-2.png',
  },
  {
    original: 'https://i.ibb.co/jvbHLFs/Preto-e-Azul-Moderno-A-o-Gaming-Transmiss-o-ao-vivo-Capa-para-Facebook-4.png',
  },
  {
    original: 'https://i.ibb.co/KN01V5b/The-begging.png',
  },
  {
    original: 'https://i.ibb.co/KzRcKgG/Chainsaw-Man-1.png',
  },
  {
    original: 'https://i.ibb.co/zNScJtz/Tales-of-Demons-And-Gods.png',
  },
  {
    original: 'https://i.ibb.co/9vsRTWv/Design-sem-nome.png',
  },
];

class MyGallery extends React.Component {
  render() {
    return <ImageGallery slideDuration={400} slideInterval={10000} items={images} autoPlay={true} showPlayButton={false} showFullscreenButton={false} showBullets={true} disableKeyDown={false}  />;
  }
}

export default MyGallery

