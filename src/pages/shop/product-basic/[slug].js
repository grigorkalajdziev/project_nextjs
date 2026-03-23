import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { LayoutTwo } from "../../../components/Layout";
import { getDiscountPrice } from "../../../lib/product";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import { FaHome } from "react-icons/fa";
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

// ─── Lazy load heavy product detail components ───────────────────────────────
// These three were the main contributors to the 440kB bundle size.
// By using next/dynamic, they are split into separate chunks and only
// downloaded when the product page is actually visited.

const ImageGalleryBottomThumb = dynamic(() =>
  import("../../../components/ProductDetails").then(
    (mod) => mod.ImageGalleryBottomThumb
  )
);

const ProductDescription = dynamic(() =>
  import("../../../components/ProductDetails").then(
    (mod) => mod.ProductDescription
  )
);

// ProductDescriptionTab sits below the fold, so we can defer it even further
// with ssr: false — it will only load on the client after hydration.
const ProductDescriptionTab = dynamic(
  () =>
    import("../../../components/ProductDetails").then(
      (mod) => mod.ProductDescriptionTab
    ),
  { ssr: false }
);
// ─────────────────────────────────────────────────────────────────────────────

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
  // ✅ Fixed: added [] so this only runs once on mount, not on every render
  useEffect(() => {
    document.querySelector("body").classList.remove("overflow-hidden");
  }, []);

  const { addToast } = useToasts();
  const { t, currentLanguage } = useLocalization();
  const productPrice = product.price[currentLanguage] || "00.00";
  const discountedPrice = getDiscountPrice(
    productPrice,
    product.discount
  ).toFixed(2);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const wishlistItem = wishlistItems.find((item) => item.id === product.id);
  const compareItem = compareItems.find((item) => item.id === product.id);

  const handleAddToCart = (item, addToast, quantityCount, selectedColor, selectedSize) => {
    addToCart(item, addToast, quantityCount, selectedColor, selectedSize, t);
  };

  const handleAddToWishlist = () => addToWishlist(product, addToast, t);
  const handleDeleteToWishlist = () => deleteFromWishlist(product, addToast, t);
  const handleAddToCompare = () => addToCompare(product, addToast, t);
  const handleDeleteToCompare = () => deleteFromCompare(product, addToast, t);

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={product.name[currentLanguage] || product.name["en"]}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.webp"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending" aria-label={t("home")}>
              <FaHome size={16} />
            </Link>
          </li>
          <li>
            <Link href="/shop/left-sidebar" as={process.env.PUBLIC_URL + "/shop/left-sidebar"}>
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
              <ImageGalleryBottomThumb
                product={product}
                wishlistItem={wishlistItem}
                addToast={addToast}
                addToWishlist={handleAddToWishlist}
                deleteFromWishlist={handleDeleteToWishlist}
              />
            </Col>

            <Col lg={6}>
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
              <ProductDescriptionTab product={product} />
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cartData,
  wishlistItems: state.wishlistData,
  compareItems: state.compareData
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (item, addToast, quantityCount, selectedProductColor, selectedProductSize, t) =>
    dispatch(addToCart(item, addToast, quantityCount, selectedProductColor, selectedProductSize, t)),
  addToWishlist: (item, addToast, t) => dispatch(addToWishlist(item, addToast, t)),
  deleteFromWishlist: (item, addToast, t) => dispatch(deleteFromWishlist(item, addToast, t)),
  addToCompare: (item, addToast, t) => dispatch(addToCompare(item, addToast, t)),
  deleteFromCompare: (item, addToast, t) => dispatch(deleteFromCompare(item, addToast, t))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductBasic);

export async function getStaticPaths() {
  // Pre-build zero products at build time.
  // Every product page generates on first request, is then cached,
  // and silently revalidated in the background — build time is near-instant.
  return {
    paths: [],
    fallback: "blocking"
  };
}

export async function getStaticProps({ params }) {
  const product = products.find((single) => single.slug === params.slug);

  // Required when fallback is not false — handle unknown slugs gracefully
  if (!product) return { notFound: true };

  return {
    props: { product },
    revalidate: 60 * 60 // re-generate the page at most once per hour
  };
}