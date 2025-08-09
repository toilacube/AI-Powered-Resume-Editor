import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/ZoomWrapper.css";
const ZoomWrapper = ({ children }) => {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={3}
      centerOnInit={true}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <div className="tools">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            <button onClick={() => resetTransform()}>Reset</button>
          </div>
          <TransformComponent>
            <div className="zoom-content">{children}</div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

export default ZoomWrapper;