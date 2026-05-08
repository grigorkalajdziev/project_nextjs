import { useState, useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import Swiper from "react-id-swiper";
import { useLocalization } from "../../context/LocalizationContext";

const HeroSliderTwo = ({ sliderData, spaceBottomClass }) => {
  const { t, currentLanguage } = useLocalization();
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => ({
    loop: true,
    speed: 1000,
    autoplay: { delay: 5000, disableOnInteraction: false },
    watchSlidesVisibility: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    // Crucial for react-id-swiper to update text/images without unmounting
    rebuildOnUpdate: true,
    shouldSwiperUpdate: true,
    renderPrevButton: () => <button className="swiper-button-prev ht-swiper-button-nav"></button>,
    renderNextButton: () => <button className="swiper-button-next ht-swiper-button-nav"></button>
  }), []);

  if (!sliderData) return null;

  return (
    <div className={`hero-slider-two ${spaceBottomClass || ""}`}>
      <div className="hero-slider-two__wrapper">
        <Swiper {...params}>
          {sliderData.map((single, i) => (
            <div
              className="hero-slider-two__slide"
              style={{ backgroundColor: single.bgcolor }}
              key={i} // Keep the index as key so Swiper updates internal content
            >
              <div className="hero-slider-two__image">
                <Image
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