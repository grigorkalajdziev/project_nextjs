import { useState, useEffect, useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import Swiper from "react-id-swiper";
import { useLocalization } from "../../context/LocalizationContext";

const HeroSliderTwo = ({ sliderData, spaceBottomClass }) => {
  const { t, currentLanguage, translationsReady } = useLocalization();
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only set ready when translations are actually loaded
    if (translationsReady) {
      setIsReady(true);
    }
  }, [translationsReady]);

  // useMemo prevents the Swiper engine from re-initializing 
  // every time the component re-renders.
  const params = useMemo(() => ({
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
      <button className="swiper-button-prev ht-swiper-button-nav" aria-label="prev"></button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav" aria-label="next"></button>
    ),
    // IMPORTANT: These help react-id-swiper handle React updates
    shouldSwiperUpdate: true,
    rebuildOnUpdate: true 
  }), []);

  if (!isReady || !sliderData) {
    return (
      <div className="hero-slider-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`hero-slider-two ${spaceBottomClass || ""}`}>
      <div className="hero-slider-two__wrapper">
        {/* Removed key={currentLanguage} to prevent the 'Element does not exist' crash */}
        <Swiper {...params}>
          {sliderData.map((single, i) => (
            <div
              className="hero-slider-two__slide"
              style={{ backgroundColor: single.bgcolor }}
              key={i} 
            >
              <div className="hero-slider-two__image">
                <Image
                  // In Next.js, images in /public don't need PUBLIC_URL
                  src={single.image} 
                  alt=""
                  className="img-fluid"
                  width={600}
                  height={800}
                  priority={i === 0}
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
                    className="lezada-button lezada-button--medium"
                    onClick={() => setLoading(true)}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      t("shop_now")
                    )}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSliderTwo;