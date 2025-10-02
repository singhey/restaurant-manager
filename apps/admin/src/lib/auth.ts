import { createAuthClient } from "better-auth/react"
import { organizationClient, inferOrgAdditionalFields } from 'better-auth/client/plugins'


export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  plugins: [
    organizationClient({
      schema: inferOrgAdditionalFields({
        organization: {
          additionalFields: {
            address: {
              type: "string", 
            }, 
          },
        }
      })
    }),
      
  ]
})