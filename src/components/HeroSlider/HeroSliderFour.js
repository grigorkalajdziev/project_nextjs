import Link from "next/link";
import Swiper from "react-id-swiper";

const HeroSliderFour = ({ sliderData }) => {
  const params = {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: "fade",
    watchSlidesVisibility: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };
  return (
    <div className="hero-slider-four">
      <div className="hero-slider-four__wrapper">
        <Swiper {...params}>
          {sliderData &&
            sliderData.map((single, i) => {
              return (
                <div
                  className="hero-slider-four__slide bg-img"
                  style={{ backgroundImage: `url(${single.bgImage})` }}
                  key={i}
                >
                  <div className="hero-slider-four__content">
                    <h5 className="sub-title">{single.subtitle}</h5>
                    <h1
                      className="title"
                      dangerouslySetInnerHTML={{ __html: single.title }}
                    />
                    <div className="slider-link">
                      <Link
                        href={single.url}
                        as={process.env.PUBLIC_URL + single.url}
                      >
                        <a>shop collection</a>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSliderFour;
