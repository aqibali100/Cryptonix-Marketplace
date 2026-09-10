# Cryptonix Marketplace — Frontend

Cryptonix is a digital-asset discovery and NFT marketplace frontend with collector accounts, a Creator Studio, and an administration workspace. It combines cryptocurrency market data, NFT browsing, wallet-based sign-in, and a testnet NFT minting flow.

This is an implementation handover for the code in `frontend/`, audited on **10 September 2026**. The application is **partially implemented**: several screens use the backend, while other marketplace and management screens remain demonstrations. A rendered button or navigation entry does not necessarily represent a completed business operation.

## Contents

- [Implementation status](#implementation-status)
- [Routes and access](#routes-and-access)
- [Architecture and API integration](#architecture-and-api-integration)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Setup and configuration](#setup-and-configuration)
- [Development workflow](#development-workflow)
- [Build and deployment](#build-and-deployment)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Developer handover notes](#developer-handover-notes)

## Implementation status

“Implemented” below means that the frontend contains the relevant rendering, state, validation, and integration code. It does **not** mean that a live backend, wallet transaction, or production deployment was verified during this documentation audit.

### Implemented frontend features

| Area                     | Current functionality                                                                                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application shell        | Responsive dark interface, public navigation/footer, breadcrumbs, separate creator/admin shells, metadata, custom not-found screen, and loading skeletons.                                                                                |
| Token discovery          | Backend-powered trending tokens, searchable/paginated token directory, and token details with price, market metrics, links, and SVG charts derived from returned sparkline data.                                                          |
| NFT discovery            | Backend-powered marketplace with search, filters, sorting, pagination and layout controls; trending NFTs; detail pages with media, traits, creator information and contract/explorer links.                                               |
| Global search            | Debounced API search across NFTs, collections, creators and tokens, with grouped results and loading/error states.                                                                                                                        |
| Wallet connection        | MetaMask-oriented injected-wallet connection/disconnection, active wallet display, native balance, address copying and network switching.                                                                                                 |
| User authentication      | Sign-In with Ethereum (SIWE), session restoration, logout, username registration/update, and role/permission-aware UI.                                                                                                                    |
| Collector account        | Favorites persisted through the API, favorites directory and dashboard preview, plus editing the signed-in user's profile and profile image.                                                                                              |
| Creator application      | Validated application submission and retrieval of application/review status.                                                                                                                                                              |
| Creator profile          | API-backed profile editing through `CreatorProfileModal`, opened from the creator shell.                                                                                                                                                  |
| NFT creation             | Three-step validated upload/details/mint form, image/audio/video preview, ERC-721 or ERC-1155 selection, traits, royalties, sale metadata, unlockable content input, wallet transaction submission and backend confirmation.              |
| Creator NFT management   | API-backed NFT list, filtering/pagination, detail/edit UI, archive/restore/delete actions and mint retry. Backend rules determine which actions are allowed for each NFT state.                                                           |
| Creator collections      | API-backed collection list and collection creation, including banner upload and metadata submission.                                                                                                                                      |
| Admin authentication     | Email/password login, six-digit MFA enrollment/verification, QR setup, recovery-code display, session checks and logout.                                                                                                                  |
| Admin users and creators | API-backed tables and filters; user details, linked-wallet and NFT inspection; account-status actions; user CSV/JSON export. Creator listing is connected, but a dedicated creator-application approval workflow is not implemented here. |

### Pending or demonstration functionality

| Area                                | Remaining work                                                                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFT purchases and bidding           | `Buy now` and `Place bid` in `NftDetail.tsx` have no purchase/bid handlers. Sale settings submitted during minting do not establish a complete trading flow.              |
| Creator business operations         | Overview metrics/activity, listings, auctions, offers, sales, earnings and royalties use hardcoded data or presentation-only controls.                                    |
| Creator wallet/settings sections    | `/creator/wallets` and `/creator/settings` are sample screens. They are distinct from the active public wallet component and API-backed creator profile modal.            |
| Admin modules beyond users/creators | Overview and the remaining modules render hardcoded configuration, metrics and tables. Their visible actions should not be treated as persistent administration features. |
| Public collections                  | Homepage collections are hardcoded. There is no dedicated public collection detail route.                                                                                 |
| Legacy creation page                | `/create` is a permission-guarded static form with no submission handler. The active minting implementation is `/creator/create`.                                         |
| Marketing/support links             | Several social, footer and legal links use `#`; corresponding destinations/content still need implementation.                                                             |
| Automated testing and delivery      | No frontend test suite, test script, CI workflow, Dockerfile or deployment manifest is supplied in this folder.                                                           |

## Routes and access

Next.js route groups such as `(user)` organize files but do not appear in URLs. Most API data is fetched in client components.

| URL                                                                               | Implementation and access                                                                                                   |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                                               | Public landing page: hero, trending tokens, sample collections and trending NFTs.                                           |
| `/marketplace`                                                                    | Public NFT directory.                                                                                                       |
| `/tokens`                                                                         | Public token directory.                                                                                                     |
| `/token/[id]`                                                                     | Public token details using the backend token ID.                                                                            |
| `/nft/[id]`                                                                       | Public NFT details using the backend NFT record ID.                                                                         |
| `/favorites`                                                                      | Signed-in favorites view; component handles authentication state.                                                           |
| `/dashboard`                                                                      | `DashboardGuard`: requires an authenticated `user` role and `dashboard:view`; creators cannot use this collector dashboard. |
| `/profile/[username]`                                                             | Signed-in user's own profile editor. The username is used for route consistency, not to fetch arbitrary public profiles.    |
| `/linked-wallets`                                                                 | Current wallet connection/balance/network UI.                                                                               |
| `/become-creator`                                                                 | Creator application and status screen with authentication handling.                                                         |
| `/create`                                                                         | Static legacy form guarded by `nft:create`.                                                                                 |
| `/creator`                                                                        | Creator overview demonstration; requires an approved creator account.                                                       |
| `/creator/create`                                                                 | Active testnet minting flow.                                                                                                |
| `/creator/nfts`                                                                   | API-backed creator NFT management.                                                                                          |
| `/creator/collections`                                                            | API-backed collection listing/creation.                                                                                     |
| `/creator/listings`, `/creator/auctions`, `/creator/offers`, `/creator/sales`     | Sample operational tables.                                                                                                  |
| `/creator/earnings`, `/creator/royalties`                                         | Sample financial screens.                                                                                                   |
| `/creator/wallets`, `/creator/settings`                                           | Sample wallet/profile settings screens.                                                                                     |
| `/admin/login`                                                                    | Admin password/MFA flow, separate from wallet sign-in.                                                                      |
| `/admin`                                                                          | Guarded admin overview with sample metrics.                                                                                 |
| `/admin/users`, `/admin/creators`                                                 | Connected management screens.                                                                                               |
| `/admin/nfts`, `/admin/collections`, `/admin/listings`                            | Sample asset-management modules.                                                                                            |
| `/admin/transactions`, `/admin/moderation`, `/admin/ipfs`, `/admin/notifications` | Sample operations modules.                                                                                                  |
| `/admin/revenue`, `/admin/royalties`, `/admin/settlements`                        | Sample finance modules.                                                                                                     |
| `/admin/networks`, `/admin/admins`, `/admin/audit`, `/admin/settings`             | Sample system modules.                                                                                                      |

Creator/admin dynamic sections are validated against their navigation registries; unknown sections call `notFound()`. Both registries also include `overview`, so `/creator/overview` and `/admin/overview` resolve. Unauthenticated creator access calls `notFound()` after session loading; unapproved accounts receive an application/access message. Unauthorized admin access redirects to `/404`, which falls through to the not-found UI because there is no explicit `/404` page.

These guards are client-side presentation controls. The backend must continue enforcing authentication, ownership and permissions on every protected operation.

## Architecture and API integration

```text
Browser / Next.js UI
  ├─ Wagmi + Viem → injected wallet and chain RPCs
  ├─ REST requests → backend /api/*
  ├─ GraphQL requests → backend /graphql
  └─ Admin GraphQL → backend /api/admin/auth

Backend (../backend)
  ├─ PostgreSQL, users, sessions and application data
  ├─ CoinGecko market data
  ├─ IPFS/Pinata uploads and media delivery
  └─ Contract configuration and mint verification (../contracts)
```

There are no frontend API route handlers or Server Actions implementing these business operations. The backend and contracts are separate sibling projects with independent dependencies and configuration.

### Providers and shared clients

`app/layout.tsx` loads global styles, Geist fonts and site metadata. `app/providers.tsx` nests `WagmiProvider`, `QueryClientProvider` and `AuthProvider`. `AppChrome` chooses whether to show public navigation or leave navigation to the creator/admin workspace.

- `app/lib/api.ts` defines `API_URL`, `apiRequest()` and `graphQLRequest()`.
- Requests include cookies via `credentials: "include"`. JSON headers are added automatically, except for `FormData`, where the browser must generate the multipart boundary.
- REST errors use the response's `message`/`error`; the GraphQL helper checks top-level GraphQL errors and requires `data`.
- `app/lib/admin-auth.ts` uses a separate GraphQL endpoint and returns the first operation payload. Callers inspect its `success`, `code`, `message` and validation errors.
- React Query is used for several directories and favorites; other screens use `useEffect` and local state. There is no single generated API client or global data model.

### Endpoint map used by the frontend

All paths below are relative to `API_URL`.

| Endpoint                                                          | Use                                                                                                                                          |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/auth/me`, `GET /api/auth/nonce`                         | Session restoration and SIWE challenge.                                                                                                      |
| `POST /api/auth/verify`, `/api/auth/logout`, `/api/auth/username` | Signature verification, logout and username updates.                                                                                         |
| `GET/PATCH /api/user/profile`                                     | Own profile read/update.                                                                                                                     |
| `GET/POST /api/creator/application`                               | Creator application status/submission.                                                                                                       |
| `GET/PATCH /api/auth/creator/profile`                             | Creator profile modal.                                                                                                                       |
| `GET /api/tokens`, `GET /api/tokens/:id`                          | Trending/all token data, search/pagination and details.                                                                                      |
| `GET /api/search?q=...`                                           | Global search.                                                                                                                               |
| `GET /api/nfts`                                                   | Public marketplace query/filter results.                                                                                                     |
| `GET /api/nfts/mine`                                              | Creator NFT inventory.                                                                                                                       |
| `POST /api/nfts`                                                  | Multipart upload and mint preparation.                                                                                                       |
| `GET/PATCH/DELETE /api/nfts/:id`                                  | Creator record read/edit/delete.                                                                                                             |
| `POST /api/nfts/:id/archive`, `/restore`, `/retry`, `/confirm`    | NFT lifecycle and mint recovery/confirmation.                                                                                                |
| `POST/DELETE /api/nfts/:id/favorite`, `GET /api/user/favorites`   | Favorite toggling and listing.                                                                                                               |
| `/api/nfts/:id/media`                                             | Backend NFT media URL/fallback.                                                                                                              |
| `POST /api/collections/banner`                                    | Collection banner upload.                                                                                                                    |
| `POST /graphql`                                                   | `homeTrendingNfts`, `nftDetail`, `myCollections`, `createCollection`.                                                                        |
| `POST /api/admin/auth`                                            | Admin authentication/MFA/session operations, users/creators queries, account-status updates, details/wallets/NFT inspection and user export. |

Consult the operation strings in `app/lib/` and the owning components for exact payloads, query parameters and response types. Media/banner URLs may also be supplied by API responses.

### Wallet authentication

1. Connect MetaMask through `WalletModal`.
2. Fetch a session-bound nonce from the backend.
3. Sign a SIWE message containing the current browser host, origin, wallet address and chain ID.
4. Submit message/signature to the backend; restore identity from its cookie-backed session.
5. Register/update the username when prompted.

The frontend only exposes a restored user when its wallet address matches the connected address. Connecting a wallet alone is not equivalent to signing in. Admin authentication has its own session context and does not use SIWE.

### Minting and networks

The active mint form supports:

| Network          | Chain ID   | Gas currency |
| ---------------- | ---------- | ------------ |
| Base Sepolia     | `84532`    | ETH          |
| Ethereum Sepolia | `11155111` | ETH          |
| Polygon Amoy     | `80002`    | POL          |

The form validates uploads up to 100 MB, ERC-721 single supply or ERC-1155 editions (2–10,000), required name/description, traits, royalties (0–10%), sale options and rights confirmation. Supported upload MIME types are defined in `CreateNftForm.tsx`.

It uploads `file` plus a JSON `payload`, receives a prepared transaction from the backend, switches networks if necessary, sends the transaction through the wallet, waits for one confirmation, then posts the transaction hash to `/confirm`. Contract addresses and calldata come from the backend, not frontend environment variables. Retry actions are implemented in the creator inventory.

The wallet configuration supports more networks than minting: Ethereum, Linea, Base, Arbitrum, BNB Smart Chain, Optimism, Polygon, Monad, MegaETH testnet, Monad testnet, Ethereum Sepolia, Linea Sepolia, Base Sepolia and Polygon Amoy. `http()` transports use the chain defaults. Network connectivity must not be interpreted as implemented cross-chain trading or mainnet minting support.

## Technology stack

Versions/ranges below are declared in `package.json`; `package-lock.json` records the resolved dependency tree.

| Dependency                         | Version/range    | Purpose                                                        |
| ---------------------------------- | ---------------- | -------------------------------------------------------------- |
| Next.js                            | `16.2.12`        | App Router, routing/layouts, bundling, fonts and images.       |
| React / React DOM                  | `19.2.4`         | UI and client state.                                           |
| TypeScript                         | `^5`             | Strict typing, bundler module resolution.                      |
| Tailwind CSS / PostCSS integration | `^4`             | Utility styles and CSS processing.                             |
| Wagmi                              | `^3.7.5`         | Wallet connection, chain switching, balances and transactions. |
| Viem                               | `^2.55.10`       | EVM amounts and transaction utilities.                         |
| SIWE                               | `^3.0.0`         | Wallet sign-in messages.                                       |
| TanStack React Query               | `^5.101.4`       | Query caching and mutations.                                   |
| React Hook Form                    | `^7.83.0`        | Form state/validation.                                         |
| Hook Form resolvers                | `^5.5.7`         | Zod integration.                                               |
| Zod                                | `^4.4.3`         | Form/filter schemas.                                           |
| ESLint / eslint-config-next        | `^9` / `16.2.12` | Next.js performance and TypeScript lint rules.                 |
| Prettier                           | `^3.6.2`         | Formatting.                                                    |

Development types include `@types/node` (`^20`) and React/React DOM types (`^19`). Charts and most icons are implemented with SVG/CSS rather than a dedicated chart or icon library.

## Project structure

```text
frontend/
├── app/
│   ├── (admin)/admin/           # Admin layout, login, overview and [section]
│   ├── (creator)/creator/       # Guarded studio, loading UI and [section]
│   ├── (user)/                 # Marketplace, tokens, NFT detail, account routes
│   ├── create/page.tsx         # Legacy static creation screen
│   ├── components/
│   │   ├── admin/              # MFA/login, guards, shell, management and demo modules
│   │   ├── auction/            # Sample auction presentation
│   │   ├── auth/               # Wallet identity context and UI access guards
│   │   ├── creator/            # Application, minting, inventory, collections, studio
│   │   ├── dashboard/          # Collector dashboard
│   │   ├── favorites/          # Favorite directory
│   │   ├── landing/            # Hero, token/NFT trends and sample collections
│   │   ├── layout/             # Public chrome, navbar, footer and breadcrumbs
│   │   ├── nfts/               # NFT detail and shared favorite button
│   │   ├── profile/            # Own-profile editor
│   │   ├── search/             # Global search modal
│   │   ├── skeleton/           # Token/NFT card loading states
│   │   ├── tokens/             # Token directory and details
│   │   └── wallet/             # Connection modal and current-wallet management
│   ├── lib/                    # REST/GraphQL clients, admin operations, Wagmi config
│   ├── globals.css             # Tailwind import, theme variables, shared styles/animation
│   ├── layout.tsx              # Root document, fonts and metadata
│   ├── page.tsx                # Landing-page composition
│   ├── providers.tsx           # Wallet, query and auth providers
│   ├── not-found.tsx           # Not-found screen
│   ├── types.ts                # Shared token/creator types (others remain colocated)
│   ├── favicon.ico
│   └── icon.png
├── public/
│   ├── assets/logo.png
│   ├── assets/wallet-icons/     # MetaMask, Coinbase and Phantom image assets
│   └── *.svg                   # Starter assets: next, vercel, globe, file, window
├── scripts/
│   ├── migrate-inline-tailwind.mjs
│   └── normalize-tailwind.mjs   # Bulk styling migration helpers, not build steps
├── .env.example
├── .gitignore
├── AGENTS.md                   # Repository instructions for coding agents
├── CLAUDE.md                   # Additional local agent guidance
├── next.config.ts              # Turbopack root and remote image allowlist
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

`node_modules/`, `.next/`, `next-env.d.ts` and `*.tsbuildinfo` are installed/generated files and are ignored. The sibling `backend/` owns APIs and persistence; `contracts/` owns smart contracts and deployment. They are not npm workspaces managed by this frontend package.

NFT artwork is largely delivered by the backend/IPFS; decorative landing artwork is also built with CSS/SVG. The presence of Coinbase/Phantom icons does not mean those connection flows are implemented. `next/image` permits remote images only from `coin-images.coingecko.com` and `assets.coingecko.com`; several NFT/media components deliberately use regular media elements and backend URLs.

## Setup and configuration

### Prerequisites

- Node.js **20.9 or newer**, the minimum documented by the installed Next.js package. Check compatibility with the separate backend before choosing a shared Node version.
- npm; use the committed lockfile with `npm ci`.
- A running compatible backend for real data and authenticated features.
- MetaMask for wallet workflows; testnet funds and configured deployed contracts for minting.

No Node version file or `engines` constraint is supplied in the frontend package.

### Install and run

From the repository root:

```bash
cd frontend
npm ci
```

Create `.env.local` if it does not already exist, with:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Then:

```bash
npm run dev
```

Open `http://localhost:3000`. Preserve any existing `.env`/`.env.local` configuration; do not overwrite it blindly. A local `.env` existed during this audit, but its values are intentionally not documented.

### Frontend environment variables

| Variable              | Required?                                       | Behavior                                                                                                                                                                                                                              |
| --------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Optional locally; set explicitly for deployment | Backend base URL, without `/api`. Leading/trailing whitespace and a final slash are stripped. Empty/unset values fall back to `http://localhost:4000`. This is the only environment variable referenced by frontend application code. |
| `COINGECKO_API_KEY`   | Not used by this frontend                       | Present in `.env.example`, but token requests go to the backend. Configure the key in the backend if needed.                                                                                                                          |

`NEXT_PUBLIC_*` values are public browser configuration and must never contain secrets. Set the API URL before production build; changing it requires rebuilding the client bundle. There are no frontend contract-address, WalletConnect-project-ID, Pinata or custom-RPC environment settings implemented.

### Backend requirements

Use [the backend README](../backend/README.md) and backend source/configuration for full setup. A local backend workflow, after configuring its environment and a PostgreSQL database, is:

```bash
cd backend
npm ci
npm run db:generate
npm run db:migrate
npm run dev
```

Run these commands from the repository root in a separate terminal. `db:migrate` is a development database operation; use the backend's `db:deploy` workflow for deployment databases.

For the default local frontend, configure the backend with:

```dotenv
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
SIWE_DOMAIN=localhost:3000
```

Also configure `DATABASE_URL` and `SESSION_SECRET`. Do not leave copied example values blank where the backend expects an actual value: several backend defaults use `??`, which does not replace an empty string.

Additional feature requirements belong in **backend configuration**:

- Token data: CoinGecko access and optional `COINGECKO_API_KEY`.
- NFT/collection uploads: Pinata credentials (the inspected runtime uses `PINATA_JWT`) and gateway configuration.
- Unlockable data: `UNLOCKABLE_ENCRYPTION_KEY`.
- Admin MFA: `ADMIN_AUTH_ENCRYPTION_KEY` and a provisioned admin account; this frontend has no admin registration/provisioning workflow.
- Minting: RPC URLs and deployed ERC-721/ERC-1155 addresses for the selected testnet, using the `BASE_SEPOLIA_*`, `ETHEREUM_SEPOLIA_*` or `POLYGON_AMOY_*` backend variables. See [contracts documentation](../contracts/README.md).

Creator access also requires backend approval. Do not assume the sample admin screens provide an approval operation.

## Development workflow

Run commands from `frontend/`:

| Command                | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Start Next.js development server.                                |
| `npm run lint`         | Run ESLint.                                                      |
| `npx tsc --noEmit`     | Check TypeScript; no dedicated frontend typecheck script exists. |
| `npm run format:check` | Check formatting across the folder.                              |
| `npm run format`       | Rewrite formatting across the folder; review the resulting diff. |
| `npm run build`        | Create production output in `.next/`.                            |
| `npm run start`        | Serve an existing production build.                              |

Keep route entry files focused on composition and metadata where practical; feature code belongs under its component directory. Add creator/admin sections to the corresponding navigation registry as well as their section renderer. Use the shared API helpers, preserving credential handling and multipart behavior.

Read `AGENTS.md` before automated code edits. It directs agents to the installed Next.js documentation under `node_modules/next/dist/docs/`, because this project uses Next.js 16 conventions. Styling migration scripts rewrite source files in bulk using the current working directory; do not run them as ordinary installation or formatting steps.

### Manual acceptance checks

There is no automated frontend test harness. After relevant changes, exercise:

1. Public home, token search/detail, marketplace filters/pagination, NFT detail and global search; include API failure and empty results.
2. Wallet connection, signature rejection/success, username setup, logout, reconnect and switching accounts.
3. Favorites persistence and own-profile editing, including image validation and username-route updates.
4. Creator pending/approved access, profile modal, collection creation and NFT inventory actions.
5. On a configured testnet: upload, chain switch, transaction rejection, successful mint confirmation and recovery through inventory retry.
6. Admin login, MFA enrollment/verification, unauthorized access, user/creator filters, detail modals, account-status updates and export.
7. Mobile layouts, keyboard navigation, modal focus/closing and missing media.

Only use disposable records and testnet assets when validating mutations. Sample screens need API implementation before they can pass business-operation acceptance checks.

## Build and deployment

The existing configuration supports a normal Next.js server deployment:

```bash
cd frontend
npm ci
# Set NEXT_PUBLIC_API_URL for the deployed backend before building.
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

To use another port, pass it to the script, for example `npm run start -- --port 3001`. If the development origin changes, update backend `FRONTEND_ORIGIN` and `SIWE_DOMAIN` accordingly.

Deployment requirements:

- Set the hosting project root to `frontend/` and use its package/lockfile.
- Retain the Next.js production build, `public/`, package/configuration files and required runtime dependencies, or use a Next.js-aware hosting build process.
- Provision and deploy the backend separately; a successful frontend build does not configure PostgreSQL, IPFS or contracts.
- Serve frontend/API over HTTPS in production. The backend uses secure production session cookies with `SameSite=None` and credentialed CORS; configure its exact frontend origin and SIWE host. Browser cookie restrictions can still affect cross-site authentication.
- Allow outbound font fetching during build: the root layout uses `next/font/google` for Geist and Geist Mono. CoinGecko images, API media, IPFS gateways and wallet RPCs also need appropriate network access at runtime.
- `next.config.ts` fixes the Turbopack root to this folder. It does not configure API rewrites, standalone output or static export. Do not deploy `.next/` as a plain static website or assume an `out/` directory is generated.

No deployment was performed as part of this audit.

## Known limitations

- This is not a complete trading marketplace: purchase, bidding, settlement and most financial/administrative operations remain unconnected.
- The mint form's collection dropdown contains three hardcoded slugs (`aether-dimensions`, `synthetic-nature`, `prismatic-forms`) rather than loading the creator's API-backed collections. Creating a collection does not automatically make it selectable there.
- `/profile/[username]` always requests the authenticated user's profile. Search/detail links to other creators do not provide a true public creator profile implementation.
- Several NFT price displays and bid labels hardcode `ETH`, even though Polygon Amoy minting uses `POL`. Chain currency labels need consolidation.
- Wallet management displays the currently connected wallet; it does not implement persistent multi-wallet linking/unlinking. `/creator/wallets` additionally contains sample wallet data.
- Token data is fetched through the backend, not streamed through a frontend WebSocket. Chart ranges use the returned sparkline; they are not independent historical data queries.
- The static `/create` page duplicates the active creator flow and can mislead users. Its upload, preview, markdown and creation copy do not establish working functionality.
- Homepage hero/collection content and many dashboard metrics are examples. `HowItWorks` and `StatisticsSection` are present but commented out of the landing-page composition. `AuctionPanel` contains sample bids.
- Large files such as `AdminSection.tsx`, `CreatorSection.tsx` and the marketplace page mix substantial UI and behavior. API response types, chain maps and price/media formatting are duplicated.
- Backend unavailability is sometimes treated as an unauthenticated session, so an access screen may indicate a service/configuration problem rather than a missing account.
- No frontend-wide error boundary, automated accessibility tests or end-to-end suite is supplied. Existing loading/error UI does not establish comprehensive recovery or accessibility coverage.

## Roadmap

The following is a proposed continuation order based on observed gaps, not a committed product schedule:

1. **Make existing paths consistent:** replace/remove `/create`, load actual collections in the mint form, implement public creator profiles, fix network currency labels and replace dead links.
2. **Complete marketplace transactions:** implement validated purchase/bid operations, contract approvals where needed, pending/rejected/confirmed states, backend reconciliation and auction settlement.
3. **Finish creator operations:** connect inventory/listings/offers/sales and financial metrics; add persistent wallet management and replace settings demonstrations with real profile data.
4. **Finish administration:** add creator application review and moderation, then connect the remaining asset, finance, network, settings and audit modules to authorized backend operations.
5. **Improve maintainability and assurance:** split large components, centralize API types/chain metadata/media handling, add focused unit and integration tests plus wallet/API end-to-end coverage, and establish CI checks.
6. **Prepare production operation:** validate deployed cookie/CORS behavior, RPC reliability, error monitoring, accessibility, media performance and transaction recovery before extending minting to additional networks.

## Developer handover notes

- Start with `app/lib/api.ts`, `app/providers.tsx`, `AuthProvider.tsx` and the navigation registries before changing authentication or routing.
- Treat backend and chain state as authoritative. Client permissions and optimistic UI are not authorization controls.
- Preserve integer wei values as strings/BigInt for transactions. Existing `Number(formatEther(...))` conversions are display logic, not suitable for exact payment accounting.
- Keep API response contracts aligned with the sibling backend. The public and admin GraphQL endpoints use different envelope conventions.
- Review transaction recovery carefully: upload/preparation, wallet submission and backend confirmation are distinct steps and can fail independently.
- Distinguish on-chain minting from database metadata, sale flags, archive/delete behavior and collection records. A UI update or backend deletion does not itself burn an NFT or execute a sale.
- Keep `.env*`, credentials, private keys and generated build files out of commits. `.env.example` is the documented exception.
- Update this README when a sample module becomes connected or an API/configuration contract changes.
