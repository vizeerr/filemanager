import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'

export async function GET() {
  try {
    const filesCollection = collection(db, 'files')
    const filesQuery = query(filesCollection, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(filesQuery)
    const files = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
    }))
    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, size, type, url } = await request.json()
    const filesCollection = collection(db, 'files')
    const docRef = await addDoc(filesCollection, {
      name,
      size,
      type,
      url,
      createdAt: new Date(),
    })
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error('Error saving file metadata:', error)
    return NextResponse.json({ error: 'Failed to save file metadata' }, { status: 500 })
  }
}

