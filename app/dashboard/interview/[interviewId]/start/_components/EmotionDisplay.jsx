import React from "react";

const EmotionDisplay = ({ emotion }) => {
  const renderAdvice = (emotion) => {
    switch (emotion) {
      case "angry":
        return "Stay calm. Take deep breaths and focus on the positives.";
      case "sad":
        return "Stay motivated. Reflect on your achievements and stay positive.";
      case "surprised":
        return "Take a moment to compose yourself and stay confident.";
      case "fearful":
        return "Nervous? Breathe deeply and trust your preparation.";
      case "disgusted":
        return "Stay professional. Focus on positives and steer ahead.";
      case "neutral":
        return "You're doing great! Keep up the steady performance.";
      case "happy":
        return "Your positivity shines! Keep smiling and stay enthusiastic.";

      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="mt-2 text-lg">
        Detected Emotion: <strong>{emotion}</strong>
      </h2>
      {renderAdvice(emotion) && (
        <p className="mt-2 text-sm text-blue-600">{renderAdvice(emotion)}</p>
      )}
    </div>
  );
};

export default EmotionDisplay;
