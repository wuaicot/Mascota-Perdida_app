// client/src/components/AdCarousel.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AdCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src="/ads/ad1.jpg" alt="Anuncio 1" className="w-full h-auto" />
      </div>
      <div>
        <img src="/ads/ad2.jpg" alt="Anuncio 2" className="w-full h-auto" />
      </div>
      {/* Agrega más slides según sea necesario */}
    </Slider>
  );
};

export default AdCarousel;
