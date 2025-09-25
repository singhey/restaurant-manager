import { createCallable } from 'react-call'
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction} from '@workspace/ui/components/alert-dialog'

interface Props { title: string, description: string, cancelText?: string, acceptText?: string }
type Response = boolean

export const Confirm = createCallable<Props, Response>(({ call, title, description, cancelText = "Cancel", acceptText = "Yes" }) =>  {
  return <AlertDialog open={!call.ended}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{title}</AlertDialogTitle>
      <AlertDialogDescription>{description}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => {call.end(false);}}>{cancelText}</AlertDialogCancel>
      <AlertDialogAction onClick={() => {call.end(true);}}>{acceptText}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
}, 500)