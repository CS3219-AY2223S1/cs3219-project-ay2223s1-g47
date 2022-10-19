import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import RandomColor from "randomcolor";
import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";

/**
 * Real-time collaborative editor. The actual editor is based on codemirror and binds yjs's Y.text type to
 * the underlying codemirror document, and using y-webrtc to sync the document across multiple clients.
 *
 * See the webrtc docs: https://github.com/yjs/y-webrtc
 */
export default function RealTimeCollaborativeEditor(props: {
  roomId: string;
  username: string;
  userId: string;
  language: string;
  initialCode: string;
  codeCallback: (code: string) => void;
}) {
  // =========== props =========================
  const { roomId, username, language, codeCallback, initialCode } = props;

  // =========== state management ==============
  // editor references
  const [editorRef, setEditorRef] = useState<ReactCodeMirrorRef>({});

  // editor stuff for state
  const editor = useRef<HTMLDivElement>(null);

  // code
  const [code, setCode] = useState("");

  // ================== functions ==================
  /**
   * Converts a string language to a specified language for the editor.
   */
  const convertLanguage = (language: string) => {
    language = language.toLowerCase();
    const defaultLanguage = python();
    switch (language) {
      case "python":
        return python();
      case "javascript":
        return javascript();
      default:
        return defaultLanguage;
    }
  };

  // =========== effect management ==============
  /**
   * Hook that initializes the editor.
   */
  useEffect(() => {
    try {
      console.log("creating yjs document");
      // create yjs document and get text from codemirror editor
      const yDoc = new Y.Doc();
      const yText = yDoc.getText("codemirror");
      yText.insert(0, initialCode);

      // signalling servers for y-webrtc
      const signallingServers = ["ws://localhost:4444"];

      // create webrtc provider
      // we do tsignore due to a bug in the soource code with overly strict typing
      //@ts-ignore
      const provider = new WebrtcProvider(roomId, yDoc, {
        signaling: signallingServers,
        maxConns: 2, // only support 2 for now
      });

      // include a undo manager
      const yUndoManager = new Y.UndoManager(yText);

      // set awareness state
      const color = RandomColor();
      const awareness = provider.awareness;
      awareness.setLocalState({
        name: username,
        color: color,
      });

      // create codemirror editor state
      const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
          basicSetup,
          convertLanguage(language),
          yCollab(yText, provider.awareness, { undoManager: yUndoManager }),
        ],
      });

      // create view from state
      console.log(state, editor.current);
      //@ts-ignore
      const view = new EditorView({
        state,
        // parent: refs.current.editor.parentElement,
        parent: editor.current ?? undefined,
      });

      return () => {
        if (provider) {
          provider.destroy(); // disconnect
          yDoc.destroy(); // destroy ydoc to stop propagating when user leaves editor
        }
      };
    } catch (e) {
      console.error(e);
    }
  }, []);

  // ================== render ==================
  // const codeEditor = (
  //   <CodeMirror
  //     ref={refs}
  //     onChange={(value: string, viewUpdate: any) => {
  //       console.log("callbacks");
  //       codeCallback(value);
  //     }}
  //     autoFocus
  //     aria-autocomplete="list"
  //     theme="light"
  //     extensions={[convertLanguage(language)]}
  //   />
  // );
  return (
    <div
      ref={editor}
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        fontSize: "20px",
        overflowY: "auto",
      }}
    ></div>
  );
}
