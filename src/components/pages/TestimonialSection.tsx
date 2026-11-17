import { Container } from "react-bootstrap";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import "../../styles/Testimonial.css";
import Profile from "../../assets/Profile.png";
import { FaStar } from "react-icons/fa";

function TestimonialsSection() {
  const reviewText =
    "Estatein made our home buying journey smooth and stress-free. Their team was always available, answered all our questions, and ensured we found the perfect place. We highly recommend their services to anyone looking for a new home.";
  const reviews = [
    {
      id: 1,
      title: "Exceptional Service!",
      text: reviewText,
      name: "Wade Warren",
      position: "USA, California",
      image: "/images/user1.png",
    },
    {
      id: 2,
      title: "Efficient and Reliable",
      text: reviewText,
      name: "Emelie Thomson",
      position: "USA, Florida",
      image: "/images/user2.png",
    },
    {
      id: 3,
      title: "Trusted Advisors",
      text: reviewText,
      name: "John Mans",
      position: "USA, Nevada",
      image: "/images/user3.png",
    },
    {
      id: 4,
      title: "Outstanding Experience",
      text: reviewText,
      name: "Sophia Lee",
      position: "USA, Texas",
      image: "/images/user4.png",
    },
    {
      id: 5,
      title: "Smooth Transaction",
      text: reviewText,
      name: "Carlos Rivera",
      position: "USA, New York",
      image: "/images/user5.png",
    },
    {
      id: 6,
      title: "Highly Recommended",
      text: reviewText,
      name: "Ava Patel",
      position: "USA, Illinois",
      image: "/images/user6.png",
    },
  ];

  return (
    <div className="testimonials-section">
      <Container>
        <div>
          <h1 className="hero-title text-dark">What Our Clients Say</h1>
          <p
            className="hero-subtitle text-muted m-0 "
            style={{ maxWidth: "600px" }}
          >
            Read the success stories and heartfelt testimonials from our valued
            clients. Discover why they chose Propomy for their real estate
            needs.
          </p>
        </div>
        <Splide
          options={{
            perPage: 3,
            autoplay: true,
            speed: 1000,
            rewind: true,
            gap: "20px",
            rewindByDrag: true,
            pagination: false,
            arrows: true,
            breakpoints: {
              768: {
                perPage: 1,
                arrows: false,
              },
              992: {
                perPage: 2,
              },
              1280: {
                perPage: 3,
              },
            },
          }}
          className="spacing-top"
        >
          {reviews.map((review) => (
            <SplideSlide key={review.id}>
              <div className="testimonial-card mx-auto">
                <div
                  className="stars-row mb-2"
                  style={{ display: "flex", gap: "8px", marginBottom: "10px" }}
                >
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star-circle">
                      <FaStar color="#FFD600" size={16} />
                    </span>
                  ))}
                </div>
                <h4 className="review-title">{review.title}</h4>
                <p className="review-text">{review.text}</p>
                <div className="profile-section">
                  <img src={Profile} alt="" className="profile-img" />
                  <div>
                    <h6 className="profile-name">{review.name}</h6>
                    <p className="profile-location">{review.position}</p>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </Container>
    </div>
  );
}

export default TestimonialsSection;
