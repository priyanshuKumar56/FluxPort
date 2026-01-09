"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { useAppDispatch } from "@/lib/store/hooks"
import { updateRule } from "@/lib/store/slices/rulesSlice"

export function RulesTable({ rules }: { rules: any[] }) {
  const dispatch = useAppDispatch()

  const toggleRule = async (id: string, currentStatus: boolean) => {
    try {
      await dispatch(updateRule({ id, data: { isActive: !currentStatus } })).unwrap()
    } catch (error) {
      console.error('Failed to update rule:', error)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Rule Name</TableHead>
          <TableHead>Target Pattern</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              No rules found. Create your first rule to get started.
            </TableCell>
          </TableRow>
        ) : (
          rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{rule.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{rule.description}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs">{rule.matchPattern}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {rule.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{rule.methods?.join(', ') || 'ALL'}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id, rule.isActive)} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
