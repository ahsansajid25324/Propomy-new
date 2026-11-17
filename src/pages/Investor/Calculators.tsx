import { useState, useRef, useEffect } from "react";
import ROICalculator from "../../components/pages/ROICalculator";
import BRRRRCalculator from "../../components/pages/BRRCalculator";
import RentalCalculator from "../../components/pages/RentalCalculator";
import DSCRCalculator from "../../components/pages/DSCRCalculator";
import "../../styles/Calculators.css";
import FixFlipCalculator from "../../components/pages/FixFlipCalculator";
import CapRateGrmCalculator from "../../components/pages/CapRateCalculator";
type CalculatorTab =
  | "roi"
  | "brrrr"
  | "rental"
  | "dscr"
  | "fixflip"
  | "caprate";

const TABS: { key: CalculatorTab; label: string; soon?: boolean }[] = [
  { key: "roi", label: "ROI Calculator" },
  { key: "brrrr", label: "BRRRR Calculator" },
  { key: "rental", label: "Rental Estimator" },
  { key: "dscr", label: "DSCR Calculator" },
  { key: "fixflip", label: "Fix & Flip Calculator" },
  { key: "caprate", label: "Cap Rate & GRM Calculator" },
];

const Calculators = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>("roi");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setPill({ left: el.offsetLeft, width: el.offsetWidth });

      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

  return (
    <div>
      <div className="roi-tabs-wrapper roi-tabs-sticky">
        <div className="roi-tabs">
          <div
            className="roi-tabs-pill"
            style={{
              transform: `translateX(${pill.left}px)`,
              width: `${pill.width}px`,
            }}
          />

          {TABS.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              disabled={tab.soon}
              onClick={() => setActiveTab(tab.key)}
              className={`roi-tab-btn ${activeTab === tab.key ? "active" : ""} ${tab.soon ? "soon-disabled" : ""}`}
            >
              <span className="tab-text">{tab.label}</span>
              {tab.soon && <span className="roi-tab-badge">SOON</span>}
            </button>
          ))}
        </div>
      </div>

      <div key={activeTab} className="calculator-view-content">
        {activeTab === "roi" && <ROICalculator />}
        {activeTab === "brrrr" && <BRRRRCalculator />}
        {activeTab === "rental" && <RentalCalculator />}
        {activeTab === "dscr" && <DSCRCalculator />}
        {activeTab === "fixflip" && <FixFlipCalculator />}
        {activeTab === "caprate" && <CapRateGrmCalculator />}
      </div>
    </div>
  );
};

export default Calculators;
