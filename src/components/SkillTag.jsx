import React from "react";

/**
 * SkillTag Component
 *
 * Props:
 * - skill: string - The skill/requirement name to display
 * - type: "matched" | "missing" - Type for styling (matched = green, missing = orange)
 * - size: "sm" | "md" - Size variant for different contexts
 */
const SkillTag = ({ skill, type = "matched", size = "md" }) => {
  const getClassName = () => {
    const baseClass = "skill-tag";
    const typeClass = `skill-tag--${type}`;
    const sizeClass = `skill-tag--${size}`;
    return `${baseClass} ${typeClass} ${sizeClass}`;
  };

  return (
    <span
      className={getClassName()}
      role="listitem"
      aria-label={`${skill} - ${
        type === "matched" ? "skill you have" : "skill to develop"
      }`}
    >
      {skill}
    </span>
  );
};

export default SkillTag;
