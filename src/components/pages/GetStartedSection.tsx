import { useEffect, useRef } from "react";
import "../../styles/Started.css";
import { useNavigate } from "react-router-dom";

const GetStartedSection = () => {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          video.preload = "auto"; // load full video only when visible
          video.play().catch(() => {
            // autoplay blocked — user can press play manually via controls
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // start when at least 50% of the video is visible
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container get-started py-4 py-md-5">
      <div className="row align-items-center">
        {/* Left Column: Text + CTA */}
        <div className="col-md-6 col-12 mb-4 mb-md-0">
          <h2 className="hero-title text-dark">
            Start Making Smarter Real Estate Decisions Today
          </h2>
          <p className="hero-subtitle mt-3 text-dark">
            Instantly evaluate properties, predict returns, and make confident
            investment decisions with AI
          </p>
          <button
            onClick={() => nav("/free-trial")}
            className="btn btn-primary get-started-btn mt-2"
          >
            Start Free Trial
          </button>
        </div>

        {/* Right Column: Video Container with Reserved Aspect Ratio */}
        <div className="col-md-6 col-12 d-flex justify-content-center align-items-center">
          <div
            className="w-100 overflow-hidden position-relative rounded"
            style={{
              aspectRatio: "16 / 9",
              backgroundColor: "#f0f0f0", // placeholder background to prevent layout shift
            }}
          >
            <video
              ref={videoRef}
              src="https://propomy-video-bucket.s3.eu-north-1.amazonaws.com/home.mp4"
              className="w-100 h-100 position-absolute top-0 start-0 start-img-right"
              controls
              muted
              playsInline
              preload="metadata"
            >
              <track kind="captions" src="" label="English" default />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedSection;