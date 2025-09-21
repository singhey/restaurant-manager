import { createAuthClient } from "better-auth/react"
import { organizationClient, inferOrgAdditionalFields } from 'better-auth/client/plugins'


export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
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