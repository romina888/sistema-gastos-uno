import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCards, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CarouselData } from "../../utils/dataCarousel";

/**
 * Carrusel de tarjetas apiladas (Swiper con efecto "cards").
 * Se desliza con el dedo, el mouse, las flechas o el teclado.
 *  - slides: lista de tarjetas; por defecto usa CarouselData (utils/dataCarousel.jsx)
 */
export function Carousel({ slides = CarouselData }) {
  return (
    <Container>
      <Swiper
        modules={[Navigation, Pagination, A11y, EffectCards]}
        effect="cards"
        grabCursor={true}
        navigation={true}
        pagination={{ type: "fraction" }}
        a11y={{
          prevSlideMessage: "Tarjeta anterior",
          nextSlideMessage: "Tarjeta siguiente",
          firstSlideMessage: "Es la primera tarjeta",
          lastSlideMessage: "Es la última tarjeta",
        }}
      >
        {slides.map(({ titulo, icono: Ico, colores }) => (
          <SwiperSlide
            key={titulo}
            style={{
              background: `linear-gradient(160deg, ${colores[0]}, ${colores[1]})`,
            }}
          >
            <span className="icono">
              <Ico />
            </span>
            <h3>{titulo}</h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

const Container = styled.div`
  width: min(260px, 70vw);
  padding: 16px 0;

  --swiper-navigation-color: #ffffff;
  --swiper-navigation-size: 22px;
  --swiper-pagination-color: #ffffff;

  .swiper {
    width: 100%;
    height: 340px;
  }

  .swiper-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 28px 24px 40px;
    border-radius: 18px;
    color: #ffffff;
    text-align: center;
    user-select: none;
  }

  .icono {
    display: flex;
    font-size: 80px;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .swiper-pagination-fraction {
    bottom: 14px;
    font-size: 0.8rem;
  }
`;
