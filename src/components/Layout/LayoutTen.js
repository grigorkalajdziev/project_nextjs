import { Fragment } from "react";
import { HeaderEight } from "../Header";
import { FooterFive } from "../Footer";

const LayoutTen = ({ children }) => {
  return (
    <Fragment>
      <HeaderEight />
      {children}
      <FooterFive />
    </Fragment>
  );
};

export default LayoutTen;
