import React, { useState } from "react";

const IpfsUpload = () => {
  const [file, setFile] = useState(null);
  const [hashValue, setHashValue] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://34.205.55.64:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      const hash = data?.cid["/"];
      setHashValue(hash);

      // Open the iframe with the IPFS link
      const iframeUrl = `http://34.205.55.64:8080/ipfs/${hash}`;
      window.open(iframeUrl, "_blank");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Ipfs Test Setup</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {hashValue && (
        <div>
          <p>Hash Value: {hashValue}</p>
          <iframe
            src={`http://34.205.55.64:8080/ipfs/${hashValue}`}
            width="100%"
            height="400px"
          />
        </div>
      )}
    </div>
  );
};

export default IpfsUpload;
