import { IoIosClose } from "react-icons/io";
import Link from "next/link";
import Accordion from "react-bootstrap/Accordion";

const NavigationOverlay = ({ activeStatus, getActiveStatus }) => {
  return (
    <div className={`navigation-overlay ${activeStatus ? "active" : ""}`}>
      <div className="navigation-overlay__content">
        <button
          className="navigation-overlay__close-icon"
          onClick={() => {
            getActiveStatus(false);
            document.querySelector("body").classList.remove("overflow-hidden");
          }}
        >
          <IoIosClose />
        </button>
        <div className="navigation-overlay__content-container">
          <nav>
            <ul>
              <li className="has-children">
                <Accordion>
                  <Accordion.Toggle variant="link" eventKey="0" as="a">
                    Home
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <ul className="sub-menu">
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Home Group One
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              {/* <li>
                                <Link
                                  href="/home/decor"
                                  as={process.env.PUBLIC_URL + "/home/decor"}
                                >
                                  <a>Decor</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/creative"
                                  as={process.env.PUBLIC_URL + "/home/creative"}
                                >
                                  <a>Creative</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/perfumes"
                                  as={process.env.PUBLIC_URL + "/home/perfumes"}
                                >
                                  <a>Perfumes</a>
                                </Link>
                              </li> */}
                              <li>
                                <Link
                                  href="/home/trending"
                                  as={process.env.PUBLIC_URL + "/home/trending"}
                                >
                                  <a>Trending</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      {/* <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Home Group Two
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/home/essentials"
                                  as={
                                    process.env.PUBLIC_URL + "/home/essentials"
                                  }
                                >
                                  <a>Essentials</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/accessories"
                                  as={
                                    process.env.PUBLIC_URL + "/home/accessories"
                                  }
                                >
                                  <a>Accessories</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/lookbook"
                                  as={process.env.PUBLIC_URL + "/home/lookbook"}
                                >
                                  <a>Lookbook</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/furniture"
                                  as={
                                    process.env.PUBLIC_URL + "/home/furniture"
                                  }
                                >
                                  <a>Furniture</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li> */}
                      {/* <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Home Group Three
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/home/smart-design"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/home/smart-design"
                                  }
                                >
                                  <a>Smart Design</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/collection"
                                  as={
                                    process.env.PUBLIC_URL + "/home/collection"
                                  }
                                >
                                  <a>Collection</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/jewelry"
                                  as={process.env.PUBLIC_URL + "/home/jewelry"}
                                >
                                  <a>Jewelry</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/cosmetics"
                                  as={
                                    process.env.PUBLIC_URL + "/home/cosmetics"
                                  }
                                >
                                  <a>Cosmetics</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li> */}
                      {/* <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Home Group Four
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/home/swimsuit"
                                  as={process.env.PUBLIC_URL + "/home/swimsuit"}
                                >
                                  <a>Swimsuit</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/special"
                                  as={process.env.PUBLIC_URL + "/home/special"}
                                >
                                  <a>Special</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/home/concept"
                                  as={process.env.PUBLIC_URL + "/home/concept"}
                                >
                                  <a>Concept</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li> */}
                    </ul>
                  </Accordion.Collapse>
                </Accordion>
              </li>
              <li className="has-children">
                <Accordion>
                  <Accordion.Toggle variant="link" eventKey="0" as="a">
                    Shop
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <ul className="sub-menu">
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Group One
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/shop/left-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/left-sidebar"
                                  }
                                >
                                  <a>Left Sidebar</a>
                                </Link>
                              </li>
                              {/* <li>
                                <Link
                                  href="/shop/right-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/right-sidebar"
                                  }
                                >
                                  <a>Right Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop/no-sidebar"
                                  as={
                                    process.env.PUBLIC_URL + "/shop/no-sidebar"
                                  }
                                >
                                  <a>No Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop/fullwidth-no-space"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/fullwidth-no-space"
                                  }
                                >
                                  <a>Full Width No Space</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop/fullwidth-no-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/fullwidth-no-sidebar"
                                  }
                                >
                                  <a>Full Width No Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop/fullwidth-left-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/fullwidth-left-sidebar"
                                  }
                                >
                                  <a>Full Width Left Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop/fullwidth-right-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/fullwidth-right-sidebar"
                                  }
                                >
                                  <a>Full Width Right Sidebar</a>
                                </Link>
                              </li> */}
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Group Two
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/shop/product-basic/[slug]?slug=lorem-ipsum-decor-one"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/product-basic/lorem-ipsum-decor-one"
                                  }
                                >
                                  <a>Basic</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop/product-fullwidth/[slug]?slug=lorem-ipsum-decor-one"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/product-fullwidth/lorem-ipsum-decor-one"
                                  }
                                >
                                  <a>Full Width</a>
                                </Link>
                              </li>

                              <li>
                                <Link
                                  href="/shop/product-fullwidth-right-thumb/[slug]?slug=lorem-ipsum-decor-one"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/product-fullwidth-right-thumb/lorem-ipsum-decor-one"
                                  }
                                >
                                  <a>Full Width Right Thumb</a>
                                </Link>
                              </li>

                              <li>
                                <Link
                                  href="/shop/product-sticky/[slug]?slug=lorem-ipsum-decor-one"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/shop/product-sticky/lorem-ipsum-decor-one"
                                  }
                                >
                                  <a>Sticky Details</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/other/cart"
                                  as={process.env.PUBLIC_URL + "/other/cart"}
                                >
                                  <a>Shopping Cart</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/other/wishlist"
                                  as={
                                    process.env.PUBLIC_URL + "/other/wishlist"
                                  }
                                >
                                  <a>Wishlist</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/other/compare"
                                  as={process.env.PUBLIC_URL + "/other/compare"}
                                >
                                  <a>Compare</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Group Three
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/other/checkout"
                                  as={
                                    process.env.PUBLIC_URL + "/other/checkout"
                                  }
                                >
                                  <a>Checkout</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/other/order-tracking"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/other/order-tracking"
                                  }
                                >
                                  <a>Order Tracking</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/other/my-account"
                                  as={
                                    process.env.PUBLIC_URL + "/other/my-account"
                                  }
                                >
                                  <a>My Account</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/other/login-register"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/other/login-register"
                                  }
                                >
                                  <a>Login Register</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                    </ul>
                  </Accordion.Collapse>
                </Accordion>
              </li>
              <li className="has-children">
                <Accordion>
                  <Accordion.Toggle variant="link" eventKey="0" as="a">
                    Elements
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <ul className="sub-menu">
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Group One
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/element/product-categories"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/product-categories"
                                  }
                                >
                                  <a>Product Categories</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/product-sliders"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/product-sliders"
                                  }
                                >
                                  <a>Product Sliders</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/product-tabs"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/product-tabs"
                                  }
                                >
                                  <a>Product Tabs</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/product-widgets"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/product-widgets"
                                  }
                                >
                                  <a>Product Widget</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/recent-products"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/recent-products"
                                  }
                                >
                                  <a>Recent Products</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Group Two
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/element/sale-products"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/sale-products"
                                  }
                                >
                                  <a>Sale Products</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/featured-products"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/featured-products"
                                  }
                                >
                                  <a>Featured products</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/top-rated-products"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/top-rated-products"
                                  }
                                >
                                  <a>Top Rated products</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/best-selling-products"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/best-selling-products"
                                  }
                                >
                                  <a>Best Selling</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/product-attributes"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/product-attributes"
                                  }
                                >
                                  <a>Product Attributes</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Group Three
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/element/blog-posts"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/blog-posts"
                                  }
                                >
                                  <a>Blog Posts</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/mailchimp-forms"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/mailchimp-forms"
                                  }
                                >
                                  <a>Mailchimp Form</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/icon-boxes"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/icon-boxes"
                                  }
                                >
                                  <a>Icon Box</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/team-members"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/team-members"
                                  }
                                >
                                  <a>Team Member</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/faqs"
                                  as={process.env.PUBLIC_URL + "/element/faqs"}
                                >
                                  <a>FAQs / Toggles</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Group Four
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/element/countdown-timers"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/countdown-timers"
                                  }
                                >
                                  <a>Countdown Timer</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/buttons"
                                  as={
                                    process.env.PUBLIC_URL + "/element/buttons"
                                  }
                                >
                                  <a>Buttons</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/testimonials"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/testimonials"
                                  }
                                >
                                  <a>Testimonials</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/element/google-maps"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/element/google-maps"
                                  }
                                >
                                  <a>Google Maps</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                    </ul>
                  </Accordion.Collapse>
                </Accordion>
              </li>
              <li className="has-children">
                <Accordion>
                  <Accordion.Toggle variant="link" eventKey="0" as="a">
                    Pages
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <ul className="sub-menu">
                      <li>
                        <Link
                          href="/other/about"
                          as={process.env.PUBLIC_URL + "/other/about"}
                        >
                          <a>About Us</a>
                        </Link>
                      </li>
                      <li>
                        {/* <Link
                          href="/other/about-two"
                          as={process.env.PUBLIC_URL + "/other/about-two"}
                        >
                          <a>About Us Two</a>
                        </Link> */}
                      </li>
                      <li>
                        <Link
                          href="/other/contact"
                          as={process.env.PUBLIC_URL + "/other/contact"}
                        >
                          <a>Contact Us</a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/other/faq"
                          as={process.env.PUBLIC_URL + "/other/faq"}
                        >
                          <a>F.A.Q</a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/other/coming-soon"
                          as={process.env.PUBLIC_URL + "/other/coming-soon"}
                        >
                          <a>Coming Soon</a>
                        </Link>
                      </li>
                      <li>
                        {/* <Link
                          href="/other/not-found"
                          as={process.env.PUBLIC_URL + "/other/not-found"}
                        >
                          <a>Not Found</a>
                        </Link> */}
                      </li>
                    </ul>
                  </Accordion.Collapse>
                </Accordion>
              </li>
              <li className="has-children">
                <Accordion>
                  <Accordion.Toggle variant="link" eventKey="0" as="a">
                    Blog
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <ul className="sub-menu">
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Standard Layout
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/blog/standard-left-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/standard-left-sidebar"
                                  }
                                >
                                  <a>Left Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/standard-right-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/standard-right-sidebar"
                                  }
                                >
                                  <a>Right Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/standard-fullwidth"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/standard-fullwidth"
                                  }
                                >
                                  <a>Full Width</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Grid Layout
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/blog/grid-left-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/grid-left-sidebar"
                                  }
                                >
                                  <a>Left Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/grid-right-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/grid-right-sidebar"
                                  }
                                >
                                  <a>Right Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/grid-fullwidth"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/grid-fullwidth"
                                  }
                                >
                                  <a>Full Width</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            List Layout
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/blog/list-left-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/list-left-sidebar"
                                  }
                                >
                                  <a>Left Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/list-right-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/list-right-sidebar"
                                  }
                                >
                                  <a>Right Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/list-fullwidth"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/list-fullwidth"
                                  }
                                >
                                  <a>Full Width</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                      <li className="has-children-submenu">
                        <Accordion>
                          <Accordion.Toggle variant="link" eventKey="0" as="a">
                            Single Post Layout
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <ul className="sub-menu">
                              <li>
                                <Link
                                  href="/blog/post-left-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/post-left-sidebar"
                                  }
                                >
                                  <a>Left Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/post-right-sidebar"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/post-right-sidebar"
                                  }
                                >
                                  <a>Right Sidebar</a>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/blog/post-fullwidth"
                                  as={
                                    process.env.PUBLIC_URL +
                                    "/blog/post-fullwidth"
                                  }
                                >
                                  <a>Full Width</a>
                                </Link>
                              </li>
                            </ul>
                          </Accordion.Collapse>
                        </Accordion>
                      </li>
                    </ul>
                  </Accordion.Collapse>
                </Accordion>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavigationOverlay;
