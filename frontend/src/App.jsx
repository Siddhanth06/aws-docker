import "./App.css";
import Editor from "@monaco-editor/react";
const App = () => {
  return (
    <>
      <main className="h-screen w-full bg-gray-950 flex gap-4 p-4">
        <aside className="h-full w-1/4 bg-amber-50 rounded-lg"></aside>
        <section className="h-full w-3/4 bg-blue-50 rounded-lg ">
          <Editor
            theme="vs-dark"
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="// some comment"
          />
        </section>
      </main>
    </>
  );
};

export default App;
