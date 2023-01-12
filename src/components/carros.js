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

function href(prop){
switch (prop.target.src) {
  case 'https://i.ibb.co/Ny923x1/My-hero-Academia-2.png':
    window.location.href = '/mangas/1319';
    break;
  case 'https://i.ibb.co/jvbHLFs/Preto-e-Azul-Moderno-A-o-Gaming-Transmiss-o-ao-vivo-Capa-para-Facebook-4.png':
    window.location.href = '/mangas/9948';
    break;
  case 'https://i.ibb.co/KN01V5b/The-begging.png':
    window.location.href = '/mangas/7403';
    break;
  case 'https://i.ibb.co/KzRcKgG/Chainsaw-Man-1.png':
    window.location.href = '/mangas/7739';
    break;
  case 'https://i.ibb.co/zNScJtz/Tales-of-Demons-And-Gods.png':
    window.location.href = '/mangas/2412';
    break;
  case 'https://i.ibb.co/9vsRTWv/Design-sem-nome.png':
    window.location.href = '/mangas/8058';
    break;

  default:
    break;
}

}


class MyGallery extends React.Component {
  render() {
    return <ImageGallery onClick={href} slideDuration={400} slideInterval={10000} items={images} autoPlay={true} showPlayButton={false} showFullscreenButton={false} showBullets={true} disableKeyDown={false}  />;
  }
}

export default MyGallery

