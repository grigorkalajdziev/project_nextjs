import Link from "next/link";
import { IoIosCalendar } from "react-icons/io";
import { Container, Row, Col } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import { SectionTitleThree } from "../../components/SectionTitle";
import { BlogPostSlider } from "../../components/Blog";
import blogData from "../../data/blog-posts/blog-post-one.json";

const BlogPosts = () => {
  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Blog Posts"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>

          <li>Blog Posts</li>
        </ul>
      </BreadcrumbOne>
      <div className="element-wrapper space-mt--r130 space-mb--r130">
        {/* blog post slider */}
        <BlogPostSlider blogData={blogData} />

        <div className="space-mb--r100"></div>

        <div className="blog-post-grid-area space-pt--r100 border-top--grey">
          <Container>
            <SectionTitleThree
              title="From our blog"
              subtitle="Lorem ipsum dolor sit amet, consecte tur cing elit. Suspe ndisse suscipit sagittis leo sit met condim entum."
            />
            <Row className="space-mb-mobile-only--m30">
              {blogData &&
                blogData.map((single, i) => {
                  return (
                    <Col
                      lg={3}
                      md={6}
                      className="space-mb-mobile-only--30"
                      key={i}
                    >
                      <div className="blog-grid-post">
                        <div className="blog-grid-post__image space-mb--30">
                          <Link
                            href={single.url}
                            as={process.env.PUBLIC_URL + single.url}
                          >
                            <a>
                              <img
                                src={process.env.PUBLIC_URL + single.image}
                                className="img-fluid"
                                alt=""
                              />
                            </a>
                          </Link>
                        </div>
                        <div className="blog-grid-post__content">
                          <div className="post-date">
                            <IoIosCalendar />
                            {single.date}
                          </div>
                          <h2 className="post-title">
                            <Link
                              href={single.url}
                              as={process.env.PUBLIC_URL + single.url}
                            >
                              <a>{single.title}</a>
                            </Link>
                          </h2>
                          <p className="post-excerpt">{single.text}</p>
                          <Link
                            href={single.url}
                            as={process.env.PUBLIC_URL + single.url}
                          >
                            <a className="blog-readmore-btn">read more</a>
                          </Link>
                        </div>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </Container>
        </div>
      </div>
    </LayoutTwo>
  );
};

export default BlogPosts;
