import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemActions } from "../ui/item"

import { TransactionData } from "@/content/TransactionData"

// TODO: Group entries after dates, bind them visually together
export default function TransactionList() {
  

  return(
    <ItemGroup className="space-y-2">
      {TransactionData.map((tr) => (
        <Item key={tr.id} variant="outline" size="sm" >
          <ItemMedia>
            {tr.category.icon}
          </ItemMedia>

          <ItemContent>
            <ItemTitle>{tr.category.name}</ItemTitle>
          </ItemContent>

          <ItemActions>
            {tr.amount.toString().replace(".", ",")} €
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}