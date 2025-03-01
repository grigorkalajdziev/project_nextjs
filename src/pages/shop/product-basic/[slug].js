import { useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { LayoutTwo } from "../../../components/Layout";
import { getDiscountPrice } from "../../../lib/product";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import {
  ImageGalleryBottomThumb,
  ProductDescription,
  ProductDescriptionTab
} from "../../../components/ProductDetails";
import { addToCart } from "../../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist
} from "../../../redux/actions/wishlistActions";
import {
  addToCompare,
  deleteFromCompare
} from "../../../redux/actions/compareActions";
import products from "../../../data/products.json";
import { useLocalization } from "../../../context/LocalizationContext";

const ProductBasic = ({
  product,
  cartItems,
  wishlistItems,
  compareItems,
  addToCart,
  addToWishlist,
  deleteFromWishlist,
  addToCompare,
  deleteFromCompare
}) => {
  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  });

  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization();
  const productPrice = product.price[currentLanguage] || "00.00";
  const discountedPrice = getDiscountPrice(
    productPrice,
    product.discount
  ).toFixed(2);

  const cartItem = cartItems.filter(
    (cartItem) => cartItem.id === product.id
  )[0];
  const wishlistItem = wishlistItems.filter(
    (wishlistItem) => wishlistItem.id === product.id
  )[0];
  const compareItem = compareItems.filter(
    (compareItem) => compareItem.id === product.id
  )[0]; 

  const handleAddToCart = (item, addToast, quantityCount, selectedColor, selectedSize) => {
    addToCart(item, addToast, quantityCount, selectedColor, selectedSize, t);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product, addToast, t); 
  }
  const handleDeleteToWishlist = () => {
    deleteFromWishlist(product, addToast, t); 
  }
  
  const handleAddToCompare = () => {
    addToCompare(product, addToast, t); 
  }
  const handleDeleteToCompare = () => {
    deleteFromCompare(product, addToast, t); 
  }

  return (
    (<LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={product.name[currentLanguage] || product.name["en"]}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              {t("home")}
            </Link>
          </li>
          <li>
            <Link
              href="/shop/left-sidebar"
              as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
            >
              {t("shop")}
            </Link>
          </li>
          <li>{product.name[currentLanguage] || product.name["en"]}</li>
        </ul>
      </BreadcrumbOne>
      {/* product details */}
      <div className="product-details space-mt--r100 space-mb--r100">
        <Container>
          <Row>
            <Col lg={6} className="space-mb-mobile-only--50">
              {/* image gallery bottom thumb */}
              <ImageGalleryBottomThumb
                product={product}
                wishlistItem={wishlistItem}
                addToast={addToast}
                addToWishlist={handleAddToWishlist}
                deleteFromWishlist={handleDeleteToWishlist}
              />
            </Col>

            <Col lg={6}>
              {/* product description */}
              <ProductDescription
                product={product}
                productPrice={productPrice}
                discountedPrice={discountedPrice}
                cartItems={cartItems}
                cartItem={cartItem}
                wishlistItem={wishlistItem}
                compareItem={compareItem}
                addToast={addToast}
                addToCart={handleAddToCart}
                addToWishlist={handleAddToWishlist}
                deleteFromWishlist={handleDeleteToWishlist}
                addToCompare={handleAddToCompare}
                deleteFromCompare={handleDeleteToCompare}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {/* product description tab */}
              <ProductDescriptionTab product={product} />
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>)
  );
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize,
      t
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize,
          t       
        )
      );
    },
    addToWishlist: (item, addToast, t) => {
      dispatch(addToWishlist(item, addToast, t));
    },
    deleteFromWishlist: (item, addToast, t) => {
      dispatch(deleteFromWishlist(item, addToast, t));
    },
    addToCompare: (item, addToast, t) => {
      dispatch(addToCompare(item, addToast, t));
    },
    deleteFromCompare: (item, addToast, t) => {
      dispatch(deleteFromCompare(item, addToast, t));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductBasic);

export async function getStaticPaths() {
  // get the paths we want to pre render based on products
  const paths = products.map((product) => ({
    params: { slug: product.slug }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // get product data based on slug
  const product = products.filter((single) => single.slug === params.slug)[0];

  return { props: { product } };
}
