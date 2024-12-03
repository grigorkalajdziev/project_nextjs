import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

const ProductDescriptionTab = ({ product }) => {
  return (
    <div className="product-description-tab space-pt--r100 space-mt--r100 border-top--grey">
      <Tab.Container defaultActiveKey="description">
        <Nav
          variant="pills"
          className="product-description-tab__navigation text-center justify-content-center space-mb--50"
        >
          <Nav.Item>
            <Nav.Link eventKey="description">Description</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="additionalInfo">
              Additional Information
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reviews">
              Reviews {product.ratingCount ? `(${product.ratingCount})` : ""}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="description">
            <div className="product-description-tab__details">
              {product.fullDescription}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="additionalInfo">
            <div className="product-description-tab__additional-info">
              <table className="shop-attributes">
                <tbody>
                  <tr>
                    <th>Size</th>
                    <td>
                      <p>L, M, S, XS</p>
                    </td>
                  </tr>
                  <tr>
                    <th>Color</th>
                    <td>
                      <p>Black, Blue, Brown</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="reviews">
            <div className="product-description-tab__review">
              <h2 className="review-title space-mb--20">
                {product.ratingCount ? product.ratingCount : ""} reviews on{" "}
                {product.name}
              </h2>
              {/*=======  single review  =======*/}
              <div className="single-review">
                <div className="single-review__image">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/assets/images/user/user1.jpeg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="single-review__content">
                  {/*=======  rating  =======*/}
                  <div className="single-review__rating">
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStarOutline />
                  </div>

                  {/*=======  username and date  =======*/}
                  <p className="username">
                    Scott James <span className="date">/ April 5, 2020</span>
                  </p>

                  {/*=======  message  =======*/}
                  <p className="message">
                    Thanks for always keeping your HTML themes up to date. Your
                    level of support and dedication is second to none.
                  </p>
                  {/*=======  End of message  =======*/}
                </div>
              </div>
              {/*=======  End of single review  =======*/}
              {/*=======  single review  =======*/}
              <div className="single-review">
                <div className="single-review__image">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/assets/images/user/user2.jpeg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="single-review__content">
                  {/*=======  rating  =======*/}
                  <div className="single-review__rating">
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStarOutline />
                  </div>
                  {/*=======  End of rating  =======*/}
                  {/*=======  username and date  =======*/}
                  <p className="username">
                    Owen Christ <span className="date">/ April 7, 2020</span>
                  </p>
                  {/*=======  End of username and date  =======*/}
                  {/*=======  message  =======*/}
                  <p className="message">
                    I didn’t expect this poster to arrive folded. Now there are
                    lines on the poster and one sad Ninja.
                  </p>
                  {/*=======  End of message  =======*/}
                </div>
              </div>
              {/*=======  End of single review  =======*/}
              {/*=======  single review  =======*/}
              <div className="single-review">
                <div className="single-review__image">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/assets/images/user/user3.jpeg"
                    }
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="single-review__content">
                  {/*=======  rating  =======*/}
                  <div className="single-review__rating">
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStar />
                    <IoIosStarOutline />
                  </div>
                  {/*=======  End of rating  =======*/}
                  {/*=======  username and date  =======*/}
                  <p className="username">
                    Edna Watson <span className="date">/ April 5, 2020</span>
                  </p>
                  {/*=======  End of username and date  =======*/}
                  {/*=======  message  =======*/}
                  <p className="message">
                    Can’t wait to start mixin’ with this one!
                    Irba-irr-Up-up-up-up-date your theme!
                  </p>
                  {/*=======  End of message  =======*/}
                </div>
              </div>
              {/*=======  End of single review  =======*/}
              <h2 className="review-title space-mb--20">Add a review</h2>
              <p className="text-center">
                Your email address will not be published. Required fields are
                marked *
              </p>
              {/*=======  review form  =======*/}
              <div className="lezada-form lezada-form--review">
                <form>
                  <div className="row">
                    <div className="col-lg-6 space-mb--20">
                      <input type="text" placeholder="Name *" required />
                    </div>
                    <div className="col-lg-6 space-mb--20">
                      <input type="email" placeholder="Email *" required />
                    </div>
                    <div className="col-lg-12 space-mb--20">
                      <span className="rating-title space-mr--20">
                        YOUR RATING
                      </span>
                      <span className="product-rating">
                        <IoIosStarOutline />
                        <IoIosStarOutline />
                        <IoIosStarOutline />
                        <IoIosStarOutline />
                        <IoIosStarOutline />
                      </span>
                    </div>
                    <div className="col-lg-12 space-mb--20">
                      <textarea
                        cols={30}
                        rows={10}
                        placeholder="Your review *"
                        defaultValue={""}
                      />
                    </div>
                    <div className="col-lg-12 text-center">
                      <button
                        type="submit"
                        className="lezada-button lezada-button--medium"
                      >
                        submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/*=======  End of review form  =======*/}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default ProductDescriptionTab;
