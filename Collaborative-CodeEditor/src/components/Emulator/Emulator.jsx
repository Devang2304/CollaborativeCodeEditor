import React from "react";
import "./Emulator.css";
export const Emulator = (props) => {
  const { html, css, js } = props.values;

  return (
    <div className="emulator">
      <iframe
        srcDoc={` <html>
        <body>${html || ""}</body>
        <style>${css || ""}</style>
        <script>${js || ""}</script>
      </html>`}
        title="output"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  );
};
