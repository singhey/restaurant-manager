import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import { authClient } from './auth'
import { Link, useRouter } from '@tanstack/react-router'
import type React from 'react'


const ModifiedLink = ({href, children}: {href: string, children: React.ReactNode}): React.ReactNode =>  {
  return <Link to={href}>
    {children}
  </Link>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={href => router.navigate({to: href})}
      replace={to => router.navigate({replace: true, to})}
      onSessionChange={() => window.location.reload()}
      Link={ModifiedLink}
    >
      {children}
    </AuthUIProvider>
  )
}