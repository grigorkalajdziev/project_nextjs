import { ProductGridTwoWrapper } from "../../components/ProductThumb";
import { Row } from "react-bootstrap";
const ShopProductsNoSpace = ({ products, layout }) => {
  return (
    <div className="shop-products">
      <Row className={`no-gutters ${layout}`}>
        <ProductGridTwoWrapper products={products} />
      </Row>
    </div>
  );
};

export default ShopProductsNoSpace;
