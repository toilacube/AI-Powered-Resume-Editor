import { useState, useEffect } from "react";
import initialData from "../data/resumeData.json";

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem("resumeData");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(resumeData, null, 2)
  );

  useEffect(() => {
    console.log("update resume data effect: ", resumeData);
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    setJsonInput(JSON.stringify(resumeData, null, 2));
  }, [resumeData]);

  const updateResumeData = (newData) => {
    console.log("update resume data: ", newData);
    setResumeData(newData);
  };

  const updateJsonInput = (newJson) => {
    console.log("update json input: ", newJson);
    setJsonInput(newJson);
  };

  return {
    resumeData,
    jsonInput,
    updateResumeData,
    updateJsonInput,
  };
};
