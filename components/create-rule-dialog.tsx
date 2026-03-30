"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { createRule } from "@/lib/store/slices/rulesSlice"
import { useState } from "react"

export function CreateRuleDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { activeWorkspaceId } = useAppSelector((state) => state.workspaces)
  const form = useForm({
    defaultValues: {
      name: "",
      matchPattern: "",
      methods: "ALL",
      type: "MODIFY_HEADERS",
      description: "",
    },
  })

  async function onSubmit(values: any) {
    if (!activeWorkspaceId) {
      console.error('No workspace selected')
      return
    }
    try {
      await dispatch(createRule({
        workspaceId: activeWorkspaceId,
        data: {
          name: values.name,
          description: values.description,
          type: values.type,
          matchType: "contains",
          matchPattern: values.matchPattern,
          methods: values.methods === "ALL" ? null : [values.methods],
          isActive: true,
          priority: 0,
        }
      })).unwrap()
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Failed to create rule:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Interception Rule</DialogTitle>
          <DialogDescription>Define how requests matching the pattern should be modified.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Internal API Mock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Rule description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matchPattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target URL Pattern</FormLabel>
                  <FormControl>
                    <Input placeholder="*/api/v1/users*" {...field} />
                  </FormControl>
                  <FormDescription>Supports wildcard (*) matching.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="methods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTTP Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">ALL</SelectItem>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MODIFY_HEADERS">Modify Headers</SelectItem>
                        <SelectItem value="REDIRECT">Redirect</SelectItem>
                        <SelectItem value="BLOCK">Block</SelectItem>
                        <SelectItem value="REPLACE_BODY">Replace Body</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save Rule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
