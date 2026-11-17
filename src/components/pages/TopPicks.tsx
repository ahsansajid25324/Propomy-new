import Star from "../../assets/Star.svg";
import "../../styles/Investor.css";
import Properties from "../../assets/SavedProperty.png";
import { FiArrowUpRight } from "react-icons/fi";

const topPicksData = [
  {
    id: 1,
    name: "ABC",
    rating: 18,
  },
  {
    id: 2,
    name: "XYZ",
    rating: 23,
  },
  {
    id: 3,
    name: "EFG",
    rating: 15,
  },
];

const TopPicks = () => {
  return (
    <div className="left-Dashboard-card">
      <div className="main-header">
        <h2>Top Picks</h2>
        <button className="view-all-btn">
          <div className="view-all-icon-wrapper">
            <FiArrowUpRight
              className="arrow-icon"
              color="white"
              aria-label="Arrow Up"
            />
          </div>
        </button>
      </div>
      <div className="top-picks-list">
        {topPicksData.map((pick) => (
          <div key={pick.id} className="top-pick-item">
            <div className="top-pick-image-container">
              <img
                src={Properties}
                alt={pick.name}
                className="top-pick-image"
              />
            </div>
            <span className="top-pick-name">{pick.name}</span>
            <div className="top-pick-rating">
              <span className="top-pick-rating-number">{pick.rating}</span>
              <img src={Star} alt="stars" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicks;
