"use client"
import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQpv-U7zjVgPTbfK7RMHg05eWkICPg4aA",
    authDomain: "monkhood-55245.firebaseapp.com",
    databaseURL: "https://monkhood-55245-default-rtdb.firebaseio.com",
    projectId: "monkhood-55245",
    storageBucket: "monkhood-55245.appspot.com",
    messagingSenderId: "567445925428",
    appId: "1:567445925428:web:afde7efc78f65b381ca461"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
  
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        alert("Failed to upload file.");
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
  
        // Save metadata to Firestore
        const docRef = collection(db, "images");
        await addDoc(docRef, { name: file.name, url });
        alert("File uploaded successfully!");
      }
    );
  };
  
  return (
    <div>
      <h1>Firebase File Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadProgress > 0 && (
        <p>Upload Progress: {Math.round(uploadProgress)}%</p>
      )}

      {downloadURL && (
        <div>
          <h3>Uploaded File:</h3>
          {file?.type.startsWith("image/") ? (
            <img
              src={downloadURL}
              alt="Uploaded File"
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          ) : (
            <p>
              <strong>{fileName}</strong>:{" "}
              <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                View/Download File
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
