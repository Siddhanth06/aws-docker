import "./App.css";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { useMemo, useState, useEffect } from "react";

const App = () => {
  const [editor, setEditor] = useState(null);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);
  const [username, setUsername] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || "";
  });
  const [users, setUsers] = useState([]);

  const handleEditorDidMount = (editor) => {
    setEditor(editor);
  };

  useEffect(() => {
    if (!username || !editor) return;

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "monaco",
      ydoc,
      {
        autoConnect: true,
      },
    );

    provider.awareness.setLocalStateField("user", { username });

    provider.awareness.on("change", () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(
        states
          .filter((state) => state.user && state.user.username)
          .map((state) => state.user),
      );
    });

    function handleBeforeUnload() {
      provider.awareness.setLocalStateField("user", null);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    const monacoBinding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness,
    );

    return () => {
      monacoBinding.destroy();
      provider.awareness.setLocalStateField("user", null);
      provider.disconnect();
      provider.destroy();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [username, editor, ydoc, yText]);

  function handleJoin(e) {
    e.preventDefault();
    setUsername(e.target.username.value);
    window.history.pushState({}, "", `?username=${e.target.username.value}`);
  }

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex items-center justify-center">
        <form onSubmit={handleJoin} className="p-8 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Enter your username"
            name="username"
            className="w-full p-2 rounded-lg mb-4 text-white bg-gray-800"
          />
          <button className="w-full bg-amber-50 text-gray-950 p-2 rounded-lg hover:bg-blue-600">
            Join
          </button>
        </form>
      </main>
    );
  }

  return (
    <>
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
        <aside className="h-full w-1/4 bg-amber-50 rounded-lg">
          <h2 className="text-gray-950 text-lg font-semibold p-4 border-b border-gray-300">
            Users
          </h2>
          <ul className="p-4">
            {users.map((user, index) => (
              <li key={index} className="text-gray-950 mb-2">
                {user.username}
              </li>
            ))}
          </ul>
        </aside>
        <section className="h-full w-3/4 bg-blue-50 rounded-lg ">
          <Editor
            theme="vs-dark"
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            onMount={handleEditorDidMount}
          />
        </section>
      </main>
    </>
  );
};

export default App;
