"use client";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export default function EmotionDetection() {
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState("Neutral");

  useEffect(() => {
    const loadModels = async () => {
      //   await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      //   await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      await faceapi.loadTinyFaceDetectorModel("/models");
      await faceapi.loadFaceExpressionModel("/models");

      startVideo();
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      detectExpressions();
    };

    const detectExpressions = async () => {
      setInterval(async () => {
        const detections = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detections) {
          const expressions = detections.expressions;
          const dominantEmotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );
          setEmotion(dominantEmotion);
        }
      }, 1000);
    };

    loadModels();
  }, []);

  return (
    <div className="flex justify-center text-center">
      <div>
        <video ref={videoRef} autoPlay muted className="w-96 border" />
        <h2 className="mt-2 text-lg">
          Detected Emotion: <strong>{emotion}</strong>
        </h2>
      </div>
    </div>
  );
}
