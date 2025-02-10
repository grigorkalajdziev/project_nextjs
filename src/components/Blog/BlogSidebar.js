import { IoIosSearch } from "react-icons/io";
import Link from "next/link";

const BlogSidebar = () => {
  return (
    (<div className="blog-sidebar">
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
              Fashion
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              Furniture
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              Accessories
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              Wearables
            </Link>
          </li>
          <li>
            <Link
              href="/blog/standard-left-sidebar"
              as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
            >
              Decor
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

                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail-100x120.png"
                  }
                  className="img-fluid"
                  alt=""
                />

              </Link>
            </div>
            <div className="content">
              <h3 className="widget-post-title">
                <Link
                  href="/blog/post-left-sidebar"
                  as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
                >
                  Chic Fashion Phenomenon
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

                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail-6-100x120.png"
                  }
                  className="img-fluid"
                  alt=""
                />

              </Link>
            </div>
            <div className="content">
              <h3 className="widget-post-title">
                <Link
                  href="/blog/post-left-sidebar"
                  as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
                >
                  Go Your Own Way
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

                <img
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/images/blog/post-thumbnail-9-100x120.png"
                  }
                  className="img-fluid"
                  alt=""
                />

              </Link>
            </div>
            <div className="content">
              <h3 className="widget-post-title">
                <Link
                  href="/blog/post-left-sidebar"
                  as={process.env.PUBLIC_URL + "/blog/post-left-sidebar"}
                >
                  Home-made Body Lotion
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

            <img
              src={
                process.env.PUBLIC_URL +
                "/assets/images/banners/blog-sidebar.png"
              }
              className="img-fluid"
              alt=""
            />

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
            bags
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            chair
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            clock
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            cosmetic
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            fashion
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            furniture
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            holder
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            mask
          </Link>
          <Link
            href="/blog/standard-left-sidebar"
            as={process.env.PUBLIC_URL + "/blog/standard-left-sidebar"}
          >
            men
          </Link>
        </div>
      </div>
    </div>)
  );
};

export default BlogSidebar;
