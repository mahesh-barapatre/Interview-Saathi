import React from "react";

const EmotionDisplay = ({ emotion }) => {
  const renderAdvice = (emotion) => {
    switch (emotion) {
      case "angry":
        return "It's important to stay calm during an interview. Take deep breaths and focus on positive aspects of the conversation.";
      case "sad":
        return "Interviews can be challenging, but stay motivated. Reflect on your achievements and maintain a positive outlook.";
      case "surprised":
        return "Surprises happen! Take a moment to compose yourself and approach the next questions with confidence.";
      case "fearful":
        return "It's okay to feel nervous. Remember, preparation is key. Take deep breaths and trust your knowledge.";
      case "disgusted":
        return "Maintain professionalism during interviews. Focus on the positives and steer the conversation productively.";
      case "neutral":
        return "You're doing great! Stay composed and keep up the steady performance.";
      case "happy":
        return "Your positivity is contagious! Keep smiling and let your enthusiasm shine through.";
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
