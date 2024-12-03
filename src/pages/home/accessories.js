import { LayoutSix } from "../../components/Layout";
import { AccessoriesContent } from "../../components/HomeContent";
import { BlogPostSlider } from "../../components/Blog";
import blogData from "../../data/blog-posts/blog-post-one.json";

const Accessories = () => {
  return (
    <LayoutSix>
      {/* accessories content */}
      <AccessoriesContent />
      {/* blog post slider */}
      <BlogPostSlider blogData={blogData} spaceBottomClass="space-mb--r100" />
    </LayoutSix>
  );
};

export default Accessories;
