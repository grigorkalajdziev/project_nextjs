import { Fragment } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

const ProductRating = ({ ratingValue }) => {
  let rating = [];

  for (let i = 0; i < 5; i++) {
    rating.push(<IoIosStarOutline key={i} />);
  }
  if (ratingValue && ratingValue > 0) {
    for (let i = 0; i <= ratingValue - 1; i++) {
      rating[i] = <IoIosStar className="yellow" key={i} />;
    }
  }
  return <Fragment>{rating}</Fragment>;
};

export default ProductRating;
