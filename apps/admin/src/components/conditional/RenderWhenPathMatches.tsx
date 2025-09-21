import { useLocation, useParams } from "@tanstack/react-router";



export function RenderWhenPathMatches({paramName, children, fallback, pathname}: {pathname?: string[], paramName?: string, children: React.ReactNode, fallback?: React.ReactNode}) {
  const params = useParams({strict: false})
  const location = useLocation()
  if(paramName && paramName in params) {
    return children
  }

  if(pathname && pathname.find(path => path === location.pathname)) {
    return children
  }

  return fallback || null
}