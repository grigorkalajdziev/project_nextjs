import Link from "next/link";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { getProducts } from "../../lib/product";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SectionTitleThree } from "../../components/SectionTitle";
import { ProductGridWrapper } from "../../components/ProductThumb";

const ProductAttributes = ({ products }) => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Product Attributes"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Product Attributes</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        <SectionTitleThree
          title="Product Attributes"
          subtitle="This is where to find your satisfactory products"
        />
        <Container>
          <Row>
            <ProductGridWrapper
              products={products}
              column={4}
              bottomSpace="space-mb--r50"
            />
            <Col lg={12} className="text-center">
              <Link
                href="/shop/left-sidebar"
                as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
              >
                <a className="lezada-loadmore-button">
                  <IoIosAdd /> SEE MORE ...
                </a>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};
const mapStateToProps = (state) => {
  const products = state.productData;
  return {
    products: getProducts(products, "decor", "popular", 8)
  };
};

export default connect(mapStateToProps)(ProductAttributes);
