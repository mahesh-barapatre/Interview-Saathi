"use client";
import {
  FaceDetector,
  FilesetResolver,
  Detection,
} from "@mediapipe/tasks-vision";
import "./style.css";
import React, { useEffect, useRef, useState } from "react";

const DetectionOverlay = ({ data }) => (
  <div>
    {data.map((detection, idx) => (
      <div key={idx} className="detection-overlay">
        <p>Confidence: {detection.confidence}%</p>
        {/* {detection.keypoints.map((kp, i) => (
          <span
            key={i}
            className="key-point"
            style={{ top: `${kp.y * 100}%`, left: `${(1 - kp.x) * 100}%` }}
          />
        ))} */}
      </div>
    ))}
  </div>
);

function FaceDetection() {
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
  }, []);

  const videoRef = useRef(null);
  const liveViewRef = useRef(null);
  const [faceDetector, setFaceDetector] = useState(null);
  const [children, setChildren] = useState([]);
  const [detectionData, setDetectionData] = useState([]);

  const loadFaceDetector = async () => {
    // Initialize your face detector here
    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
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
          boundingBox: detection.boundingBox,
          keypoints: detection.keypoints,
        }))
      );
    }

    requestAnimationFrame(predictWebcam);
  };

  return (
    <div>
      <h1>Face detection using the MediaPipe Face Detector task</h1>

      <section id="demos" className="">
        <h2>Demo: Webcam continuous face detection</h2>
        <p>
          Detect faces from your webcam. When ready click "enable webcam" below
          and accept access to the webcam.
        </p>
        <div id="liveView" ref={liveViewRef} className="videoView">
          <button
            onClick={enableCam}
            id="webcamButton"
            className="mdc-button mdc-button--raised"
          >
            <span className="mdc-button__ripple"></span>
            <span className="mdc-button__label">ENABLE WEBCAM</span>
          </button>
          <video id="webcam" ref={videoRef} muted autoPlay playsInline></video>
          <DetectionOverlay data={detectionData} />
        </div>
      </section>
    </div>
  );
}

export default FaceDetection;
