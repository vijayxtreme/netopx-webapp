import React, { useState, useRef } from "react";

import Layout from "../Layout/Layout";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert, { AlertColor } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";

function Root() {
  const [textPreview, setTextPreview] = useState(``);
  const [itemMap, setItemMap] = useState<{ [key: string]: any } | undefined>(
    {}
  );
  const navigate = useNavigate();
  const [popOverSuccess, setPopoverSuccess] = useState<boolean>(false);
  const [popOverFail, setPopoverFail] = useState<boolean>(false);

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

  const updateJSON = (input: string) => {
    try {
      const json = JSON.parse(input);
      setItemMap({ ...itemMap, ...json });
    } catch (e) {
      //silently fail any json parse issues
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

  const renderAlert = (
    message: string,
    type: AlertColor,
    onClose: () => void
  ) => {
    return (
      <Alert severity={`${type}`} onClose={onClose}>
        <AlertTitle>{type}</AlertTitle>
        <strong>{message}</strong>
      </Alert>
    );
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
        navigate(`/download`);
      } else {
        setPopoverFail(true);
      }
    } else {
      setPopoverFail(true);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          marginTop: `2rem`,
          marginBottom: `2rem`,
        }}
      >
        {popOverSuccess &&
          renderAlert("Saved Successfully.", "success", () =>
            setPopoverSuccess(false)
          )}
        {popOverFail &&
          renderAlert("Failed to save", "error", () => setPopoverFail(false))}
      </Box>
      <Box
        sx={{
          backgroundColor: `#f3f5d0`,
          textAlign: `left`,
          padding: `1.5rem 0.5rem`,
        }}
      >
        <p>
          Welcome to the webapp. To get started, enter in some text with input
          variables in format of:
        </p>
        <pre>
          <code>%NAME%</code>.
        </pre>
        <p>
          Then enter in some JSON that has the variables in a key/value format
          which will be used to replace the text variables from before. You can
          see a live preview below. Feel free to edit as often as you need, then
          hit the Save button to be redirected to a new page that saves the text
          as a file and will be available for download.
        </p>
      </Box>
      <section>
        <Box
          sx={{
            marginTop: `2rem`,
            marginBottom: `2rem`,
          }}
        >
          <TextField
            inputProps={{ onChange: handlePreview }}
            placeholder={`Enter in some text with placeholders in format %NAME%.`}
            multiline
            fullWidth
            variant="filled"
          ></TextField>
          <TextField
            inputProps={{ ref: hashInput, onChange: updateHash }}
            placeholder={`Enter in some JSON to replace the placeholders above.`}
            multiline
            margin="dense"
            fullWidth
            variant="filled"
          ></TextField>
        </Box>
        <Box
          sx={{
            textAlign: `left`,
          }}
        >
          <h2>Preview</h2>
          <div ref={outputText}>
            {temp && temp !== "" ? temp : `Hello enter some text`}
          </div>
        </Box>
      </section>
      <section style={{ marginTop: `2rem` }}>
        <p>Save this text to file?{` `}</p>
        <form onSubmit={saveText}>
          <input ref={fileName} type="text" placeholder="Name for file" />
          <button type="submit">Save</button>
        </form>
      </section>
    </Layout>
  );
}

export default Root;
