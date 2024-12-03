import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { ProductGridWrapper } from "../ProductThumb";

const ProductTabTwo = ({ newProducts, popularProducts, saleProducts }) => {
  return (
    <div className="product-tab product-tab--style2 space-mb--r100">
      <Container>
        <Tab.Container defaultActiveKey="popular">
          <Nav
            variant="pills"
            className="product-tab__navigation text-center space-mb--r60"
          >
            <Nav.Item>
              <Nav.Link eventKey="popular">Popular</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="new">New</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sale">Sale</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="popular">
              <Row>
                <ProductGridWrapper
                  column={4}
                  products={popularProducts}
                  bottomSpace="space-mb--r50"
                />
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="new">
              <Row>
                <ProductGridWrapper
                  column={4}
                  products={newProducts}
                  bottomSpace="space-mb--r50"
                />
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="sale">
              <Row>
                <ProductGridWrapper
                  column={4}
                  products={saleProducts}
                  bottomSpace="space-mb--r50"
                />
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        <Row>
          <Col lg={12} className="text-center">
            <Link
              href="/shop/left-sidebar"
              as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
            >
              <a className="lezada-button lezada-button--medium lezada-button--icon--left">
                <IoIosAdd />
                Online Store
              </a>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductTabTwo;
