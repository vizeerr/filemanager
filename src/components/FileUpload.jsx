'use client'

import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const inputFileRef = useRef(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadError(null)
      setUploadSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file first')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const storageRef = ref(storage, `uploads/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        (error) => {
          console.error('Upload failed:', error)
          setUploadError(`Upload failed: ${error.message}`)
          setUploading(false)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            const docRef = await addDoc(collection(db, 'files'), {
              name: file.name,
              size: file.size,
              type: file.type,
              url: downloadURL,
              createdAt: new Date()
            })

            setUploadSuccess(true)
            onUploadSuccess()
          } catch (error) {
            console.error('Failed to save file metadata:', error)
            setUploadError(`Failed to save file metadata: ${error.message}`)
          }
        }
      )
    } catch (error) {
      console.error('Error starting upload:', error)
      setUploadError(`Error starting upload: ${error.message}`)
    } finally {
      setUploading(false)
      setFile(null)
      if (inputFileRef.current) {
        inputFileRef.current.value = ''
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        ref={inputFileRef}
        className="h-12 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        aria-label="Choose file to upload"
      />
      {file && (
        <p className="text-sm text-gray-500">Selected file: {file.name}</p>
      )}
      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
      {uploading && (
        <Progress value={uploadProgress} className="w-full" aria-label={`Upload progress: ${Math.round(uploadProgress)}%`} />
      )}
      {uploadError && (
        <div className="flex items-center space-x-2 text-red-500" role="alert">
          <AlertCircle size={16} />
          <p className="text-sm">{uploadError}</p>
        </div>
      )}
      {uploadSuccess && (
        <div className="flex items-center space-x-2 text-green-500" role="status">
          <CheckCircle2 size={16} />
          <p className="text-sm">File uploaded successfully!</p>
        </div>
      )}
    </div>
  )
}

