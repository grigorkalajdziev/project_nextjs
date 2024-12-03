import { Fragment } from "react";
import { HeaderOne } from "../Header";
import { FooterTwo } from "../Footer";

const LayoutTwo = ({ children, aboutOverlay, footerBgClass }) => {
  return (
    <Fragment>
      <HeaderOne aboutOverlay={aboutOverlay} />
      {children}
      <FooterTwo footerBgClass={footerBgClass} />
    </Fragment>
  );
};

export default LayoutTwo;
