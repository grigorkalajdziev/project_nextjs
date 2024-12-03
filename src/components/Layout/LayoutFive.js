import { Fragment } from "react";
import { HeaderFive } from "../Header";
import { FooterTwo } from "../Footer";

const LayoutFive = ({ children }) => { 

  return (
    <Fragment>      
      <HeaderFive />
      {children}
      <FooterTwo />
    </Fragment>
  );
};

export default LayoutFive;
