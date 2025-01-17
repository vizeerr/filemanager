import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash, Edit, Save, Eye, Download } from 'lucide-react'

export function FileCard({ file, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(file.name)

  const handleRename = () => {
    onRename(file.id, newName)
    setIsEditing(false)
  }

  const handleView = () => {
    window.open(file.url, '_blank')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        {isEditing ? (
          <div className="flex space-x-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
              placeholder="Enter new name"
            />
            <Button size="sm" onClick={handleRename} variant="default">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        ) : (
          <CardTitle className="truncate">{file.name}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Extension:</span> {file.name.split('.').pop()}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Lifetime:</span>{' '}
          {file.lifetime === 'lifetime'
            ? 'Permanent'
            : file.lifetime === '1d'
            ? '1 Day'
            : file.lifetime === '1w'
            ? '1 Week'
            : file.lifetime === '1m'
            ? '1 Month'
            : 'Unknown'}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleView}
          className="flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownload}
          className="flex items-center"
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center"
        >
          <Edit className="w-4 h-4 mr-1" />
          Rename
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(file.id)}
          className="flex items-center"
        >
          <Trash className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
