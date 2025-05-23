import { useState, useEffect } from 'react';
import Link from "next/link";
import Swiper from "react-id-swiper";
import { useLocalization } from "../../context/LocalizationContext";

const HeroSliderTwo = ({ sliderData, spaceBottomClass }) => {
  const { t, currentLanguage } = useLocalization(); 
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for button

  useEffect(() => {
    if (currentLanguage) {      
      setIsReady(true);  // Set isReady to true when the language is set
    }
  }, [currentLanguage]);

  if (!isReady) {
    return <div>Loading...</div>;  // Show loading state until localization is ready
  }

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // Simulate loading for 2 seconds
  };

  const params = {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    watchSlidesVisibility: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav"></button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav"></button>
    )
  };

  return (
    <div className={`hero-slider-two ${spaceBottomClass ? spaceBottomClass : ""}`}>
      <div className="hero-slider-two__wrapper">
        <Swiper {...params} key={currentLanguage}>
          {sliderData &&
            sliderData.map((single, i) => {
              return (
                <div
                  className="hero-slider-two__slide"
                  style={{ backgroundColor: single.bgcolor }}
                  key={i}
                >
                  <div className="hero-slider-two__image">
                    <img
                      src={process.env.PUBLIC_URL + single.image}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="hero-slider-two__content">
                    <h5 className="sub-title">{t(single.subtitle)}</h5>
                    <h1
                      className="title"
                      dangerouslySetInnerHTML={{ __html: t(single.title) }}
                    />
                    <div className="slider-link">
                      <Link
                        href={single.url}
                        as={process.env.PUBLIC_URL + single.url}
                        className="lezada-button lezada-button--medium"
                        onClick={handleButtonClick}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          t("shop_now")
                        )}
                      </Link>
                    </div>
                  </div>
                  <div className="hero-slider-two__pagination">
                    <span className="current">{i + 1}</span>
                    <span className="border"></span>
                    <span className="total">{sliderData.length}</span>
                  </div>
                </div>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSliderTwo;
