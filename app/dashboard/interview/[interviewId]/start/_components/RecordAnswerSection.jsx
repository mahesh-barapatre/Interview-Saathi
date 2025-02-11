"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  // const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results?.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  // useEffect(() => {
  //   if (!isRecording && userAnswer?.length > 10) {
  //     UpdateUserAnswer();
  //   }
  // }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      //clearing the previous answer for re-recording
      setUserAnswer("");
      setResults([]);

      //start recording new answer
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt = `Evaluate the user's response to the given interview question and provide constructive feedback.  
  Question: "${mockInterviewQuestion[activeQuestionIndex]?.question}"  
  User Answer: "${userAnswer}"  

  Based on the quality, relevance, clarity, and depth of the response, provide:  
  1. A **rating (out of 10)** indicating how well the answer aligns with an ideal response.  
  2. A **concise, constructive critique** identifying areas of improvement, such as missing key points, clarity issues, technical depth, or structuring suggestions.  
  3. A **brief example or suggestion** (if needed) on how to enhance the answer.  

  Format the response strictly as JSON with two fields:  
  {
    "rating": <numeric_rating_out_of_10>,
    "feedback": "<precise and actionable feedback>"
  }  
  Ensure the feedback is **specific, practical, and directly useful** for improving interview performance.`;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
    });

    if (resp) {
      toast("User Answer recorded successfully");
      setUserAnswer("");
      setResults([]);
      // setAlreadySubmitted(true);
    }
    setResults([]);

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          alt="webcam"
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 500,
            width: 500,
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        // disabled={loading || alreadySubmitted}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic />
            {/* {alreadySubmitted
              ? "Answer Submitted"
              : userAnswer?.length > 0
              ? "Re-record answer"
              : "Record Answer"} */}
            {userAnswer?.length > 0 ? "Re-record answer" : "Record Answer"}
          </h2>
        )}
      </Button>
      <Button variant="outline" className="my-10" onClick={UpdateUserAnswer}>
        Submit Answer
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
