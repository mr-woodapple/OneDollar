
# TODO List:

A list so I don't forget what needs to be done:

- [x] Unify the drawer for "Select Category" (from one for selecting and one for editing the categories)
- [ ] Unify the drawer for "Select Account" (from one for selecting and one for editing the categories)
- [ ] Implement editing categories in `profileSettings/EditCategories.tsx`
- [ ] Implement editing accounts in `profileSettings/EditAccounts.tsx`
- [x] Make the account switcher work in `views/HomeView.tsx`  
- [ ] Implement skeleton loading states for the transaction list, categories and accounts
- [x] Create favicon
- [ ] Fix dates close to midnight not beeing on the correct date (probably use `DateTimeOffset` on the backend??)
- [x] Prevent deleting accounts / categories, that are linked in an transaction (as that is deleting the transactions as well!)
- [x] Implement adding / subtracting from the accounts balance (-> ideally find a way to manage the hook states globally on the FE)
- [x] Fix sorting on the transaction view
- [ ] Implement generic bottom drawer that handles the `apple-safe-area` css tag
- [ ] Unify the wrapper element for stats
- [ ] Make a smart categorizing system (like if something had category x before, assign that again)


## PWA

- [ ] Figure out what needs to be done for this to be a PWA