"use client";
import {
  FaceDetector,
  FilesetResolver,
  Detection,
} from "@mediapipe/tasks-vision";
import * as faceapi from "face-api.js";
import "./style.css";
import React, { useEffect, useRef, useState } from "react";
import DetectionOverlay from "./DetectionOverlay";
import EmotionDisplay from "./EmotionDisplay";

function VisualAiDetection() {
  const [emotion, setEmotion] = useState("Neutral");
  useEffect(() => {
    //check the camera access
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      loadFaceDetector();
    } else {
      console.warn("getUserMedia() is not supported by your browser");
    }

    //for emotion detection
    const loadModels = async () => {
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

  const videoRef = useRef(null);
  const [faceDetector, setFaceDetector] = useState(null);
  const [detectionData, setDetectionData] = useState([]);

  const loadFaceDetector = async () => {
    // Initialize your face detector here
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    const facedetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
    });
    setFaceDetector(facedetector);
  };

  const enableCam = async () => {
    if (!faceDetector) {
      alert("Face Detector is still loading. Please try again..");
      return;
    }

    const constraints = { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      })
      .catch((err) => console.error(err));
  };

  let lastVideoTime = -1;

  const predictWebcam = async () => {
    if (videoRef.current.currentTime !== lastVideoTime) {
      lastVideoTime = videoRef.current.currentTime;
      const detections = await faceDetector.detectForVideo(
        videoRef.current,
        performance.now()
      );
      setDetectionData(
        detections.detections.map((detection) => ({
          confidence: Math.round(detection.categories[0].score * 100),
          // boundingBox: detection.boundingBox,
          // keypoints: detection.keypoints,
        }))
      );
    }

    requestAnimationFrame(predictWebcam);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={enableCam}
        id="webcamButton"
        className="mdc-button mdc-button--raised"
      >
        <span className="mdc-button__ripple"></span>
        <span className="mdc-button__label">ENABLE WEBCAM</span>
      </button>
      <video id="webcam" ref={videoRef} muted autoPlay playsInline></video>
      <EmotionDisplay emotion={emotion} />
      <DetectionOverlay data={detectionData} />
    </div>
  );
}

export default VisualAiDetection;
