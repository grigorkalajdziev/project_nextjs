import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { BlogSidebar, BlogPostListWrapper } from "../../components/Blog";

const ListRightSidebar = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Blog List Right Sidebar"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Blog List Right Sidebar</li>
        </ul>
      </BreadcrumbOne>
      <div className="blog-page-wrapper space-mb--r130 space-mt--r130">
        <Container>
          <Row>
            <Col lg={3} className="order-2 space-mt-mobile-only--50">
              {/* sidebar */}
              <BlogSidebar />
            </Col>

            <Col lg={9} className="order-1">
              {/* post list */}
              <BlogPostListWrapper />

              <div className="pro-pagination-style text-center">
                <ul>
                  <li className="active page-item">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      4
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      NEXT
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default ListRightSidebar;
