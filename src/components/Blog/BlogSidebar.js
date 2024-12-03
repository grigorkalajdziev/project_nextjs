import { IoIosSearch } from "react-icons/io";
import Link from "next/link";

const BlogSidebar = () => {
  return (
    <div className="blog-sidebar">
      <div className="single-sidebar-widget space-mb--40">
        <div className="search-widget">
          <form>
            <input type="search" placeholder="Search products ..." />
            <button type="button">
              <IoIosSearch />
            </button>
          </form>
        </div>
      </div>
      <div className="single-sidebar-widget space-mb--40">
        <h2 className="single-sidebar-widget__title space-mb--30">
          Categories
        </h2>
        <ul className="single-sidebar-widget__list single-sidebar-widget__list--category">
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              <a>Fashion</a>
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              <a>Furniture</a>
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              <a>Accessories</a>
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              <a>Wearables</a>
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              <a>Decor</a>
            </Link>
          </li>
        </ul>
      </div>

      <div className="single-sidebar-widget space-mb--40">
        <div className="widget-post-wrapper">
          <div className="single-widget-post">
            <div className="image">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/blog/post-thumbnail-100x120.png"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </a>
              </Link>
            </div>
            <div className="content">
              <h3 className="widget-post-title">
                <Link
                  href="/blog/post-left-sidebar"
                  as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
                >
                  <a>Chic Fashion Phenomenon</a>
                </Link>
              </h3>
              <p className="widget-post-date">June 5, 2020</p>
            </div>
          </div>

          <div className="single-widget-post">
            <div className="image">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/blog/post-thumbnail-6-100x120.png"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </a>
              </Link>
            </div>
            <div className="content">
              <h3 className="widget-post-title">
                <Link
                  href="/blog/post-left-sidebar"
                  as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
                >
                  <a>Go Your Own Way</a>
                </Link>
              </h3>
              <p className="widget-post-date">June 5, 2020</p>
            </div>
          </div>

          <div className="single-widget-post">
            <div className="image">
              <Link
                href="/blog/post-left-sidebar"
                as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
              >
                <a>
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/blog/post-thumbnail-9-100x120.png"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </a>
              </Link>
            </div>
            <div className="content">
              <h3 className="widget-post-title">
                <Link
                  href="/blog/post-left-sidebar"
                  as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
                >
                  <a>Home-made Body Lotion</a>
                </Link>
              </h3>
              <p className="widget-post-date">June 5, 2020</p>
            </div>
          </div>
        </div>
      </div>

      <div className="single-sidebar-widget space-mb--40">
        <div className="blog-sidebar-banner">
          <Link
            href="/shop/left-sidebar"
            as={process.env.PUBLIC_URL + "/shop/left-sidebar"}
          >
            <a>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/assets/images/banners/blog-sidebar.png"
                }
                className="img-fluid"
                alt=""
              />
            </a>
          </Link>
        </div>
      </div>

      <div className="single-sidebar-widget">
        <h2 className="single-sidebar-widget__title space-mb--30">
          {" "}
          Popular Tags
        </h2>
        <div className="tag-container">
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>bags</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>chair</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>clock</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>cosmetic</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>fashion</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>furniture</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>holder</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>mask</a>
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            <a>men</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
