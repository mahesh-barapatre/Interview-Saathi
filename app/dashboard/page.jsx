import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

function Dashboard() {
  return (
    <div className="px-10 py-5">
      <h2 className="font-bold text-4xl text-primary">Dashboard</h2>
      <h2 className="text-gray-500 my-2">
        Create and Start your AI Mockup Interview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <AddNewInterview />
      </div>

      {/* Previous Interview List  */}
      <InterviewList />
    </div>
  );
}

export default Dashboard;
