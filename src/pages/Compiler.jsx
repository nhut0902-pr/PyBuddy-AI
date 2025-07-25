import React, { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import LoadingSpinner from '../components/LoadingSpinner';

const Compiler = () => {
  const [code, setCode] = useState('# Welcome to the Python Compiler!\n# Try printing something.\nprint("Hello, World!")');
  const [output, setOutput] = useState('');
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const pyodide = useRef(null);

  useEffect(() => {
    async function loadPyodide() {
      try {
        pyodide.current = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        // Intercept Python's print statements
        pyodide.current.runPython(`
          import sys
          import io
          sys.stdout = io.StringIO()
          sys.stderr = io.StringIO()
        `);
        setIsPyodideReady(true);
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        setOutput("Error: Could not load the Python environment. Please refresh the page.");
      }
    }
    loadPyodide();
  }, []);

  const runCode = async () => {
    if (!isPyodideReady) return;

    setIsRunning(true);
    setOutput('Running code...');

    try {
      // Reset stdout/stderr
      pyodide.current.runPython(`
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()
      `);
      
      // Run the user's code
      await pyodide.current.runPythonAsync(code);

      // Get output and errors
      const stdout = pyodide.current.runPython("sys.stdout.getvalue()");
      const stderr = pyodide.current.runPython("sys.stderr.getvalue()");

      if (stderr) {
        setOutput(`Error:\n${stderr}`);
      } else {
        setOutput(stdout);
      }
    } catch (error) {
      setOutput(`Error:\n${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Practice with Built-in Compiler</h1>
      <div className="card">
        {!isPyodideReady && (
          <div>
            <p>Loading Python Environment...</p>
            <LoadingSpinner />
          </div>
        )}
        {isPyodideReady && (
          <>
            <AceEditor
              mode="python"
              theme="monokai"
              onChange={setCode}
              name="python-editor"
              value={code}
              fontSize={16}
              width="100%"
              height="350px"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
            <button className="button" onClick={runCode} disabled={isRunning} style={{ marginTop: '1rem' }}>
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <div style={{ marginTop: '1rem' }}>
              <h3>Output:</h3>
              <pre>{output}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Compiler;
