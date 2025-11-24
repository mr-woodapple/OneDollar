import EditAccounts from "@/components/profile-settings/EditAccounts";
import EditCategories from "@/components/profile-settings/EditCategories";
import { Item, ItemContent, ItemGroup, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { useState } from "react";

export default function ProfileSettingsView() {
  const [editCategoriesDrawerState, setEditCategoriesDrawerState] = useState(false)
  const [editAccountsDrawerState, setEditAccountsDrawerState] = useState(false)

  return (
    <div className="m-5">
      <div className="text-center">Profile Settings</div>

      <div className="text-sm text-neutral-500 pb-2 ps-4 mt-5">
        Configuration
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
      </ItemGroup>

      {/* Drawers */}
      <EditCategories isOpen={editCategoriesDrawerState} onOpenChange={setEditCategoriesDrawerState} />
      <EditAccounts isOpen={editAccountsDrawerState} onOpenChange={setEditAccountsDrawerState} />
    </div>
  )
}