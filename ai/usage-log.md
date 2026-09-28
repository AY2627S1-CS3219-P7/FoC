# AI Usage Log

## Frontend Implementation
Author: Brenda Tan Kai Xin
Tool: Cursor
Model: GPT-5.6 Sol Medium

## Supplier listing
Date: 2026-09-18
Time: 11:20 AM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue with only the next small frontend step.
> Do not change backend APIs, architecture, database schemas, authentication, routing, or authorization.
> Please:
> Remove the default Vite demo UI from App.tsx.
> Remove only the Vite-demo-specific CSS that is no longer needed.
> Create:
> src/pages/SupplierListPage.tsx
> Make App.tsx render SupplierListPage.
> Use Material UI.
> The page should currently contain only:
> heading: Suppliers
> search input with placeholder Search suppliers
> space for future Filter and Sort controls
> a clean content area for supplier results
> Make it responsive for mobile and desktop.
> Do NOT connect to any backend yet.
> Do NOT create mock API endpoints.
> Do NOT add authentication or routing yet.
> Keep the implementation simple because I am a beginner.
> Before editing, tell me exactly which files you plan to change/create. Then make the changes.
> Afterward, explain every changed file and the important React/MUI concepts used.

Key response:
Removed the Vite demo UI and created a beginner-friendly Material UI supplier list page with heading, search input, reserved filter/sort space, and a results area.

Files affected:
- frontend/src/App.tsx
- frontend/src/App.css
- frontend/src/index.css
- frontend/src/pages/SupplierListPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Supplier card
Date: 2026-09-18
Time: 11:57 AM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue locally with only the next small frontend step.
> Do not change backend APIs, architecture, database schemas, authentication, routing, or authorization.
> Please create:
> src/components/SupplierCard.tsx
> The component should display:
> supplier name
> supplier type
> location
> operating hours if available
> a View Details button
> Use React + TypeScript + Material UI.
> Then update src/pages/SupplierListPage.tsx to temporarily show exactly ONE sample supplier for UI development:
> Name: Cool Spot
> Type: Food
> Location: COM2
> Hours: Daily 7:30am - 7:30pm
> Keep the sample data local in the frontend only. Do not create mock APIs or backend logic.
> Make the card responsive on mobile and desktop.
> Keep the implementation simple for a React beginner.
> Before editing, tell me which files you will create/change.
> After editing, explain the important code.

Key response:
Created SupplierCard and rendered one local sample supplier on the list page.

Files affected:
- frontend/src/components/SupplierCard.tsx
- frontend/src/pages/SupplierListPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Search, filter, sort and pagination
Date: 2026-09-18
Time: 2:19 PM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue with only the next small frontend step: make the existing supplier search field functional using React local state.
> Requirements:
> Keep the existing three temporary suppliers.
> Use useState to store the search text.
> As the user types, filter the displayed suppliers.
> Search should match supplier name, type, or location.
> Search should be case-insensitive.
> If no suppliers match, display a simple No suppliers found message.
> Do not add backend calls, routing, pagination, filter dropdowns, sorting, authentication, or architecture changes.
> Keep the implementation simple for a React beginner.

Key response:
Implemented local case-insensitive search over name, type, and location, with a no-results message.

Follow-up prompts in the same conversation also requested:
> Continue with only the next small frontend step: add a supplier type filter to the existing SupplierListPage.tsx.
> Continue with only the next small frontend step: add supplier sorting to SupplierListPage.tsx.
> Continue with only the next small frontend step: add pagination to SupplierListPage.tsx.

Key response:
Added a type dropdown, name sorting, and two-items-per-page pagination that work together with search.

Files affected:
- frontend/src/pages/SupplierListPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Supplier details and CRUD UI
Date: 2026-09-18
Time: 2:48 PM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue with only the next small frontend step: add supplier detail navigation.
> Current frontend already has:
> supplier list
> search
> type filter
> sorting
> pagination
> SupplierCard
> React Router installed
> Requirements:
> Add React Router to the app.
> Keep the supplier list page available at /suppliers.
> Create src/pages/SupplierDetailPage.tsx.
> Add a route /suppliers/:supplierId.
> Make the View Details button in SupplierCard navigate to the corresponding supplier detail page.
> Pass/use the supplier ID for navigation.
> For now, the detail page may read from the existing temporary local supplier data.
> Show supplier name, type, location, and operating hours if available.
> Add a simple Back button to return to the supplier list.
> Keep the implementation simple and beginner-friendly.
> Do not add backend calls, create/edit/delete functionality, authentication, or architecture changes yet.

Key response:
Added React Router, supplier detail pages, and ID-based navigation from SupplierCard.

Follow-up prompts in the same conversation also requested Create, Edit, and Delete UI:
> Continue with only the next small frontend step: add a Create Supplier page.
> Continue with only the next small frontend step: add Edit Supplier functionality.
> Continue with only the next small frontend step: add Delete Supplier UI.

Key response:
Added create/edit forms and a delete confirmation dialog, with TODOs for later Supplier Service integration and no backend calls.

Files affected:
- frontend/src/App.tsx
- frontend/src/components/SupplierCard.tsx
- frontend/src/pages/SupplierListPage.tsx
- frontend/src/pages/SupplierDetailPage.tsx
- frontend/src/pages/CreateSupplierPage.tsx
- frontend/src/pages/EditSupplierPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Responsive navigation and Requester/Courier toggle
Date: 2026-09-18
Time: 6:22 PM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue with a UI/UX refinement step only.
> Do not change backend APIs, authentication, authorization, database schemas, service interfaces, or architecture.
> Please update the existing Supplier UI to better match our existing wireframe.
> Add:
> a responsive application navigation component
> on mobile, a bottom navigation containing:
> Home
> Suppliers
> My Requests
> Account
> visually indicate that Suppliers is the active section
> on desktop, adapt this navigation into an appropriate top navigation rather than keeping a mobile bottom bar
> add a location-pin icon beside each supplier location
> add a clock icon beside operating hours
> allow SupplierCard to show a supplier image or placeholder image
> Use Material UI and MUI icons if appropriate.
> Do NOT add an interactive map.
> Do NOT add map APIs or geolocation.
> Do NOT implement the other navigation pages yet; the navigation items may remain non-functional placeholders except Suppliers.

Key response:
Added responsive top/bottom navigation, location/clock icons, and supplier image placeholders.

Follow-up prompt:
> Continue with only the next UI/frontend step: add the existing Requester/Courier mode toggle from our wireframe to the responsive navigation.

Later follow-up:
> Please inspect AppNavigation.tsx only.
> The Requester/Courier toggle is visible, but clicking Requester or Courier currently produces no visible response.

Key response:
Added a Requester/Courier toggle with local state, then made the active option visually distinct.

Files affected:
- frontend/src/App.tsx
- frontend/src/components/AppNavigation.tsx
- frontend/src/components/SupplierInfo.tsx
- frontend/src/components/SupplierCard.tsx
- frontend/src/pages/SupplierDetailPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Admin-only controls
Date: 2026-09-19
Time: 3:40 PM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue with only the next frontend/UI step.
> Our existing requirements already specify:
> all users can view suppliers
> only Admin users can create, edit, or delete suppliers
> Update the existing Supplier UI so admin-only controls are conditionally displayed.
> Requirements:
> Add Supplier should only appear when the current user has Admin permission.
> Edit and Delete on Supplier Details should only appear for Admin.
> Normal Requester/Courier users should still be able to view suppliers, search, filter, sort, paginate, and view details.
> Do NOT add Admin to the Requester/Courier toggle.
> For now, use a clearly temporary frontend-only boolean/prop for previewing the two UI states.
> Add a TODO stating that this temporary value must later be replaced by the role information provided by the team’s User Service/auth integration.
> Do not create authentication logic, tokens, APIs, backend authorization, or new architecture.

Key response:
Hid Add/Edit/Delete behind a temporary `TEMPORARY_IS_ADMIN` preview flag passed as `isAdmin`.

Files affected:
- frontend/src/App.tsx
- frontend/src/pages/SupplierListPage.tsx
- frontend/src/pages/SupplierDetailPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Loading, error and success states
Date: 2026-09-19
Time: 3:58 PM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue with only the next frontend/UI step: add reusable UI states for the Supplier flow.
> Add frontend-only UI states for:
> loading suppliers
> no suppliers available
> no search/filter results
> generic supplier loading error
> success feedback after create/edit/delete actions
> Keep all of this frontend-only for now.
> Do not invent backend APIs.
> Do not implement fetching/authentication.

Key response:
Added reusable loading/empty/error UI and success snackbars for create/edit/delete preview actions.

Files affected:
- frontend/src/components/SupplierListStatus.tsx
- frontend/src/components/SuccessSnackbar.tsx
- frontend/src/pages/SupplierListPage.tsx
- frontend/src/pages/CreateSupplierPage.tsx
- frontend/src/pages/EditSupplierPage.tsx
- frontend/src/pages/SupplierDetailPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Login, Register and Account UI
Date: 2026-09-19
Time: 8:06 PM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Continue with only the next frontend/UI step: make the existing navigation items functional.
> Please add simple frontend routes and placeholder pages for:
> /home
> /requests
> /account

Follow-up prompt:
> Continue with only the next frontend/UI step: replace the Account placeholder with a basic Account/Profile page for D2.

Follow-up prompt:
> Continue with only the next frontend/UI step: create the Login page for the existing User Service flow.

Follow-up prompt:
> Continue with only the next frontend/UI step: create the Register page for the existing User Service flow.

Follow-up prompt:
> Continue with only the next frontend/UI step: add temporary login/logout navigation behaviour for UI development.

Follow-up prompt:
> Refine only the logout placement.
> Move the existing Logout action out of AccountPage.tsx and into the authenticated application navigation.

Key response:
Added Home/Requests/Account routes, a local profile page, login/register forms, public-page navigation hiding, and temporary login/logout navigation without tokens or sessions.

Files affected:
- frontend/src/App.tsx
- frontend/src/components/AppNavigation.tsx
- frontend/src/pages/HomePage.tsx
- frontend/src/pages/MyRequestsPage.tsx
- frontend/src/pages/AccountPage.tsx
- frontend/src/pages/LoginPage.tsx
- frontend/src/pages/RegisterPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## FoC polish
Date: 2026-09-25
Time: 9:35 AM SGT
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Perform a visual polish pass only. Do not change functionality, routing, APIs, state logic, authentication logic, schemas, or architecture.
> Keep the current Material UI structure but make the application feel like a cohesive branded campus errand platform rather than default MUI.
> Improve:
> consistent app branding and colour system
> page title/subtitle hierarchy
> supplier card visual hierarchy
> category chips
> card spacing, border radius and subtle elevation
> desktop use of available space
> mobile spacing
> Requester/Courier visual distinction
> navbar polish
> consistent button styles
> Preserve accessibility and responsive behaviour.

Follow-up prompt:
> Replace the current Home placeholder with a simple polished FoC dashboard.

Key response:
Added a FoC theme, polished navigation/cards, and replaced Home with a dashboard of quick-action cards.

Files affected:
- frontend/src/theme.ts
- frontend/src/App.tsx
- frontend/src/components/AppNavigation.tsx
- frontend/src/components/SupplierCard.tsx
- frontend/src/pages/SupplierListPage.tsx
- frontend/src/pages/SupplierDetailPage.tsx
- frontend/src/pages/LoginPage.tsx
- frontend/src/pages/RegisterPage.tsx
- frontend/src/pages/AccountPage.tsx
- frontend/src/pages/HomePage.tsx
- frontend/src/pages/MyRequestsPage.tsx
- frontend/src/pages/CreateSupplierPage.tsx
- frontend/src/pages/EditSupplierPage.tsx

Author review:
The output was reviewed and tested, and follow-up instructions were given where changes were needed.

## Interactive NUS campus map

Date: 2026-09-25
Time: 2.10 PM
Tool: Cursor
Model: GPT-5.6 Sol Medium

Exact prompt:
> Replace the current illustrated/static campus map with a real interactive NUS campus map.
> Use Leaflet.js with OpenStreetMap tiles. Do NOT use a static image or custom-drawn fake map.
> Requirements:
> - The map should show the real NUS Kent Ridge + UTown geography.
> - Users must be able to pan and zoom the map.
> - Use Leaflet.js and react-leaflet.
> - Use OpenStreetMap tiles.
> - Add markers for NUS locations such as COM2, PGP, UTown, PC Commons, Central Library and University Hall.
> - Store locations using latitude/longitude data.
> - Clicking a marker should open a popup.
> - Add a search box for NUS locations.
> - Keep the map responsive on desktop and mobile.
> - Do not hard-code marker positions using CSS percentages.

Key response:
Cursor replaced the previous static campus illustration with an interactive Leaflet map using OpenStreetMap tiles, added NUS location markers and search/reset controls, and simplified the map controls by removing the redundant Zoom out button.

Packages installed:
- leaflet
- react-leaflet
- @types/leaflet

Files affected:
- frontend/package.json
- frontend/package-lock.json
- frontend/src/components/CampusMap.tsx
- frontend/src/data/nusLocations.ts
- frontend/src/pages/HomePage.tsx

Author review:
The map was reviewed and tested locally. Follow-up instructions were used to simplify the controls and improve the UI.


## Development Guidance
Tool: ChatGPT
Model: GPT-5.6 Sol

Usage:
Learning support, code explanations and debugging guidance.
