import { Fragment } from "react";
import { HeaderSix } from "../Header";
import { FooterTwo } from "../Footer";

const LayoutEight = ({ children }) => {
  return (
    <Fragment>
      <HeaderSix />
      {children}
      <FooterTwo />
    </Fragment>
  );
};

export default LayoutEight;
