import { useState } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

const RatingStars = () => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="product-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            color: star <= rating ? "#FFD700" : "#C0C0C0", 
          }}
        >
          {star <= rating ? <IoIosStar /> : <IoIosStarOutline />}
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
