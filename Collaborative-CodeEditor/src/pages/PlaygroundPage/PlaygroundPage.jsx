import React, { useEffect, useState } from "react";
import { CodeEditor } from "../../components/CodeEditor/CodeEditor";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";
import * as io from "socket.io-client";
import "./PlaygroundPage.css";
import { Emulator } from "../../components/Emulator/Emulator";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../constants";

const SAVE_INTERVAL_MS = 2000;
const RUN_INTERVAL_MS = 1200;

//const socket = io("http://localhost:9092", { reconnection: false,query: "foo=bar"  });

export const PlaygroundPage = (props) => {
  let { projectID } = useParams();

  const [html, setHtml] = useState("loading...");
  const [css, setCss] = useState("loading...");
  const [js, setJs] = useState("loading...");

  const [delayedCodes, setDelayedCodes] = useState({ html, css, js });

  const [socket, setSocket] = useState();

  //connect to socket
  useEffect(() => {
    const s = io(BASE_URL, {
      reconnection: false,
      query: "room=" + projectID,
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [projectID]);

  //get project
  useEffect(() => {
    if (projectID !== undefined && socket !== undefined) {
      socket.emit("project_get", {
        room: projectID,
      });
    }
  }, [projectID, socket]);

  //delayed auto run codes
  useEffect(() => {
    const interval = setInterval(() => {
      setDelayedCodes({ html, css, js });
    }, RUN_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [html, css, js]);

  //auto saver
  useEffect(() => {
    if (
      socket === undefined ||
      html === "loading..." ||
      css === "loading..." ||
      js === "loading..."
    )
      return;
    const interval = setInterval(() => {
      socket.emit("project_save", {
        room: projectID,
        html: html,
        css: css,
        js: js,
      });
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, html, css, js]);

  const onHtmlChange = (value) => {
    setHtml(value);
    notifyChange(value, "HTML");
  };

  const onCssChange = (value) => {
    setCss(value);
    notifyChange(value, "CSS");
  };

  const onJsChange = (value) => {
    setJs(value);
    notifyChange(value, "JS");
  };

  const notifyChange = (value, type) => {
    socket.emit("project_write", {
      data: value,
      room: projectID,
      type: type,
    });
  };

  useEffect(() => {
    if (socket == null) return;
    const project_read = ({ data, type }) => {
      // setValues({ ...values, [type.toLowerCase()]: data });
      switch (type) {
        case "HTML":
          setHtml(data);
          //setValues({ ...values, html: data });
          break;
        case "CSS":
          setCss(data);
          // setValues({ ...values, css: data });
          break;
        case "JS":
          setJs(data);
          // setValues({ ...values, js: data });
          break;
      }
    };

    const project_retrieve = (data) => {
      const jsonData = JSON.parse(data);
      setHtml(jsonData.html);
      setCss(jsonData.css);
      setJs(jsonData.js);
    };

    socket.on("project_read", project_read);
    socket.on("project_retrieved", project_retrieve);

    return () => {
      socket.off("project_read", project_read);
      socket.off("project_retrieved", project_retrieve);
    };
  }, [socket]);

  return (
    <div className="playground">
      <SplitPane split="vertical">
        <Pane initialSize="34%" minSize="15%">
          <CodeEditor
            name="HTML"
            lang="xml"
            value={html}
            handleChange={onHtmlChange}
          />
        </Pane>
        <Pane initialSize="33%" minSize="15%">
          <CodeEditor
            name="CSS"
            lang="css"
            value={css}
            handleChange={onCssChange}
          />
        </Pane>
        <Pane initialSize="33%" minSize="15%">
          <CodeEditor
            name="JS"
            lang="javascript"
            value={js}
            handleChange={onJsChange}
          />
        </Pane>
      </SplitPane>

      <Emulator values={delayedCodes} />
    </div>
  );
};
