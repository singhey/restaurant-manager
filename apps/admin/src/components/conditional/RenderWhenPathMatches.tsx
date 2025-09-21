import { useParams } from "@tanstack/react-router";



export function RenderWhenPathMatches({paramName, children}: {paramName: string, children: React.ReactNode}) {
  const location = useParams({strict: false})
  if(paramName in location) {
    return children
  }
  return null
}