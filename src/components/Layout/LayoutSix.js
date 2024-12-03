import { Fragment } from "react";
import { HeaderThree } from "../Header";
import { FooterTwo } from "../Footer";

const LayoutThree = ({ children }) => {
  return (
    <Fragment>
      <HeaderThree />
      {children}
      <FooterTwo />
    </Fragment>
  );
};

export default LayoutThree;
