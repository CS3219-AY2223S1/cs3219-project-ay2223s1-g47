import { EditorView, basicSetup } from "codemirror";
import { EditorState, Extension } from "@codemirror/state";
import { useCallback, useEffect, useState } from "react";
import { javascript } from "@codemirror/lang-javascript";

export default function useCodeMirrorEditor(extensions: Extension[]) {
  // ============ state ============
  const [element, setElement] = useState<HTMLElement>();

  // ============ hooks ============
  /**
   * Calback we use to get our DOM element when the component mounts.
   */
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  /**
   * Hook we use to intitialize the code editor.
   */
  useEffect(() => {
    if (!element) return;

    const view = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, javascript(), ...extensions],
      }),
      parent: element,
    });

    return () => view?.destroy();
  }, [element, extensions]);

  return ref;
}
