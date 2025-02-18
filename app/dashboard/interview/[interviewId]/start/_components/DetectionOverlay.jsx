import React from "react";

const DetectionOverlay = ({ data }) => (
  <div>
    {data.length == 0 && (
      <p className="text-red-600 font-bold">Alert: Face not found</p>
    )}
    {data.map((detection, idx) => (
      <div key={idx} className="detection-overlay">
        <p>Confidence: {detection.confidence}%</p>
        {data.length > 1 && idx === 0 && (
          <p className="text-red-600 font-bold">
            Alert: More than 1 face detected!
          </p>
        )}

        {detection.confidence !== null && detection.confidence < 92 && (
          <p className="text-red-600 font-bold">
            Alert: Face is not clearly visible
          </p>
        )}
        {detection.confidence > 92 && (
          <p className="text-green-600 font-bold">
            Great! Face is clearly visible.
          </p>
        )}
      </div>
    ))}
  </div>
);

export default DetectionOverlay;
