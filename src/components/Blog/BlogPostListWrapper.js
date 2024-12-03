import { Row, Col } from "react-bootstrap";
import Link from "next/link";
import { IoIosCalendar, IoIosAdd } from "react-icons/io";

const BlogPostListWrapper = () => {
  return (
    <Row className="blog-post-list-wrapper">
      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>Chic Fashion Phenomenon</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>

      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail-6.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>Shirt Color Picking Guide</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>

      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail-2-1.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>Perfect Perfume & Cologne</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>

      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>T-Shirts as Minimalist Style</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>

      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>Chic Fashion Phenomenon</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>

      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail-6.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>Shirt Color Picking Guide</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>

      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail-2-1.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>Perfect Perfume & Cologne</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>

      <Col lg={12} className="space-mb--60">
        <div className="blog-grid-post blog-grid-post--list">
          <div className="blog-grid-post__image">
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a>
                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </a>
            </Link>
          </div>
          <div className="blog-grid-post__content">
            <div className="post-date">
              <IoIosCalendar />
              <Link
                href="/blog/standard-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
              >
                <a> june 5, 2020</a>
              </Link>
            </div>
            <h2 className="post-title">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>T-Shirts as Minimalist Style</a>
              </Link>
            </h2>
            <p className="post-excerpt">
              Michele seemed to say, was the 21st-century Gucci girl, an
              eccentric, fresh-faced weirdo who wasn’t afraid to wear backless
              fur-lined loafers, to personify the idea of “ugly pretty.”
            </p>
            <Link
              href="/blog/post-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
            >
              <a className="blog-readmore-btn">
                <IoIosAdd /> read more
              </a>
            </Link>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default BlogPostListWrapper;
