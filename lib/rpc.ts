// explorer/lib/rpc.ts
// Thin wrapper around QtcClient for the explorer.
// All data fetching goes through here so pages stay clean.

import { QtcClient, type BlockJson } from 'qtc-client';

const RPC_URL = process.env.NEXT_PUBLIC_QTC_RPC_URL ?? 'http://localhost:8545';

export const client = new QtcClient({ url: RPC_URL });

/** Fetch the latest N blocks, newest first. */
export async function getRecentBlocks(count = 10): Promise<BlockJson[]> {
  const tip = await client.blockNumber();
  const blocks: BlockJson[] = [];
  for (let i = tip; i > tip - BigInt(count) && i >= 0n; i--) {
    const block = await client.getBlockByNumber(i);
    if (block) blocks.push(block);
  }
  return blocks;
}

/** Fetch a single block by number (hex or decimal string). */
export async function getBlock(numberStr: string): Promise<BlockJson | null> {
  const n = numberStr.startsWith('0x')
    ? BigInt(numberStr)
    : BigInt(numberStr);
  return client.getBlockByNumber(n);
}

/** Format a hex balance (nano-QTC) to a human-readable QTC string. */
export function formatQtc(nanoHex: string): string {
  const nano = BigInt(nanoHex);
  const whole = nano / 1_000_000_000n;
  const frac = nano % 1_000_000_000n;
  const fracStr = frac.toString().padStart(9, '0').replace(/0+$/, '');
  return fracStr ? `${whole}.${fracStr} QTC` : `${whole} QTC`;
}

/** Shorten a 0x hex string for display. */
export function shorten(hex: string, head = 10, tail = 8): string {
  if (hex.length <= head + tail + 1) return hex;
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`;
}

/** Parse hex block number to decimal string. */
export function hexToDecimal(hex: string): string {
  return BigInt(hex).toString();
}

/** Unix timestamp (hex) to human-readable date string. */
export function formatTimestamp(hex: string): string {
  const secs = Number(BigInt(hex));
  return secs === 0 ? 'genesis' : new Date(secs * 1000).toLocaleString();
}
