import { Container, Row, Col } from "react-bootstrap";
import {
  getIndividualCategories,
  getIndividualColors,
  getProductsIndividualSizes,
  getIndividualTags,
  setActiveSort
} from "../../lib/product";
import { useLocalization } from "../../context/LocalizationContext";

const ShopFilter = ({ products, getSortParams }) => {  
  const { t } = useLocalization();

  const categories = getIndividualCategories(products);    
  const colors = getIndividualColors(products);
  const sizes = getProductsIndividualSizes(products);
  const tags = getIndividualTags(products);

  return (
    <div className="shop-advance-filter">
      <Container className="space-pt--50 space-pb--50">
        <Row>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">{t("categories")}</h2>

              {categories.length > 0 ? (
                <ul className="single-filter-widget__list">
                  <li>
                    <button
                      onClick={(e) => {
                        getSortParams("category", "");
                        setActiveSort(e);
                      }}
                    >
                      {t("all_categories")}
                    </button>
                  </li>
                  {categories.map((category, i) => {
                    return (
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
                    );
                  })}
                </ul>
              ) : (
                t("no_categories_found")
              )}
            </div>
          </Col>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">{t("colors")}</h2>
              {colors.length > 0 ? (
                <ul className="single-filter-widget__list single-filter-widget__list--color">
                  {colors.map((color, i) => {
                    return (
                      <li key={i}>
                        <button
                          onClick={(e) => {
                            getSortParams("color", color.colorName);
                            setActiveSort(e);
                          }}
                          style={{ backgroundColor: color.colorCode }}
                        ></button>
                      </li>
                    );
                  })}
                  <li>
                    <button
                      onClick={(e) => {
                        getSortParams("color", "");
                        setActiveSort(e);
                      }}
                    >
                      x
                    </button>
                  </li>
                </ul>
              ) : (
                t("no_colors_found")
              )}
            </div>
          </Col>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">{t("sizes")}</h2>
              {sizes.length > 0 ? (
                <ul className="single-filter-widget__list single-filter-widget__list--size">
                  <li>
                    <button
                      onClick={(e) => {
                        getSortParams("size", "");
                        setActiveSort(e);
                      }}
                    >
                      {t("all_sizes")}
                    </button>
                  </li>
                  {sizes.map((size, i) => {
                    return (
                      <li key={i}>
                        <button
                          onClick={(e) => {
                            getSortParams("size", size);
                            setActiveSort(e);
                          }}
                        >
                          {size}                          
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                t("no_sizes_found")
              )}
            </div>
          </Col>
          <Col lg={3} md={6} className="space-mb-mobile-only--30">
            <div className="single-filter-widget">
              <h2 className="single-filter-widget__title">{t("tags")}</h2>
              {tags.length > 0 ? (
                <div className="tag-container">
                  {tags.map((tag, i) => {
                    return (
                      <button
                        key={i}
                        onClick={(e) => {
                          getSortParams("tag", tag);
                          setActiveSort(e);
                        }}
                      >
                        {t(tag) || tag}
                      </button>
                    );
                  })}
                </div>
              ) : (
                t("no_tags_found")
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShopFilter;
