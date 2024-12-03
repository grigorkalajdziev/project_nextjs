import { LayoutNine } from "../../components/Layout";
import { BlogPostSlider } from "../../components/Blog";
import { SectionTitleOne } from "../../components/SectionTitle";
import { HeroSliderSeven } from "../../components/HeroSlider";
import { CategoryGridThree } from "../../components/Category";
import { CountdownTimerOne } from "../../components/Countdown";

import blogData from "../../data/blog-posts/blog-post-one.json";
import heroSliderData from "../../data/hero-sliders/hero-slider-seven.json";

const Collection = () => {
  return (
    <LayoutNine aboutOverlay={false}>
      {/* hero slider */}
      <HeroSliderSeven sliderData={heroSliderData} />
      <div className="space-mb--r100"></div>

      {/* category grid */}
      <SectionTitleOne
        title="Spring summer 2024"
        subtitle="Find your style. Fall fashion 20xx"
      />
      <CategoryGridThree spaceBottomClass="space-mb--r100" />

      {/* countdown */}
      <CountdownTimerOne
        title="Deal of the day"
        backgroundImage="/assets/images/countdown/bg-countdown-1.jpg"
        dateTime="July 07, 2020 12:12:00"
        url="/shop/left-sidebar"
        buttonText="Only $39"
        spaceBottomClass="space-mb--r100"
      />

      {/* blog post slider */}
      <BlogPostSlider blogData={blogData} spaceBottomClass="space-mb--r100" />
    </LayoutNine>
  );
};

export default Collection;
