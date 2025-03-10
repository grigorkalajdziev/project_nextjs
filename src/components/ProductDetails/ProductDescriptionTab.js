import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import RatingStars from "./RatingStars";
import { useLocalization } from "../../context/LocalizationContext";
import { database, ref, push, set, get, auth } from "../../pages/api/register";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { onAuthStateChanged } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import { useToasts } from "react-toast-notifications";

const ProductDescriptionTab = ({ product }) => {
  const { t, currentLanguage } = useLocalization();
  const { addToast } = useToasts();

  // Local state for the form inputs
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState({});

  const formatDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {        
        setReviews({});
        return;
      }
      
      const fetchReviews = async () => {
        try {
          const reviewsRef = ref(database, 'productReviews/' + product.id + '/reviews');
          const snapshot = await get(reviewsRef);
          if (snapshot.exists()) {
            setReviews(snapshot.val());
          } else {
            setReviews({});
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
  
      fetchReviews();
    });
  
    return () => unsubscribe(); // Clean up the listener
  }, [product.id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setReviewerEmail(user.email); // Set email if user is logged in
      } else {
        setReviewerEmail(""); // Clear email if user logs out
      }
    });
  
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      addToast(t("you_must_be_logged_in"), { appearance: "error", autoDismiss: true });
      return;
    }

    if (!reviewerName.trim()) {
      addToast(t("please_enter_your_name"), { appearance: "error", autoDismiss: true });
      return;
    }

    if (rating === 0) {
      addToast(t("please_give_a_rating"), { appearance: "error", autoDismiss: true });
      return;
    }
  
    if (!reviewMessage.trim()) {
      addToast(t("please_enter_a_message"), { appearance: "error", autoDismiss: true });
      return;
    }   

    // Ensure the rating is set to 5 if it's 0
    const finalRating = rating === 0 ? 5 : rating;

    const newReview = {
      reviewerName,
      reviewerEmail,
      message: reviewMessage,
      rating: finalRating,
      date: formatDate(),
    };

    try {
      const reviewsRef = ref(database, 'productReviews/' + product.id + '/reviews');
      const newReviewRef = push(reviewsRef);
      await set(newReviewRef, {
        reviewerName,
        reviewerEmail,
        message: reviewMessage,
        rating: finalRating,
        date: new Date().toLocaleDateString(),
      });
      
      setReviewerName("");      
      setReviewMessage("");
      setRating(0);

      addToast(t("review_submitted_successfully"), { appearance: "success", autoDismiss: true });
     
      await fetchReviews(); 

      const response = await fetch('/api/sendReviewEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: ["grigorkalajdziev@gmail.com", "makeupbykika@hotmail.com"],
          reviewerName: reviewerName,
          productName: product.name[currentLanguage],
          rating: finalRating,
          message: reviewMessage,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send review email');
      }
    } catch (error) {      
      addToast(t("review_submission_failed"), { appearance: "error", autoDismiss: true });
    }
  };

  // Function to fetch reviews from Firebase
  const fetchReviews = async () => {
    try {
      const reviewsRef = ref(database, 'productReviews/' + product.id + '/reviews');
      const snapshot = await get(reviewsRef);
      if (snapshot.exists()) {
        const reviewsData = snapshot.val();
        setReviews(reviewsData);
      } else {
        setReviews({});
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div className="product-description-tab space-pt--r100 space-mt--r100 border-top--grey">
      <Tab.Container defaultActiveKey="description">
        <Nav variant="pills" className="product-description-tab__navigation text-center justify-content-center space-mb--50">
          <Nav.Item>
            <Nav.Link eventKey="description">{t("description")}</Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link eventKey="additionalInfo">
              {t("additional_information")}
            </Nav.Link>
          </Nav.Item> */}
          <Nav.Item>
            <Nav.Link eventKey="reviews">
              {t("reviews")}{" "}
              {Object.keys(reviews).length ? `(${Object.keys(reviews).length})` : ""}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="description">
            <div className="product-description-tab__details">
              {product.fullDescription[currentLanguage]}
            </div>
          </Tab.Pane>
          {/* <Tab.Pane eventKey="additionalInfo">
            <div className="product-description-tab__additional-info">
              <table className="shop-attributes">
                <tbody>
                  <tr>
                    <th>{t("size")}</th>
                    <td>{product.size || "L, M, S, XS"}</td>
                  </tr>
                  <tr>
                    <th>{t("color")}</th>
                    <td>{product.color || "Black, Blue, Brown"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tab.Pane> */}
          <Tab.Pane eventKey="reviews">
            <div className="product-description-tab__review">
              <h2 className="review-title space-mb--20">
                {Object.keys(reviews).length ? Object.keys(reviews).length : ""}{" "}
                {t("reviews_on")}{" "}
                {product.name[currentLanguage] || product.name["en"]}
              </h2>

              {Object.keys(reviews).map((key) => {
                const review = reviews[key];
                return (
                  <div key={key} className="single-review">
                    <div className="single-review__image">
                        <FaUserCircle size={50} className="user-icon" color="#6c757d" />
                    </div>
                    <div className="single-review__content text-left">
                      <div className="single-review__rating">
                        {[...Array(review.rating)].map((_, i) => (
                          <IoIosStar key={i} />
                        ))}
                        {[...Array(5 - review.rating)].map((_, i) => (
                          <IoIosStarOutline key={i} />
                        ))}
                      </div>
                      <p className="username">{review.reviewerName}</p>
                      <p className="date">{review.date}</p>
                      <p className="message">{review.message}</p>
                    </div>
                  </div>
                );
              })}

              <h2 className="review-title space-mb--20">{t("add_review")}</h2>
              <p className="text-center">{t("email_privacy_notice")}</p>

              <div className="lezada-form lezada-form--review">
                <form onSubmit={handleSubmitReview}>
                  <div className="row">
                    <div className="col-lg-6 space-mb--20">
                      <input
                        type="text"
                        placeholder={`${t("name")} *`}
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 space-mb--20">
                      <input
                        type="email"
                        placeholder={`${t("email")} *`}
                        value={reviewerEmail}
                        onChange={(e) => setReviewerEmail(e.target.value)}
                        disabled={!!auth.currentUser}
                      />
                    </div>
                    <div className="col-lg-12 space-mb--20">
                      <span className="rating-title space-mr--20">
                        {t("your_rating")}
                      </span>
                      <span className="product-rating">
                        <RatingStars setRating={setRating} rating={rating} />
                      </span>
                    </div>
                    <div className="col-lg-12 space-mb--20">
                      <textarea
                        cols={30}
                        rows={10}
                        placeholder={`${t("your_review")} *`}
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-12 text-center">
                      <button
                        type="submit"
                        className="lezada-button lezada-button--medium"
                      >
                        {t("submit")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default ProductDescriptionTab;
