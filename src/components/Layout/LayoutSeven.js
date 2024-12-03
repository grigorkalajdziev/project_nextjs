import { Fragment } from "react";
import { HeaderSix } from "../Header";
import { FooterOne } from "../Footer";

const LayoutSeven = ({ children }) => {
  return (
    <Fragment>
      <HeaderSix />
      {children}
      <FooterOne />
    </Fragment>
  );
};

export default LayoutSeven;
