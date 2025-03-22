"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const RemoveInterviewHistory = async (mockId) => {
    try {
      await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));
      console.log("history deleted");

      setInterviewList(
        interviewList.filter((interview) => interview.mockId !== mockId)
      );
    } catch (error) {
      console.log("error occured", error);
    }
  };

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(
        eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(MockInterview.id));

    console.log(result);
    setInterviewList(result);
  };

  return (
    <div>
      <h2 className="font-medium text-2xl mt-5">Previous Mock Interview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {interviewList?.length > 0
          ? interviewList.map((interview, id) => (
              <InterviewItemCard
                interview={interview}
                key={interview.mockId}
                removeInterviewHistory={RemoveInterviewHistory}
              />
            ))
          : [1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className="h-[100px] w-full bg-gray-200 animate-pulse rounded-lg "
              ></div>
            ))}
      </div>
    </div>
  );
}

export default InterviewList;
