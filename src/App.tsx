import React, { useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [textPreview, setTextPreview] = useState(``);
  const [itemMap, setItemMap] = useState<{ [key: string]: any } | undefined>(
    {}
  );
  const [page, updatePage] = useState<boolean>(false);
  const hashInput = useRef<HTMLTextAreaElement | null>(null);
  const fileName = useRef<HTMLInputElement | null>(null);
  const outputText = useRef<HTMLDivElement | null>(null);

  let temp = textPreview;

  for (let key in itemMap) {
    const patternKey = new RegExp("%" + key + "%");
    if (itemMap[key] !== "") {
      temp = temp.replace(patternKey, itemMap[key].toString());
    }
  }

  console.log(localStorage);

  const updateJSON = (input: string) => {
    try {
      const json = JSON.parse(input);
      setItemMap({ ...itemMap, ...json });
    } catch (e) {
      //silently fail any json parse issues
      //console.log(e);
    }
  };

  const handlePreview = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value;

    const pattern = /%.+?%/g;
    const found = text.match(pattern);
    const foundMatches = found?.map((item) => item.replace(/%/g, ""));

    setItemMap(
      foundMatches?.reduce((o, key) => Object.assign(o, { [key]: "" }), {})
    );
    if (hashInput.current?.value) {
      updateJSON(hashInput.current.value);
    }

    setTextPreview(text);
  };

  const updateHash = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value;
    updateJSON(text);
  };

  const saveText = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      fileName.current &&
      fileName.current.value &&
      fileName.current.value !== ""
    ) {
      const name = fileName.current.value;
      if (outputText.current && outputText.current.innerText !== ``) {
        const textToSave = {
          filename: name,
          text: outputText.current.innerText,
        };
        const savedTexts = localStorage.getItem("savedTexts");
        if (savedTexts) {
          const savedTextArr = JSON.parse(savedTexts);
          savedTextArr.push(textToSave);
          localStorage.setItem("savedTexts", JSON.stringify(savedTextArr));
        } else {
          localStorage.setItem("savedTexts", JSON.stringify([textToSave]));
        }
        updatePage(true);
      } else {
        alert(`Please enter some text`);
      }
    }
  };

  const downloadFile = (item: any) => {
    const file = new Blob([item.text], { type: "text/plain" });
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = item.filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const renderSavedTexts = () => {
    const savedTexts = localStorage.getItem("savedTexts");
    if (savedTexts) {
      const savedItemJSON = JSON.parse(savedTexts);
      const itemsToRender = savedItemJSON.map((item: any) => {
        console.log(item);
        return (
          <div key={item.filename}>
            <span>{item.filename}</span>
            {` `}
            <span>{item.text}</span>
            {` `}
            <button onClick={() => downloadFile(item)}>Download</button>
          </div>
        );
      });
      console.log(itemsToRender);

      return itemsToRender;
    }
    return <></>;
  };

  return (
    <div className="App">
      <h1>Web App</h1>
      <ul>
        <li>Home</li>
        <li>Download</li>
      </ul>
      <p>
        Welcome to the webapp. To get started, enter in some text with input
        variables in format of:
      </p>
      <pre>
        <code>%NAME%</code>
      </pre>
      .
      <p>
        Then enter in some JSON that has the variables in a key/value format
        which will be used to replace the text variables from before. You can
        see a live preview below. Feel free to edit as often as you need, then
        hit the Save button to be redirected to a new page that saves the text
        as a file and will be available for download.
      </p>
      <section>
        <textarea
          style={{ marginTop: `2rem` }}
          onChange={handlePreview}
          placeholder={`Enter in some text with placeholders in format %NAME%.`}
        ></textarea>
        <br />
        <textarea
          ref={hashInput}
          style={{ marginTop: `2rem`, width: `100%` }}
          onChange={updateHash}
          placeholder={`Enter in some JSON to replace the placeholders above.`}
        ></textarea>
        <div ref={outputText} style={{ marginTop: `2rem` }}>
          {temp && temp !== "" ? temp : `Hello enter some text`}
        </div>
      </section>
      <section style={{ marginTop: `2rem` }}>
        Save this text to file?{` `}
        <form onSubmit={saveText}>
          <input ref={fileName} type="text" placeholder="Name for file" />
          <button type="submit">Save</button>
        </form>
      </section>
      <section style={{ marginTop: `2rem` }}>{renderSavedTexts()}</section>
    </div>
  );
}

export default App;
