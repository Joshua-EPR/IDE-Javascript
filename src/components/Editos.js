import React, { useState, useRef } from "react";
import Editor from '@monaco-editor/react';

const IDE = () => {
    const [code, setCode] = useState(`var a = '';

let i = 0;

for(i; i<5; i++){
  a += '*';
  console.log(a)
}`);
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const editorRef = useRef(null);

    const runCode = () => {
        // Almacenar los métodos originales de la consola
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;

        // Crear un nuevo método de consola para capturar la salida
        console.log = (...args) => {
            setOutput(prevOutput => prevOutput + args.join(' ') + '\n');
            originalConsoleLog(...args);
        };
        console.error = (...args) => {
            setOutput(prevOutput => prevOutput + args.join(' ') + '\n');
            originalConsoleError(...args);
        };

        try {
            setOutput('');  // Limpiar la salida antes de ejecutar el código
            if (language === 'javascript') {
                eval(code);  // Ejecutar el código JavaScript
            } else {
                setOutput(`Execution for ${language} not implemented.`);
            }
        } catch (error) {
            setOutput(error.toString());
        }

        // Restaurar los métodos originales de la consola después de la ejecución
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <div className="w-screen flex justify-end">
            <div className="flex flex-col">
                <div className='flex justify-end mb-5 mr-5 gap-8 p-4  bg-slate-900 w-screen'>
                    <select value={language} onChange={handleLanguageChange} className=" font-bold p-2 outline-none border rounded-lg">
                        <option className="text-black font-bold" value='javascript'>JavaScript</option>
                        {/* <option className="text-black font-bold" value='python'>Python</option>
                        <option className="text-black font-bold" value='c'>C</option>
                        <option className="text-black font-bold" value='html'>HTML5 </option>
                        <option className="text-black font-bold" value='css'>CSS</option> */}
                    </select>
                    <button className='bg-green-500 p-2 font-bold rounded-lg text-white hover:bg-green-600' onClick={runCode}>
                        Run Code <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
                <div>
                    <Editor
                        height="70vh"
                        width="100vw"
                        language={language}
                        value={code}
                        onChange={handleEditorChange}
                        theme="dark"
                        editorDidMount={(editor) => (editorRef.current = editor)}
                    />
                </div>
                <div className="border max-w-[99vw] min-h-[19vh] min-w-[99vw] max-h-[19vh] absolute bottom-0 left-1 w-screen overflow-y-auto">
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
    );
}

export default IDE;
