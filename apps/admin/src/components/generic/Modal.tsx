import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { createCallable } from "react-call"

type Props = {
  title: string,
  description: string,
  dialogContent: React.ReactNode
}

type Response = boolean

export const Modal = createCallable<Props, Response>(({call, title, description, dialogContent}) => {
  return <Dialog open={!call.ended} onOpenChange={() => call.end(false)}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        {title && <DialogTitle>
          {title}
        </DialogTitle>}
        {description && <DialogDescription>
          {description}
        </DialogDescription>}
      </DialogHeader>
      <div>
        {dialogContent}
      </div>
    </DialogContent>
  </Dialog>
})