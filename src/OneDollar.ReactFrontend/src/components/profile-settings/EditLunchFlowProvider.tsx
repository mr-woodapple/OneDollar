import { useEffect, useState } from "react"

import { Button } from "../ui/button"
import { Drawer, DrawerContent, DrawerHeading } from "../shared/GenericDrawer"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { useProviders } from "@/api/hooks/useProviders"

interface EditLunchFlowProviderProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditLunchFlowProvider({ isOpen, onOpenChange }: EditLunchFlowProviderProps) {
  const { lunchFlowConfig, saveLunchFlowConfig, deleteLunchFlowConfig } = useProviders();

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

  const handleDelete = () => {
    if (!lunchFlowConfig.data?.providerId) { return }

    deleteLunchFlowConfig.mutate(
      lunchFlowConfig.data?.providerId, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  }

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeading>
            <h2 className="font-semibold">Configure LunchFlow</h2>
          </DrawerHeading>
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
                id="baseUrl" value={baseUrl} disabled
                onChange={(e) => setBaseUrl(e.target.value)} />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 p-4">
            <Button onClick={handleSave} disabled={saveLunchFlowConfig.isPending}>
              {saveLunchFlowConfig.isPending && <Spinner className="mr-2" />}
              {saveLunchFlowConfig.isPending ? "Saving" : "Save"}
            </Button>
            {
              lunchFlowConfig.data &&
              <Button variant="outline" onClick={handleDelete} disabled={deleteLunchFlowConfig.isPending}>
                {deleteLunchFlowConfig.isPending && <Spinner className="mr-2" />}
                {deleteLunchFlowConfig.isPending ? "Deleting config..." : "Delete config"}
              </Button>
            }
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}