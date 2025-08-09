import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, LoaderCircle } from "lucide-react";
import ResumePDFDocument from "./ResumePDFDocument";
import "../styles/ZoomWrapper.css";
const ZoomWrapper = ({ children, resumeData }) => {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={3}
      centerOnInit={true}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="zoom-wrapper">
          <div className="tools">
            <div className="zoom-controls">
              <button onClick={() => zoomIn()} aria-label="Zoom In">
                +
              </button>
              <button onClick={() => zoomOut()} aria-label="Zoom Out">
                -
              </button>
              <button onClick={() => resetTransform()} aria-label="Reset Zoom">
                Reset
              </button>
            </div>
          </div>
          <TransformComponent>
            <div className="zoom-content">
              <div>{children}</div>
            </div>
          </TransformComponent>
          <div className="floating-button">
            <PDFDownloadLink
              document={<ResumePDFDocument data={resumeData} />}
              fileName="resume.pdf"
              className="download-pdf-button primary"
            >
              {({ loading }) =>
                loading ? (
                  <>
                    <LoaderCircle size={16} className="spinner" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download PDF</span>
                  </>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </TransformWrapper>
  );
};

export default ZoomWrapper;
