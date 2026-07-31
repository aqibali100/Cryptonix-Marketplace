import { createConfig, http, injected } from "wagmi";
import {
  arbitrum,
  base,
  bsc,
  linea,
  lineaSepolia,
  mainnet,
  megaethTestnet,
  monad,
  monadTestnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

const supportedChains = [
  mainnet,
  linea,
  base,
  arbitrum,
  bsc,
  optimism,
  polygon,
  monad,
  megaethTestnet,
  monadTestnet,
  sepolia,
  lineaSepolia,
] as const;

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [mainnet.id]: http(),
    [linea.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [bsc.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [monad.id]: http(),
    [megaethTestnet.id]: http(),
    [monadTestnet.id]: http(),
    [sepolia.id]: http(),
    [lineaSepolia.id]: http(),
  },
  ssr: true,
});
