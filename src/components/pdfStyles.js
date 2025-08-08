// src/components/pdfStyles.js
import { StyleSheet } from "@react-pdf/renderer";

// Note: All measurements are in points (pt). An A4 page is ~595pt wide.
// Font sizes are chosen to reflect the hierarchy of the target CSS.
const fontSizeH1 = 13;
const fontSizeH2 = 12;
const fontSizeH3 = 11; // Section Title
const fontSizeH4 = 10; // Entry Title
const fontSizeBody = 9.75;
const fontSizeSmall = 9;

export const styles = StyleSheet.create({
  // Page and Body
  page: {
    fontFamily: "Times-Roman", // Match the 'serif' font family from CSS
    fontSize: fontSizeBody,
    lineHeight: 1.2,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  // Header
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  headerMain: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8, // Simulates CSS gap
  },
  name: {
    fontSize: fontSizeH1,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: fontSizeH2,
    fontFamily: "Times-Roman",
    textTransform: "uppercase",
    color: "#333",
  },
  contactInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 18, // Simulates the large gap in the CSS
    fontSize: fontSizeSmall,
    marginTop: 8,
  },

  // Sections
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: fontSizeH3,
    fontFamily: "Times-Bold",
    color: "#005a9c",
    textTransform: "uppercase",
    borderBottom: "2pt solid #005a9c",
    paddingBottom: 2,
    marginBottom: 4,
  },

  // Entries (for Education, Experience, Projects)
  entry: {
    marginBottom: 4,
  },
  entryHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: fontSizeH4,
    fontFamily: "Times-Roman",
  },
  entryTitleBold: {
    fontFamily: "Times-Bold",
  },
  entryDuration: {
    fontSize: fontSizeSmall,
    fontFamily: "Times-Bold",
  },

  // Text and Lists
  entryDescription: {
    fontSize: fontSizeBody,
  },
  list: {
    paddingLeft: 10, // Indent for list items
    display: "flex",
    flexDirection: "column",
    gap: 4, // Space between list items
  },
  listItem: {
    fontSize: fontSizeBody,
  },
  techStack: {
    fontSize: fontSizeSmall,
    marginTop: 4,
  },
  techStackBold: {
    fontFamily: "Times-Bold",
  },

  // Skills Section
  skillsList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  skill: {
    fontSize: fontSizeBody,
  },
  skillCategory: {
    fontFamily: "Times-Bold",
  },
});