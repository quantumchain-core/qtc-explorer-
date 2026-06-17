// explorer/pages/index.tsx
// QTC Explorer — home page: latest blocks + chain stats

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getRecentBlocks, hexToDecimal, formatTimestamp, shorten } from '../lib/rpc';
import { client } from '../lib/rpc';
import type { BlockJson } from 'qtc-client';

interface Props {
  blocks: BlockJson[];
  chainId: string;
  tipNumber: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const [blocks, chainId, tip] = await Promise.all([
      getRecentBlocks(15),
      client.chainId().then(n => n.toString()),
      client.blockNumber().then(n => n.toString()),
    ]);
    return { props: { blocks, chainId, tipNumber: tip } };
  } catch {
    return { props: { blocks: [], chainId: '—', tipNumber: '—' } };
  }
};

export default function Home({ blocks, chainId, tipNumber }: Props) {
  return (
    <>
      <Head>
        <title>QTC Explorer</title>
        <meta name="description" content="QuantumChain block explorer" />
      </Head>

      <div style={s.root}>
        {/* Header */}
        <header style={s.header}>
          <span style={s.logo}>QTC Explorer</span>
          <div style={s.stats}>
            <Stat label="chain id" value={chainId} />
            <Stat label="height" value={tipNumber} />
          </div>
        </header>

        {/* Latest blocks */}
        <section>
          <h2 style={s.sectionTitle}>Latest Blocks</h2>
          {blocks.length === 0 ? (
            <p style={s.empty}>No blocks found — is the node running?</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  {['block', 'time', 'txs', 'gas used', 'proposer'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blocks.map(b => (
                  <tr key={b.number} style={s.tr}>
                    <td style={s.td}>
                      <Link href={`/block/${hexToDecimal(b.number)}`} style={s.link}>
                        {hexToDecimal(b.number)}
                      </Link>
                    </td>
                    <td style={s.td}>{formatTimestamp(b.timestamp)}</td>
                    <td style={s.td}>{b.transactions.length}</td>
                    <td style={s.td}>{hexToDecimal(b.gasUsed)}</td>
                    <td style={s.td}>{shorten(b.proposer)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={s.stat}>
      <span style={s.statLabel}>{label}</span>
      <span style={s.statValue}>{value}</span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    background: '#0a0a0a', color: '#d0d0d0',
    fontFamily: "'JetBrains Mono', monospace",
    minHeight: '100vh', padding: '24px 32px',
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 32,
    borderBottom: '1px solid #1a1a1a', paddingBottom: 16,
  },
  logo: { fontSize: 20, fontWeight: 700, color: '#00E5FF', letterSpacing: '0.1em' },
  stats: { display: 'flex', gap: 32 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  statLabel: { fontSize: 9, color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' },
  statValue: { fontSize: 14, color: '#fff', fontWeight: 700 },
  sectionTitle: { fontSize: 11, color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: 9, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'left', padding: '6px 12px', borderBottom: '1px solid #1a1a1a' },
  tr: { borderBottom: '1px solid #111' },
  td: { fontSize: 12, padding: '10px 12px', color: '#aaa' },
  link: { color: '#00E5FF', textDecoration: 'none', fontWeight: 700 },
  empty: { fontSize: 12, color: '#444', padding: '20px 0' },
};
