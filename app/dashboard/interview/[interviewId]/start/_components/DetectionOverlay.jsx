import React from "react";

const DetectionOverlay = ({ data }) => (
  <div>
    {data.length === 0 ? (
      <p className="font-bold min-h-[24px] text-red-600">
        Alert: Face not found
      </p>
    ) : (
      data.map((detection, idx) => {
        let message = "Great! Face is clearly visible.";
        let textColor = "text-green-600";

        if (data.length > 1 && idx === 0) {
          message = "Alert: More than 1 face detected!";
          textColor = "text-red-600";
        } else if (detection.confidence < 92) {
          message = "Alert: Face is not clearly visible";
          textColor = "text-red-600";
        }

        return (
          <div key={idx} className="detection-box">
            <p>Confidence: {detection.confidence}%</p>
            <p className={`font-bold min-h-[24px] ${textColor}`}>{message}</p>
          </div>
        );
      })
    )}
  </div>
);

export default DetectionOverlay;
