import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import RandomColor from "randomcolor";
import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import { Y_JS_SIGNALLING_SERVERS } from "../../constants";

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
  initialCode?: string;
  codeCallback: (code: string) => void;
}) {
  // =========== props =========================
  const { roomId, username, language, codeCallback, initialCode } = props;

  // =========== state management ==============
  // editor stuff for state
  const editor = useRef<HTMLDivElement>(null);

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
      // 1. create yjs document and get text from codemirror editor
      const yDoc = new Y.Doc();
      const yText = yDoc.getText("codemirror");
      if (!!initialCode) {
        yText.insert(0, initialCode);
      }

      // TODO: as import signalling servers for y-webrtc
      const signallingServers = Y_JS_SIGNALLING_SERVERS;

      // 2. create webrtc provider
      // we do tsignore due to a bug in the soource code with overly strict typing
      //@ts-ignore
      const provider = new WebrtcProvider(roomId, yDoc, {
        signaling: signallingServers,
        maxConns: 10, // only support 2 for now
      });

      // 3. include a undo manager
      const yUndoManager = new Y.UndoManager(yText);

      // 4. set awareness state
      // TODO: fix bug here with name
      const color = RandomColor();
      const awareness = provider.awareness;
      awareness.setLocalStateField("user", {
        name: username,
        color: color,
      });

      // 5. create codemirror editor state
      const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
          basicSetup, // TODO: tweak this
          convertLanguage(language),
          yCollab(yText, provider.awareness, { undoManager: yUndoManager }),
          EditorView.updateListener.of((v: ViewUpdate) => {
            if (v.docChanged) {
              codeCallback(yText.toString());
            }
          }),
        ],
      });

      // 6. create view from state
      //@ts-ignore
      const view = new EditorView({
        state,
      });

      // 7. attach view
      editor.current?.appendChild(view.dom);

      return () => {
        // 8. cleanup
        if (provider) {
          provider.destroy(); // disconnect
          yDoc.destroy(); // destroy ydoc to stop propagating when user leaves editor
        }
        if (editor.current) {
          editor.current.removeChild(view.dom); // remove editor
        }
      };
    } catch (e) {
      console.error(e);
    }
  }, [initialCode]);

  // ================== render ==================
  return <div ref={editor}></div>;
}
