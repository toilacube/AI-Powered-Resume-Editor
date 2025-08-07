import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (elementId = "resume-container") => {
  const originalElement = document.getElementById(elementId);

  if (!originalElement) {
    throw new Error("Resume element not found. Please render the resume first.");
  }

  const clone = originalElement.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = originalElement.offsetWidth + "px";
  clone.style.backgroundColor = "white";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2, 
      useCORS: true,
      backgroundColor: "#ffffff",
      compress: true,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(canvas);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas, "PNG", 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(canvas, "PNG", 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save("resume.pdf");

  } catch (error) {
    console.error("PDF generation failed:", error);
    window.print();
  } finally {
    document.body.removeChild(clone);
  }
};