import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import {
  getIndividualCategories,
  getIndividualColors,
  getIndividualTags,
  setActiveSort,
  getDiscountPrice,
  getIndividualName
} from "../../lib/product";
import { ProductRating } from "../Product";
import { useLocalization } from "../../context/LocalizationContext";
// Import Firebase functions (adjust the path as needed)
import { database, ref, get } from "../../pages/api/register";

const ShopSidebar = ({ products, getSortParams, searchTerm, setSearchTerm }) => {
  const { t, currentLanguage } = useLocalization();

  // Get static filters from the passed products
  const categories = getIndividualCategories(products);
  const colors = getIndividualColors(products);
  const tags = getIndividualTags(products);

  // State for popular products based on Firebase review counts and average rating
  const [popularProducts, setPopularProducts] = useState([]);

  // Helper function to calculate average rating from a reviews object
  const calculateAverageRating = (reviews) => {
    const keys = Object.keys(reviews);
    if (keys.length === 0) return 0;
    const total = keys.reduce((acc, key) => acc + reviews[key].rating, 0);
    return total / keys.length;
  };

  // Whenever products change, fetch review data for each product from Firebase
  useEffect(() => {
    const fetchPopularProducts = async () => {
      if (products && products.length > 0) {
        // Create an array of promises for each product
        const productPromises = products.map(async (product) => {
          try {
            // Reference to the product's reviews in Firebase Realtime Database
            const reviewsRef = ref(
              database,
              "productReviews/" + product.id + "/reviews"
            );
            const snapshot = await get(reviewsRef);
            let reviewCount = 0;
            let avgRating = 0;
            if (snapshot.exists()) {
              const reviewsData = snapshot.val();
              reviewCount = Object.keys(reviewsData).length;
              avgRating = calculateAverageRating(reviewsData);
            }
            // Return the product with added reviewCount and avgRating properties
            return { ...product, reviewCount, avgRating };
          } catch (error) {
            console.error("Error fetching reviews for product", product.id, error);
            return { ...product, reviewCount: 0, avgRating: 0 };
          }
        });

        // Wait for all products to be processed
        const productsWithRatings = await Promise.all(productPromises);
        // Sort products by reviewCount (most reviews first)
        productsWithRatings.sort((a, b) => {
          if (b.avgRating !== a.avgRating) {
            return b.avgRating - a.avgRating; // Higher rating first
          }
          return b.reviewCount - a.reviewCount; // More reviews as a tiebreaker
        });
        // Pick the top 3 products
        const top3 = productsWithRatings.slice(0, 3);
        setPopularProducts(top3);
      }
    };

    fetchPopularProducts();
  }, [products]);

  // Clear search term when the language changes
  useEffect(() => {
    setSearchTerm("");
  }, [currentLanguage]);

  return (
    <div className="shop-sidebar">
      {/* Search Widget */}
      <div className="single-sidebar-widget space-mb--40">
        <div className="search-widget">
          <form>
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update the parent state
            />
            <button type="button">
              <IoIosSearch />
            </button>
          </form>
        </div>
      </div>
      {/* Category List */}
      <div className="single-sidebar-widget space-mb--40">
        <h2 className="single-sidebar-widget__title space-mb--30">
          {t("categories")}
        </h2>
        {categories.length > 0 ? (
          <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
            <li>
              <button
                onClick={(e) => {
                  getSortParams("category", "");
                  setActiveSort(e);
                }}
                className="active"
              >
                {t("allCategories")}
              </button>
            </li>
            {categories.map((category, i) => (
              <li key={i}>
                <button
                  onClick={(e) => {
                    getSortParams("category", category);
                    setActiveSort(e);
                  }}
                >
                  {t(category) || category}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          t("noCategories")
        )}
      </div>
      {/* Popular Products */}
      <div className="single-sidebar-widget space-mb--40">
        <h2 className="single-sidebar-widget__title space-mb--30">
          {t("popularProducts")}
        </h2>
        {popularProducts.length > 0 ? (
          <div className="widget-product-wrapper">
            {popularProducts.map((product, i) => {
              // Get product price and discount information
              const productPrice = product.price[currentLanguage] || "00.00";
              const discountedPrice = getDiscountPrice(
                productPrice,
                product.discount
              ).toFixed(2);
              
              return (
                <div className="single-widget-product-wrapper" key={i}>
                  <div className="single-widget-product">
                    <div className="single-widget-product__image">
                      <Link
                        href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                        as={
                          process.env.PUBLIC_URL +
                          "/shop/product-basic/" +
                          product.slug
                        }
                        className="image-wrap"
                      >
                        <img
                          src={process.env.PUBLIC_URL + product.thumbImage[0]}
                          className="img-fluid"
                          alt={
                            product.name[currentLanguage] ||
                            product.name["en"]
                          }
                        />
                      </Link>
                    </div>
                    <div className="single-widget-product__content">
                      <div className="single-widget-product__content__top">
                        <h3 className="product-title space-mb--10">
                          <Link
                            href={`/shop/product-basic/[slug]?slug=${product.slug}`}
                            as={
                              process.env.PUBLIC_URL +
                              "/shop/product-basic/" +
                              product.slug
                            }
                          >
                            {product.name[currentLanguage] ||
                              product.name["en"]}
                          </Link>
                        </h3>
                        <div className="price space-mb--10">
                          {product.discount > 0 ? (
                            <Fragment>
                              <span className="main-price discounted">
                                {currentLanguage === "mk"
                                  ? `${productPrice} ${t("currency")}`
                                  : `${t("currency")} ${productPrice}`}
                              </span>
                              <span className="discounted-price">
                                {currentLanguage === "mk"
                                  ? `${discountedPrice} ${t("currency")}`
                                  : `${t("currency")} ${discountedPrice}`}
                              </span>
                            </Fragment>
                          ) : (
                            <span className="main-price">
                              {currentLanguage === "mk"
                                ? `${productPrice} ${t("currency")}`
                                : `${t("currency")} ${productPrice}`}
                            </span>
                          )}
                        </div>
                        <div className="rating">
                          <ProductRating ratingValue={product.avgRating} />
                        </div>
                      </div>
                      {/* Display review count in a smaller font */}
                      <div className="review-count" style={{ fontSize: "0.8em" }}>
                        ({product.reviewCount || 0} {t("customer_reviews")})
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          t("noPopularProducts")
        )}
      </div>
      {/* Tag List */}
      <div className="single-sidebar-widget">
        <h2 className="single-sidebar-widget__title space-mb--30">
          {t("tags")}
        </h2>
        {tags.length > 0 ? (
          <div className="tag-container">
            {tags.map((tag, i) => (
              <button
                key={i}
                onClick={(e) => {
                  getSortParams("tag", tag);
                  setActiveSort(e);
                }}
              >
                {t(tag) || tag}
              </button>
            ))}
          </div>
        ) : (
          t("noTags")
        )}
      </div>
    </div>
  );
};

export default ShopSidebar;
