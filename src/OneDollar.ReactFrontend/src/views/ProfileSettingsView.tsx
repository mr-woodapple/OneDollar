import { useEffect, useState } from "react";
import { toast } from "sonner";

import EditAccounts from "@/components/profile-settings/EditAccounts";
import EditCategories from "@/components/profile-settings/EditCategories";
import EditLunchFlowProvider from "@/components/profile-settings/EditLunchFlowProvider";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccounts } from "@/api/hooks/useAccounts";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/api/hooks/useProviders";

export default function ProfileSettingsView() {
  const { accounts } = useAccounts();
  const { lunchFlowConfig, triggerSync } = useProviders();

  const [defaultAccountId, setDefaultAccountId] = useState<string | undefined>();
  const [editCategoriesDrawerState, setEditCategoriesDrawerState] = useState(false)
  const [editAccountsDrawerState, setEditAccountsDrawerState] = useState(false)
  const [lunchFlowDrawerState, setLunchFlowDrawerState] = useState(false)

  useEffect(() => {
    const savedAccount = localStorage.getItem("defaultAccount");
    if (savedAccount) {
      setDefaultAccountId(savedAccount);
    }
  }, []);

  // Save the id of the selected account to local storage
  async function onDefaultAccountChange(id: number) {
    localStorage.setItem("defaultAccount", id.toString());
    setDefaultAccountId(id.toString());
    toast.success("Hooray, updated your default account!")
  }

  return (
    <div className="m-5">
      <div className="text-center">Profile Settings</div>

      {/* Managing categories and accounts */}
      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Categories & Accounts
      </div>
      <ItemGroup className="border border-neutral-200 rounded-lg">
        <Item className="cursor-pointer" onClick={() => setEditCategoriesDrawerState(true)}>
          <ItemContent>
            <ItemTitle>Categories</ItemTitle>
          </ItemContent>
        </Item>

        <ItemSeparator />

        <Item className="cursor-pointer">
          <ItemContent className="cursor-pointer" onClick={() => setEditAccountsDrawerState(true)}>
            <ItemTitle>Accounts</ItemTitle>
          </ItemContent>
        </Item>

        <ItemSeparator />

        <Item className="cursor-pointer">
          <ItemContent className="cursor-pointer">
            <ItemTitle>Standard Account</ItemTitle>
            <ItemDescription>The account that is selected by default on the transaction list.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              disabled={accounts.data?.length === 0}
              value={defaultAccountId}
              onValueChange={(val) => onDefaultAccountChange(Number(val))}>
              <SelectTrigger>
                {accounts?.data?.length === 0
                  ? <SelectValue placeholder="No account available!" />
                  : <SelectValue placeholder="Select account" />
                }

              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* TODO: Implement properly without the question mark syntax */}
                  {accounts?.data?.map((acc) => (
                    <SelectItem className="cursor-pointer"
                      value={acc.accountId!.toString()} key={acc.accountId}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>
      </ItemGroup>

      {/* Managing providers */}
      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Providers
      </div>
      <ItemGroup className="border border-neutral-200 rounded-lg">
        <Item className="cursor-pointer">
          <ItemContent>
            <ItemTitle>LunchFlow</ItemTitle>
            <ItemDescription className="flex items-center gap-2">
              { 
                lunchFlowConfig.data
                ? <><span className="w-2 h-2 bg-green-600 rounded-full"></span> Configured</>
                : <><span className="w-2 h-2 bg-neutral-400 rounded-full"></span> Not configured</>
              }
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" onClick={() => setLunchFlowDrawerState(true)}>Configure</Button>
          </ItemActions>

          { 
            lunchFlowConfig.data && 
            <ItemFooter>
              <div className="flex flex-row justify-between items-center w-full">
                <div>Last run: {lunchFlowConfig.data.lastRunTimestamp ? new Date(lunchFlowConfig.data.lastRunTimestamp).toLocaleString("en-GB") : "N/A"}</div>
                <Button variant={"ghost"} onClick={() => triggerSync.mutate()} disabled={triggerSync.isPending}>
                  {triggerSync.isPending ? "Syncing..." : "Sync now" }
                </Button>
              </div>
            </ItemFooter>
          }
        </Item>
      </ItemGroup>

      {/* General app information */}
      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        App Info
      </div>
      <ItemGroup className="border border-neutral-200 rounded-lg">
        <Item>
          <ItemContent>
            <ItemTitle>Version</ItemTitle>
          </ItemContent>
          <ItemActions className="text-neutral-700">{import.meta.env.VITE_APP_VERSION}</ItemActions>
        </Item>
      </ItemGroup>

      {/* Drawers */}
      <EditCategories isOpen={editCategoriesDrawerState} onOpenChange={setEditCategoriesDrawerState} />
      <EditAccounts isOpen={editAccountsDrawerState} onOpenChange={setEditAccountsDrawerState} />
      <EditLunchFlowProvider isOpen={lunchFlowDrawerState} onOpenChange={setLunchFlowDrawerState} />
    </div>
  )
}