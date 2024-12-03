import { Fragment } from "react";
import { HeaderThree } from "../Header";
import { FooterThree } from "../Footer";

const LayoutThree = ({ children }) => {
  return (
    <Fragment>
      <HeaderThree />
      {children}
      <FooterThree />
    </Fragment>
  );
};

export default LayoutThree;
