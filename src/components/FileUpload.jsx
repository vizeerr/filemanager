'use client'

import { useState, useRef } from 'react'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function FileUpload({ onUploadSuccess }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [applySameLifetime, setApplySameLifetime] = useState(false)
  const [makeGroup, setMakeGroup] = useState(false)
  const[folderName,setFolderName] = useState('')

  const [defaultLifetime, setDefaultLifetime] = useState('lifetime')
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const inputFileRef = useRef(null)

  const lifetimeOptions = [
    { value: '1d', label: '1 Day' },
    { value: '1w', label: '1 Week' },
    { value: '1m', label: '1 Month' },
    { value: '1hr', label: '1 Hour' },
    { value: '30min', label: '30 Minutes' },
    { value: 'lifetime', label: 'Lifetime (Permanent)' },
  ]

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    const newFiles = selectedFiles.map((file) => ({
      file,
      lifetime: applySameLifetime ? defaultLifetime : 'lifetime', // Set lifetime based on applySameLifetime
    }))
    setFiles((prev) => [...prev, ...newFiles])
    setUploadError(null)
    setUploadSuccess(false)
  }

  const handleLifetimeChange = (index, lifetime) => {
    setFiles((prev) => {
      const updated = [...prev]
      updated[index].lifetime = lifetime
      return updated
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError('Please select files to upload.')
      return

    }
    if (makeGroup && !folderName.trim()) {
      setUploadError('Please provide a valid folder name.');
      return;
    }

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)
    const newProgress = {}

    try {
      for (const [index, { file, lifetime }] of files.entries()) {
         const folderPath = 'uploads';
        const storageRef = ref(storage, `${folderPath}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            newProgress[index] = progress;
            setUploadProgress({ ...newProgress });
          },
          (error) => {
            console.error('Upload failed:', error);
            setUploadError(`Upload failed: ${error.message}`);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              // Save file metadata to Firestore
              await addDoc(collection(db, 'files'), {
                name: file.name,
                size: file.size,
                type: file.type,
                url: downloadURL,
                lifetime,
                folder: makeGroup ? folderName.trim() : null, // Save folder name
                createdAt: new Date(),
              });

              setUploadSuccess(true);
              onUploadSuccess();
            } catch (error) {
              console.error('Failed to save file metadata:', error);
              setUploadError(`Failed to save file metadata: ${error.message}`);
            }
          }
        )
      }
    } catch (error) {
      console.error('Error starting upload:', error)
      setUploadError(`Error starting upload: ${error.message}`)
    } finally {
      setUploading(false)
      setFiles([])
      if (inputFileRef.current) {
        inputFileRef.current.value = ''
      }
    }
  }

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Input
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
        ref={inputFileRef}
        className="h-12 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        aria-label="Choose files to upload"
      />
      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
            >
              <p className="text-sm truncate">{file.file.name}</p>
              {!applySameLifetime && (
                <select
                  value={file.lifetime}
                  onChange={(e) =>
                    handleLifetimeChange(index, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  {lifetimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                className="text-red-500"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}
      {files.length > 1 && (
        <>
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2"
              checked={applySameLifetime}
              onChange={(e) => {
                const isChecked = e.target.checked
                setApplySameLifetime(isChecked)
                // If the checkbox is checked, set all files' lifetime to defaultLifetime
                if (isChecked) {
                  setFiles((prevFiles) =>
                    prevFiles.map((file) => ({
                      ...file,
                      lifetime: defaultLifetime,
                    }))
                  )
                } else {
                  setFiles((prevFiles) =>
                    prevFiles.map((file) => ({
                      ...file,
                      lifetime: 'lifetime', // Reset to default lifetime if unchecking
                    }))
                  )
                }
              }}
            />
            Apply same lifetime to all files
          </label>
          {applySameLifetime && (
            <select
              value={defaultLifetime}
              onChange={(e) => {
                const newLifetime = e.target.value
                setDefaultLifetime(newLifetime)
                // Immediately update all files' lifetime when a new lifetime is selected
                setFiles((prevFiles) =>
                  prevFiles.map((file) => ({
                    ...file,
                    lifetime: newLifetime,
                  }))
                )
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {lifetimeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm w-full">
            <input
              type="checkbox"
              className="mr-2"
              checked={makeGroup}
              onChange={(e) => {
                const isChecked = e.target.checked
                setMakeGroup(isChecked)

              }}
            />
            Make Folder
          </label>
          {makeGroup &&(
            <Input
            placeholder="Enter Folder Name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            aria-label="Folder Name"
          />)}
        </div>
        </>
      )}
      <Button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
      {uploading &&
        Object.keys(uploadProgress).map((key) => (
          <Progress
            key={key}
            value={uploadProgress[key]}
            className="w-full my-2"
          />
        ))}
      {uploadError && (
        <div
          className="flex items-center space-x-2 text-red-500"
          role="alert"
        >
          <AlertCircle size={16} />
          <p className="text-sm">{uploadError}</p>
        </div>
      )}
      {uploadSuccess && (
        <div
          className="flex items-center space-x-2 text-green-500"
          role="status"
        >
          <CheckCircle2 size={16} />
          <p className="text-sm">Files uploaded successfully!</p>
        </div>
      )}
    </div>
  )
}
