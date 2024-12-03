import { LayoutFour } from "../../components/Layout";
import { LookbookContent } from "../../components/HomeContent";
import { ShopInfo } from "../../components/Shop";

const Lookbook = () => {
  return (
    <LayoutFour>
      {/* lookbook content */}
      <LookbookContent spaceBottomClass="space-mb--50" />
      {/* shop info */}
      <ShopInfo />
    </LayoutFour>
  );
};

export default Lookbook;
