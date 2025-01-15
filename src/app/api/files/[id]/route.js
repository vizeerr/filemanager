import { NextResponse } from 'next/server'
import { db, storage } from '@/lib/firebase'
import { doc, deleteDoc, getDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const fileRef = doc(db, 'files', id)
    const fileSnapshot = await getDoc(fileRef)

    if (!fileSnapshot.exists()) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileData = fileSnapshot.data()
    const storageRef = ref(storage, fileData.url)

    await deleteObject(storageRef)
    await deleteDoc(fileRef)

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

