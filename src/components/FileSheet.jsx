import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { FileCard } from "./FileCard"

export function FileSheet({ group, isOpen, onClose, onDelete, onRename }) {
  if (!group) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{group.name}</SheetTitle>
          <SheetDescription>Files in this group</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {group.files.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

