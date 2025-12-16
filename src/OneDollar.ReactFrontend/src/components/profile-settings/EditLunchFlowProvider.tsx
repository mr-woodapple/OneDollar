import { useEffect, useState } from "react"
import { X } from "lucide-react"

import { Button } from "../ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { useProviders } from "@/api/hooks/useProviders"

interface EditLunchFlowProviderProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditLunchFlowProvider({ isOpen, onOpenChange }: EditLunchFlowProviderProps) {
  const { lunchFlowConfig, saveLunchFlowConfig } = useProviders();
  
  const [apiKey, setApiKey] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("https://lunchflow.app/api/v1");

  useEffect(() => {
    if (lunchFlowConfig.data) {
      setApiKey(lunchFlowConfig.data.lunchFlowApiKey);
      setBaseUrl(lunchFlowConfig.data.lunchFlowApiUrl);
    }
  }, [lunchFlowConfig.data])

  const handleSave = () => {
    saveLunchFlowConfig.mutate({
      lunchFlowApiKey: apiKey,
      lunchFlowApiUrl: baseUrl
    }, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="apple-safe-area">
          <DrawerHeader>
            <div className="flex flex-row justify-between items-center">
              <DrawerTitle>Configure LunchFlow</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="px-5 space-y-5">
            <div className="space-y-2 text-sm bg-neutral-100 p-5 rounded">
              <h4 className="font-medium underline">Setup instructions:</h4>
              <ol className="list-decimal list-inside">
                <li>Visit <a href="https://www.lunchflow.app/">Lunch Flow</a> to get your API key</li>
                <li>Paste your API key below and click the "Save" button.</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey" type="password"
                placeholder="Required" value={apiKey}
                onChange={(e) => setApiKey(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl" value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)} />
            </div>
          </div>

          <DrawerFooter className="mt-5">
            <Button onClick={handleSave} disabled={saveLunchFlowConfig.isPending}>
              {saveLunchFlowConfig.isPending && <Spinner className="mr-2" />}
              {saveLunchFlowConfig.isPending ? "Saving" : "Save"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}