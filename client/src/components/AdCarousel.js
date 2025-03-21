import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdCarousel = () => {
  const settings = {
    dots: false, // Desactivamos los dots para usar custom indicators
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true, // Transición con desvanecimiento
    cssEase: "ease-in-out",
    arrows: true,
  };

  const ads = [
    { src: "/ads/ad1.jpg", alt: "Anuncio 1" },
    { src: "/ads/ad2.jpg", alt: "Anuncio 2" },
    { src: "/ads/ad3.jpg", alt: "Anuncio 3" },
    { src: "/ads/ad4.png", alt: "Anuncio 4" },
    { src: "/ads/ad5.webp", alt: "Anuncio 5" },
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-xl">
      {/* Indicador de progreso superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-300">
        <div className="animate-progress bg-blue-500 h-full"></div>
      </div>

      {/* Slider con transiciones suaves */}
      <Slider {...settings}>
        {ads.map((ad, index) => (
          <div key={index} className="flex justify-center items-center">
            <Image
              src={ad.src}
              alt={ad.alt}
              width={600}
              height={400}
              priority={index === 0} // Optimiza la primera imagen
              placeholder="blur"
              blurDataURL={ad.src} // Simula blur hasta que cargue
              className="rounded-lg transition-transform transform hover:scale-105"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AdCarousel;
