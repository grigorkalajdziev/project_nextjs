import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import Paginator from "react-hooks-paginator";
import { SlideDown } from "react-slidedown";
import { LayoutFive } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { getSortedProducts } from "../../lib/product";
import { useLocalization } from "../../context/LocalizationContext";
import { ShopInfo } from "../../components/Shop";
import {
  ShopHeader,
  ShopFilter,
  ShopSidebar,
  ShopProducts,
} from "../../components/Shop";

const LeftSidebar = ({ products }) => {
  const { t, currentLanguage } = useLocalization();
  const router = useRouter();
  const { search, category } = router.query;

  const [layout, setLayout] = useState("grid five-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [shopTopFilterStatus, setShopTopFilterStatus] = useState(false);

  const pageLimit = 20;

  const getLayout = (layout) => setLayout(layout);

  const getSortParams = (type, value) => {
    setSortType(type);
    setSortValue(value);
    setOffset(0);
    setCurrentPage(1);
  };

  const getFilterSortParams = (type, value) => {
    setFilterSortType(type);
    setFilterSortValue(value);
    setOffset(0);
    setCurrentPage(1);
  };

  useEffect(() => {
    setSearchTerm(router.query.search || "");
  }, [router.query.search]);

  useEffect(() => {
    let sorted = getSortedProducts(
      products,
      sortType,
      sortValue,
      currentLanguage
    );
    sorted = getSortedProducts(
      sorted,
      filterSortType,
      filterSortValue,
      currentLanguage
    );

    if (searchTerm) {
      sorted = sorted.filter((p) =>
        p.name[currentLanguage]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      sorted = sorted.filter(
        (p) => String(p.category || "").toLowerCase() === category.toLowerCase()
      );

      setSortType("");
      setSortValue("");
      setFilterSortType("");
      setFilterSortValue("");
    }

    setSortedProducts(sorted);
    setOffset(0);
    setCurrentPage(1);
  }, [
    products,
    sortType,
    sortValue,
    filterSortType,
    filterSortValue,
    searchTerm,
    category,
    currentLanguage,
  ]);

  useEffect(() => {
    setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
  }, [sortedProducts, offset]);

  return (
    <LayoutFive>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle={t("shop")}
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.webp"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/home/trending">{t("home")}</Link>
          </li>
          <li>{t("shop")}</li>
        </ul>
      </BreadcrumbOne>

      <div className="shop-page-content">
        {/* shop page header */}
        <ShopHeader
          getLayout={getLayout}
          getFilterSortParams={getFilterSortParams}
          productCount={products.length}
          sortedProductCount={currentData.length}
          shopTopFilterStatus={shopTopFilterStatus}
          setShopTopFilterStatus={setShopTopFilterStatus}
        />

        {/* shop header filter */}
        <SlideDown closed={!shopTopFilterStatus}>
          <ShopFilter products={products} getSortParams={getSortParams} />
        </SlideDown>

        {/* shop page body */}
        <div className="shop-page-content__body space-mt--r130 space-mb--r100">
          <Container className="wide">
            <Row>
              <Col
                lg={3}
                className="order-2 order-lg-1 space-mt-mobile-only--50"
              >
                <ShopSidebar
                  products={products}
                  getSortParams={getSortParams}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </Col>

              <Col lg={9} className="order-1 order-lg-2">
                <ShopProducts layout={layout} products={currentData} />

                <div className="pro-pagination-style">
                  <Paginator
                    totalRecords={sortedProducts.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <ShopInfo />
    </LayoutFive>
  );
};

const mapStateToProps = (state) => ({
  products: state.productData,
});

export default connect(mapStateToProps)(LeftSidebar);
