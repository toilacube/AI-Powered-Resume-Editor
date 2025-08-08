// src/components/ResumePDFDocument.jsx
import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { styles } from './pdfStyles'; // Import our updated styles

const ResumePDFDocument = ({ data }) => {
  if (!data) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Text style={styles.name}>{data.name}</Text>
            <Text>-</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text>{data.contact?.email}</Text>
            <Text>-</Text>
            <Text>{data.contact?.phone}</Text>
            <Text>-</Text>
            <Text>{data.contact?.github}</Text>
          </View>
        </View>

        {/* EDUCATION */}
        {data.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution}</Text>
                  <Text style={styles.entryDuration}>{edu.duration}</Text>
                </View>
                <Text style={[styles.entryDescription, { fontFamily: 'Times-Bold' }]}>{edu.degree}</Text>
                <Text style={styles.entryDescription}>{edu.details}</Text>
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {data.skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsList}>
              <Text style={styles.skill}>
                <Text style={styles.skillCategory}>Languages:</Text> {data.skills.languages}
              </Text>
              <Text style={styles.skill}>
                <Text style={styles.skillCategory}>Frameworks | Libraries | Platform:</Text> {data.skills.frameworks}
              </Text>
              <Text style={styles.skill}>
                <Text style={styles.skillCategory}>Databases:</Text> {data.skills.databases}
              </Text>
              <Text style={styles.skill}>
                <Text style={styles.skillCategory}>Source/Project Management:</Text> {data.skills.sourceManagement}
              </Text>
              <Text style={styles.skill}>
                <Text style={styles.skillCategory}>English:</Text> {data.skills.english}
              </Text>
              <Text style={styles.skill}>
                <Text style={styles.skillCategory}>Others:</Text> {data.skills.others}
              </Text>
            </View>
          </View>
        )}

        {/* EXPERIENCE */}
        {data.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    <Text style={styles.entryTitleBold}>{exp.role}</Text> | {exp.company}
                  </Text>
                  <Text style={styles.entryDuration}>{exp.duration}</Text>
                </View>
                <View style={styles.list}>
                  {exp.responsibilities?.map((resp, j) => (
                    <Text key={j} style={styles.listItem}>• {resp}</Text>
                  ))}
                </View>
                <Text style={styles.techStack}>
                  <Text style={styles.techStackBold}>Tech Stacks:</Text> {exp.techStack}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {data.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    <Text style={styles.entryTitleBold}>{proj.name}</Text> {proj.isPersonal ? "(Personal Project)" : ""}
                  </Text>
                </View>
                 <View style={styles.list}>
                  {proj.responsibilities?.map((resp, j) => (
                    <Text key={j} style={styles.listItem}>• {resp}</Text>
                  ))}
                </View>
                <Text style={styles.techStack}>
                  <Text style={styles.techStackBold}>Tech Stacks:</Text> {proj.techStack}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDFDocument;