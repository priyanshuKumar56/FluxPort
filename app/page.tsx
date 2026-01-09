"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"

export default function IndexPage() {
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }, [user, router])

  return null
}
