"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { acceptInvitation, fetchWorkspaces } from "@/lib/store/slices/workspacesSlice"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid invitation link')
      return
    }

    const handleInvitation = async () => {
      try {
        await dispatch(acceptInvitation(token)).unwrap()
        setStatus('success')
        setMessage('Invitation accepted successfully!')
        toast.success('You have been added to the workspace')
        
        // Refresh workspaces to get the newly added workspace
        await dispatch(fetchWorkspaces()).unwrap()
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } catch (error: any) {
        setStatus('error')
        setMessage(error?.error || error?.message || 'Failed to accept invitation')
        toast.error('Failed to accept invitation')
      }
    }

    handleInvitation()
  }, [token, dispatch, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Workspace Invitation</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processing your invitation...'}
            {status === 'success' && 'Welcome to the workspace!'}
            {status === 'error' && 'Invitation Error'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Accepting invitation...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-sm text-green-600 font-medium">
                  {message}
                </p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <p className="text-sm text-red-600 font-medium">
                  {message}
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
