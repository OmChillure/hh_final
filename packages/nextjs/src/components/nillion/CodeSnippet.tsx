import React, { useEffect, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark as style } from "react-syntax-highlighter/dist/esm/styles/prism";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";

SyntaxHighlighter.registerLanguage("python", python);

const CodeSnippet: React.FC<{ program_name: string }> = ({ program_name }) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    // Fetch the code from the file in the public folder
    fetch(`/programs/${program_name}.py`)
      .then(response => response.text())
      .then(setCode)
      .catch(console.error);
  }, [program_name]);

  return (
    <SyntaxHighlighter language="python" style={style}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeSnippet;
