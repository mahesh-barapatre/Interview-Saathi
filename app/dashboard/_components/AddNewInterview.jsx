"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [interviewRound, setInterviewRound] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience, interviewRound);

    const InputPrompt = `Generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} highly relevant and well-structured interview questions along with precise, accurate answers.  
   
   Context:  
   - **Job Position:** ${jobPosition}  
   - **Interview Round:** ${interviewRound}  
   - **Job Description:** ${jobDesc}  
   - **Years of Experience Required:** ${jobExperience}  

   Guidelines:  
   - Ensure questions **align with the job position and experience level**.  
   - Questions should cover **both theoretical and practical aspects**, emphasizing problem-solving skills where applicable.  
   - Answers should be **concise, to the point, and technically accurate**, providing the **best possible response an interviewer expects**.  
   - Structure the response strictly in JSON format with the following fields:  
   
      [
       {
         "question": "<interview question>",
         "answer": "<ideal response>"
       }
     ]
    
   Do not include any explanations outside of the JSON structure. Focus on **high-quality, role-specific** questions and answers.`;

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(MockJsonResp);
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);

    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          interviewRound: interviewRound,
          jobPosition: jobPosition,
          interviewRound: interviewRound,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp);
      if (resp) {
        setOpenDailog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("ERROR");
    }
    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer
         transition-all border-dashed"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviwing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about yout job position/role, Job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label>Interview Round</label>
                    <Select
                      required
                      onValueChange={(value) => setInterviewRound(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Interview Round" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr round">HR Round</SelectItem>
                        <SelectItem value="technical round">
                          Technical Round
                        </SelectItem>
                        <SelectItem value="telephonic round">
                          Telephonic Round
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className=" my-3">
                    <label>Job Description/ Tech Stack (In Short)</label>
                    <Textarea
                      placeholder="Ex. React, Angular, NodeJs, MySql etc"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className=" my-3">
                    <label>Years of experience</label>
                    <Input
                      placeholder="Ex.5"
                      type="number"
                      max="100"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDailog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
