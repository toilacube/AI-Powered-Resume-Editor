// src/components/ResumeTemplate.jsx
import React from "react";
import "../styles/Resume.css"; // We'll create this CSS file

const ResumeTemplate = ({ data }) => {
  if (!data) return <div className="resume-container">Loading...</div>;

  return (
    <div id="resume-container" className="resume-container">
      <header className="resume-header">
        <h1>{data.name}</h1>
        <h2>{data.title}</h2>
        <div className="contact-info">
          <span>{data.contact.email}</span> | <span>{data.contact.phone}</span>{" "}
          | <span>github.com/{data.contact.github}</span>
        </div>
      </header>

      <section className="resume-section">
        <h3>Education</h3>
        {data.education.map((edu, index) => (
          <div key={index} className="entry">
            <h4>{edu.institution}</h4>
            <p>
              <strong>{edu.degree}</strong> ({edu.duration})
            </p>
            <p>{edu.details}</p>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h3>Skills</h3>
        <div className="skills-grid">
          <p>
            <strong>Languages:</strong> {data.skills.languages}
          </p>
          <p>
            <strong>Frameworks:</strong> {data.skills.frameworks}
          </p>
          <p>
            <strong>Databases:</strong> {data.skills.databases}
          </p>
          <p>
            <strong>Source Management:</strong> {data.skills.sourceManagement}
          </p>
          <p>
            <strong>English:</strong> {data.skills.english}
          </p>
          <p>
            <strong>Others:</strong> {data.skills.others}
          </p>
        </div>
      </section>

      <section className="resume-section">
        <h3>Experience</h3>
        {data.experience.map((exp, index) => (
          <div key={index} className="entry">
            <h4>
              {exp.role} at {exp.company}
            </h4>
            <p className="duration">{exp.duration}</p>
            <ul>
              {exp.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
            <p>
              <em>Tech Stack: {exp.techStack}</em>
            </p>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h3>Projects</h3>
        {data.projects.map((proj, index) => (
          <div key={index} className="entry">
            <h4>
              {proj.name} {proj.isPersonal && "(Personal Project)"}
            </h4>
            <ul>
              {proj.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
            <p>
              <em>Tech Stack: {proj.techStack}</em>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ResumeTemplate;
