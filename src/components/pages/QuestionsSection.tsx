import "../../styles/Question.css";

import BgRight from "../../assets/Question.png";
import { FaCheck } from "react-icons/fa";

const faqQuestions = [
  "How can I contact an Propomy agent?",
  "What documents do I need to sell my property through Propomy?",
  "How do I search for properties on Propomy?",
];

const QuestionsSection = () => {
  return (
    <div className="faq-section">
      <div className="container">
        <div className="row no-horizontal-padding">
          <div className="col-md-6 d-flex justify-content-center align-items-center position-relative p-0">
            <img
              src={BgRight}
              alt="FAQ Visual"
              className="img-fluid img-question"
            ></img>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center set-space">
            <h1 className="hero-title text-white mb-3 mb-md-4">
              Frequently Asked Questions
            </h1>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {faqQuestions.map((q, idx) => (
                <li
                  key={idx}
                  className="d-flex align-items-center mb-2 mb-md-4"
                >
                  <span className="tick-circle">
                    <FaCheck color="#18147f" size={18} />
                  </span>
                  <span className="faq-question">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;
