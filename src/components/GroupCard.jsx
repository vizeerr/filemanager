import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function GroupCard({ group, onSelect }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Total files: {group.files.length}</p>
        <Button onClick={() => onSelect(group)} className="w-full">View Files</Button>
      </CardContent>
    </Card>
  )
}

