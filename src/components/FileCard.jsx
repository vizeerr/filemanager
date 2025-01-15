import { formatDistanceToNow } from 'date-fns'
import { Eye, Download, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function FileCard({ file, onDelete }) {
  const handleView = () => {
    window.open(file.url, '_blank')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async () => {
    try {
      await onDelete(file.id)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{file.name}</h3>
        <p className="text-sm text-gray-500 mb-1">Type: {file.type}</p>
        <p className="text-sm text-gray-500 mb-1">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <p className="text-sm text-gray-500">Uploaded: {formatDistanceToNow(file.createdAt.toDate(), { addSuffix: true })}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between">
        <Button variant="outline" size="sm" onClick={handleView}>
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

