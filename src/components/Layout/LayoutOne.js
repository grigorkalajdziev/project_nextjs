import { Fragment } from "react";
import { HeaderOne } from "../Header";
import { FooterOne } from "../Footer";

const LayoutOne = ({ children, aboutOverlay }) => {
  return (
    <Fragment>
      <HeaderOne aboutOverlay={aboutOverlay} />
      {children}
      <FooterOne />
    </Fragment>
  );
};

export default LayoutOne;
