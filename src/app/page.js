'use client'

import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import { FileUpload } from '@/components/FileUpload'
import { FileCard } from '@/components/FileCard'

export default function Home() {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'files'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const filesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setFiles(filesData)
        setError(null)
      },
      (err) => {
        console.error("Error fetching files:", err)
        setError(`Error fetching files: ${err.message}. Code: ${err.code}`)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleDelete = async (fileId) => {
    try {
      const fileDoc = doc(db, 'files', fileId)
      const fileData = files.find(file => file.id === fileId)
      
      if (fileData) {
        const storageRef = ref(storage, fileData.url)
        await deleteObject(storageRef)
      }
      
      await deleteDoc(fileDoc)
    } catch (error) {
      console.error('Error deleting file:', error)
      setError(`Error deleting file: ${error.message}. Code: ${error.code}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Management</h1>
      <FileUpload onUploadSuccess={() => setError(null)} />
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {files.map(file => (
          <FileCard key={file.id} file={file} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

