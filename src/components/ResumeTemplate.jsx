// src/components/ResumeTemplate.jsx
import React from "react";
import "../styles/Resume.css"; // We'll use the new CSS below
import ZoomWrapper from "./ZoomWrapper";

const ResumeTemplate = ({ data }) => {
  if (!data) return <div className="resume-container">Loading...</div>;

  return (
    <ZoomWrapper resumeData={data}>
      <div id="resume-container" className="resume-container">
        <header className="resume-header">
          <div className="header-main">
            <h1>{data?.name || ""}</h1>-<h2>{data?.title || ""}</h2>
          </div>
          <div className="contact-info">
            <span>{data?.contact?.email || ""}</span>
            <span>-</span>
            <span>{data?.contact?.phone || ""}</span>
            <span>-</span>
            <span>{data?.contact?.github || ""}</span>
          </div>
        </header>

        <section className="resume-section">
          {data?.education?.length > 0 && <h3>Education</h3>}
          {data?.education?.map((edu, index) => (
            <div key={index} className="entry">
              <div className="entry-header">
                <h4>{edu?.institution || ""}</h4>
                <span className="duration">{edu?.duration || ""}</span>
              </div>
              <p>
                <strong>{edu?.degree || ""}</strong>
              </p>
              <p>{edu?.details || ""}</p>
            </div>
          ))}
        </section>

        <section className="resume-section">
          { <h3>Skills</h3>}
          <div className="skills-list">
            <p>
              <strong>Languages:</strong> {data?.skills?.languages || ""}
            </p>
            <p>
              <strong>Frameworks | Libraries | Platform:</strong>{" "}
              {data?.skills?.frameworks || ""}
            </p>
            <p>
              <strong>Databases:</strong> {data?.skills?.databases || ""}
            </p>
            <p>
              <strong>Source/Project Management:</strong>{" "}
              {data?.skills?.sourceManagement || ""}
            </p>
            <p>
              <strong>English:</strong> {data?.skills?.english || ""}
            </p>
            <p>
              <strong>Others:</strong> {data?.skills?.others || ""}
            </p>
          </div>
        </section>

        <section className="resume-section">
          <h3>Experience</h3>
          {data?.experience?.map((exp, index) => (
            <div key={index} className="entry">
              <div className="entry-header">
                <h4>
                  <strong>{exp?.role || ""}</strong> | {exp?.company || ""}
                </h4>
                <span className="duration">{exp?.duration || ""}</span>
              </div>
              <ul>
                {exp?.responsibilities?.map((resp, i) => (
                  <li key={i}>{resp || ""}</li>
                ))}
              </ul>
              <p className="tech-stack">
                <strong>Tech Stacks:</strong> {exp?.techStack || ""}
              </p>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h3>Projects</h3>
          {data?.projects?.map((proj, index) => (
            <div key={index} className="entry">
              <div className="entry-header">
                <h4>
                  <strong>{proj?.name || ""}</strong>{" "}
                  {proj?.isPersonal ? "(Personal Project)" : ""}
                </h4>
              </div>
              <ul>
                {proj?.responsibilities?.map((resp, i) => (
                  <li key={i}>{resp || ""}</li>
                ))}
              </ul>
              <p className="tech-stack">
                <strong>Tech Stacks:</strong> {proj?.techStack || ""}
              </p>
            </div>
          ))}
        </section>
      </div>
    </ZoomWrapper>
  );
};

export default ResumeTemplate;
