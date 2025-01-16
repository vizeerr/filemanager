import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const { name } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }

    const fileRef = doc(db, 'files', id)
    await updateDoc(fileRef, { name })

    return NextResponse.json({ message: 'File renamed successfully' })
  } catch (error) {
    console.error('Error renaming file:', error)
    return NextResponse.json({ error: 'Failed to rename file' }, { status: 500 })
  }
}
