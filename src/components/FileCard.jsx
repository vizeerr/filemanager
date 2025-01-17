import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Trash, Edit, Save, Eye, Download, Lock, Unlock } from 'lucide-react'

export function FileCard({ file, onDelete, onRename, onSetPassword, onVerifyPassword,onRemovePassword }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [action, setAction] = useState(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)


  const handleRename = () => {
    onRename(file.id, newName)
    setIsEditing(false)
  }

  const handleView = () => {
    if (file.isLocked) {
      promptForPassword(() => window.open(file.url, '_blank'))
    } else {
      window.open(file.url, '_blank')
    }
  }

  const handleDownload = () => {
    if (file.isLocked) {
      promptForPassword(() => {
        const link = document.createElement('a')
        link.href = file.url
        link.download = file.name
        link.click()
      })
    } else {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    }
  }

  const handleDelete = () => {
    if (file.isLocked) {
      promptForPassword(() => {
        setDeleteDialogOpen(true)
      })
    } else {
      setDeleteDialogOpen(true)
    }
  }

  const confirmDelete = async () => {
    try {
      await onDelete(file.id)
      setDeleteDialogOpen(false)
      alert('File deleted successfully!')
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete the file. Please try again.')
    }
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
  }

  const promptForPassword = (onSuccess) => {
    setAction(() => onSuccess)
    setPasswordDialogOpen(true)
  }

  const verifyPassword = async () => {
    const isValid = await onVerifyPassword(file.id, inputPassword)
    if (isValid) {
      setPasswordDialogOpen(false)
      setInputPassword('')
      if (action) action()
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  const handlePasswordSave = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    onSetPassword(file.id, password)
    setPassword('')
    setConfirmPassword('')
    setPasswordDialogOpen(false)
  }

  const handleRemovePassword = async () => {
    try {
      await onRemovePassword(file.id, null) // Set password to null in the Firestore database
      file.isLocked = false // Update local state
      setPasswordDialogOpen(false) // Close the dialog
    } catch (error) {
      console.error('Error removing password:', error)
      alert('Failed to remove password. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-sm">
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
          <span className="font-medium">Size:</span> {(file.size / 1024 / 1024).toFixed(2)} MB
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
          <span className="font-medium">Status:</span> {file.isLocked ? 'Locked' : 'Unlocked'}
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
          
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownload}
          className="flex items-center"
        >
          <Download className="w-4 h-4 mr-1" />
          
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center"
        >
          <Edit className="w-4 h-4 mr-1" />
          
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex items-center"
        >
          <Trash className="w-4 h-4 mr-1" />
          
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setPasswordDialogOpen(true)}
          className={`${file.isLocked? "bg-black text-white hover:text-black" : "text-black"} flex items-center`}
        >
          {file.isLocked ? (
            <Lock className="w-4 h-4 mr-1" />
          ) : (
            <Unlock className="w-4 h-4 mr-1" />
          )}
          {file.isLocked ? 'Locked' : 'Unlocked'}
        </Button>
      </CardFooter>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {file.isLocked ? 'Unlock File' : 'Set Password for File'}
            </DialogTitle>
          </DialogHeader>
          {file.isLocked ? (
            <Input
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-2"
            />
          ) : (
            <>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="mt-2"
              />
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="mt-2"
              />
            </>
          )}
          <DialogFooter>
            <Button
              variant="primary"
              onClick={file.isLocked ? verifyPassword : handlePasswordSave}
            >
              Save
            </Button>
            {file.isLocked && (
              <Button
                variant="destructive"
                onClick={handleRemovePassword}
                className="ml-2"
              >
                Remove Password
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to delete this file?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
