import { Container, Button } from "react-bootstrap";
import Navbar from "../components/common/Navbar";
import "../styles/login.css";
import "../styles/Demo.css";

const Demo = () => {
  return (
    <>
      <Navbar />
      <Container
        fluid
        className="container-bg d-flex flex-column align-items-center justify-content-center bg-white min-vh-100 py-5 px-3"
      >
        <div className="video-container text-center w-100">
          <h2 className="fw-bold mb-2">Watch The Propomy Demo Video</h2>
          <p className="text-muted mb-4">
            See How Propomy Empowers Investors With AI-Driven Property
            Insights And Market Analysis.
          </p>

          <div className="video-player-box position-relative mb-4 rounded-4 overflow-hidden shadow-lg border bg-black">
            <video className="w-100 h-100" controls autoPlay>
              <source
                src="https://propomy-video-bucket.s3.eu-north-1.amazonaws.com/Demo-Propomy1.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          <Button
            variant="light"
            className="w-100 py-3 border text-secondary fw-medium rounded-pill shadow-sm"
          >
            Ready To Explore The Full Propomy Platform?
          </Button>
        </div>
      </Container>
    </>
  );
};

export default Demo;