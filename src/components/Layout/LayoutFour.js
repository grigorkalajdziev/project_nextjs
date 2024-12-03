import { Fragment } from "react";
import { HeaderFour } from "../Header";
import { FooterTwo } from "../Footer";

const LayoutFour = ({ children }) => {
  return (
    <Fragment>
      <HeaderFour />
      {children}
      <FooterTwo />
    </Fragment>
  );
};

export default LayoutFour;
