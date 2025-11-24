import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorAlertProps {
  errorMessage?: string;
}

export default function ErrorAlert({ errorMessage }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>An error occured.</AlertTitle>

      {errorMessage && 
        <AlertDescription>Error: {errorMessage}</AlertDescription>
      }
    </Alert>
  )
}