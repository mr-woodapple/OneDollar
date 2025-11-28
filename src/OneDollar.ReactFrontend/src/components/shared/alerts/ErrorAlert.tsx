import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorAlertProps {
  error?: Error | null;
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>An error occured.</AlertTitle>

      {error && 
        <AlertDescription>Error: {error.message}</AlertDescription>
      }
    </Alert>
  )
}