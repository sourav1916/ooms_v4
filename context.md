## Project Context Update (Ledger + Finance UI)

### Files Updated
- `src/components/payment-send.js`
- `src/components/payment-received.js`
- `src/ClientComponents/LedgerTab.js`
- `src/components/header.js`

### Payment Modal Improvements
- Increased modal size and spacing for both payment modals.
- Upgraded visual design (gradient headers, cleaner content spacing, improved footer styling).
- Improved bank selector styling and UX.
- Added bank details card below bank selector when a bank is selected:
  - Bank name
  - Account number
  - Account holder
  - Balance

### Ledger API Response Support (New Structure)
- Updated ledger rendering to support:
  - `opening_balance` object: `{ debit, credit, balance }`
  - type-specific transaction node (e.g. `payment.debit`, `payment.credit`, `payment.balance`)
  - `transaction_type` display from API
  - `particular` object and nested `details`
- Summary calculations now use debit/credit/balance from transaction type object.
- Opening balance row now always shows debit/credit/balance values (including `0`).
- Transaction debit/credit columns now show `₹0.00` instead of `-` when value is zero.
- Removed previous balance text from balance column.

### Ledger Particulars Enhancements
- Added support for `particular.remark`.
- In table particulars column:
  - Remark shown under particulars with text ellipsis + tooltip.
- If transaction has no `particular`:
  - Show formatted `transaction_type`
  - Show remark underneath if available.
- In details modal:
  - Added remark section inside particulars block (bank and non-bank details).

### Ledger Transaction Details Modal
- Added `Details` action in row action menu.
- Added full transaction details modal with:
  - Transaction info (date, voucher, type, ID)
  - Amount cards (debit/credit/balance)
  - Dynamic particulars rendering for different transaction types
  - Created by / modified by sections
  - Timestamps

### Pagination + Limit
- Fixed pagination behavior where next page was not advancing reliably.
- Pagination now uses API `meta` values correctly.
- Added page jump input (`Go to` page).
- Added page size selector at bottom with options:
  - `5, 10, 20, 50, 100`
- Default page size remains `20`.

### Date Range UX Upgrade
- Reworked date range picker into a more professional UI:
  - Card-style trigger
  - Quick filters
  - Inline 2-month range calendar
  - Improved range/day styles
  - Apply action and clear behavior

### Opening Balance Set/Edit (Ledger)
- Added opening balance icon before date range.
- Added opening balance modal:
  - If opening balance exists -> edit form
  - If not set -> create form
- Integrated APIs:
  - `GET /transaction/get-opening-balance`
  - `POST /transaction/set-opening-balance`
- Form fields:
  - Amount
  - Type (`credit` / `debit`)
  - Transaction date
  - Remark
- On successful save:
  - Shows success message
  - Closes modal
  - Refreshes ledger transactions

### Sidebar Link UX
- Removed default link underline on hover for sidebar navigation links (`header.js`).
