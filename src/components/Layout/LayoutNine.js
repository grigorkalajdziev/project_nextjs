import { Fragment } from "react";
import { HeaderSeven } from "../Header";
import { FooterFour } from "../Footer";

const LayoutTwo = ({ children, aboutOverlay }) => {
  return (
    <Fragment>
      <HeaderSeven aboutOverlay={aboutOverlay} />
      {children}
      <FooterFour />
    </Fragment>
  );
};

export default LayoutTwo;
