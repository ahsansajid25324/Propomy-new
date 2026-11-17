import MapView from "../../components/pages/MapView";
import { FiArrowUpRight } from "react-icons/fi";
import "../../styles/Search.css";
import PropertyCard from "../../components/common/PropertyCard";
const Search = () => {
  return (
    <>
      <div>
        <div className="set-map">
          <div className="d-flex flex-column left-Dashboard-card">
            <div className="main-header mb-3">
              <h2 className="portfolio-distribution-title">
                {" "}
                Property Search{" "}
              </h2>
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

            <div>
              <p className="m-0 p-0">Search Address</p>
              <input
                type="text"
                placeholder="Enter address, city, or ZIP code"
                className="search-input"
              />
            </div>
            <button className="search-btn-primary mt-2 "> Search</button>
          </div>

          <MapView />
        </div>
        <div className="search-header">
          <h1 className="search-title">Chicago, IL, USA</h1>
          <div className="search-filters">
            <select className="search-filter">
              <option>For Sale</option>
            </select>
            <select className="search-filter">
              <option>Any Price</option>
            </select>
            <select className="search-filter">
              <option>Home Type</option>
              <option>Home Type</option>
            </select>
            <select className="search-filter">
              <option>All Filters</option>
            </select>
          </div>
          <div className="search-sort">
            <span>Sort:</span>
            <select className="search-sort-select">
              <option>New Listings</option>
            </select>
          </div>
        </div>
        <div className="property-grid">
          <PropertyCard
            price={550000}
            beds={5}
            baths={3}
            size={973}
            lotSize={7261}
            address="231 Summers Road"
            tag="Listed"
            images={[
              "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
              "img2",
              "img3",
              "img4",
              "img5",
              "img6",
            ]}
            estEquity={420000}
            avgComps={600000}
            estRent={3200}
            score={83}
          />

          <PropertyCard
            price={750000}
            beds={9}
            baths={7}
            size={1015}
            lotSize={9000}
            address="12 Hills St."
            tag="Active"
            images={[
              "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
              "img2",
              "img3",
            ]}
            estEquity={500000}
            avgComps={800000}
            estRent={4100}
            score={78}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
