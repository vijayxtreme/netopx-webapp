export const downloadFile = (item: any) => {
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

export const renderSavedTexts = () => {
  const savedTexts = localStorage.getItem("savedTexts");
  if (savedTexts) {
    const savedItemJSON = JSON.parse(savedTexts);
    const itemsToRender = savedItemJSON.map((item: any) => {
      return (
        <li key={item.filename}>
          <span style={{ fontWeight: `600` }}>{item.filename}</span>
          {` `}
          <span>{item.text}</span>
          {` `}
          <button onClick={() => downloadFile(item)}>Download</button>
        </li>
      );
    });
    return itemsToRender;
  }
  return <></>;
};
