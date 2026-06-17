// explorer/pages/block/[number].tsx
// Block detail page â€” header fields + transaction list

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getBlock, formatQtc, hexToDecimal, formatTimestamp, shorten } from '../../lib/rpc';
import type { BlockJson, TransactionJson } from 'qtc-client';

interface Props { block: BlockJson | null; number: string }

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const number = params?.number as string ?? '0';
  const block = await getBlock(number).catch(() => null);
  return { props: { block, number } };
};

export default function BlockPage({ block, number }: Props) {
  if (!block) return (
    <div style={s.root}>
      <header style={s.header}>
        <Link href="/" style={s.back}>â† explorer</Link>
      </header>
      <p style={s.empty}>Block {number} not found.</p>
    </div>
  );

  const fields: [string, string][] = [
    ['number',    hexToDecimal(block.number)],
    ['hash',      block.parentHash],
    ['slot',      hexToDecimal(block.slot)],
    ['timestamp', formatTimestamp(block.timestamp)],
    ['proposer',  block.proposer],
    ['state root',block.stateRoot],
    ['tx root',   block.txRoot],
    ['base fee',  hexToDecimal(block.baseFee) + ' nano-QTC'],
    ['gas used',  hexToDecimal(block.gasUsed)],
    ['gas limit', hexToDecimal(block.gasLimit)],
    ['signature', shorten(block.signature, 14, 10)],
  ];

  return (
    <>
      <Head><title>Block {hexToDecimal(block.number)} â€” QTC Explorer</title></Head>
      <div style={s.root}>
        <header style={s.header}>
          <Link href="/" style={s.back}>â† explorer</Link>
          <span style={s.logo}>Block {hexToDecimal(block.number)}</span>
        </header>

        {/* Header fields */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>Header</h2>
          <div style={s.card}>
            {fields.map(([label, value]) => (
              <div key={label} style={s.row}>
                <span style={s.label}>{label}</span>
                <span style={s.value}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Transactions */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>
            Transactions ({block.transactions.length})
          </h2>
          {block.transactions.length === 0 ? (
            <p style={s.empty}>No transactions in this block.</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  {['hash', 'from', 'to', 'value', 'gas'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.transactions.map((tx: TransactionJson) => (
                  <tr key={tx.hash} style={s.tr}>
                    <td style={s.td}>
                      <Link href={`/tx/${tx.hash}`} style={s.link}>
                        {shorten(tx.hash, 10, 6)}
                      </Link>
                    </td>
                    <td style={s.td}>{shorten(tx.from)}</td>
                    <td style={s.td}>{shorten(tx.to)}</td>
                    <td style={s.td}>{formatQtc(tx.value)}</td>
                    <td style={s.td}>{hexToDecimal(tx.gasLimit)}</td>
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

const s: Record<string, React.CSSProperties> = {
  root: { background: '#0a0a0a', color: '#d0d0d0', fontFamily: "'JetBrains Mono', monospace", minHeight: '100vh', padding: '24px 32px' },
  header: { display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, borderBottom: '1px solid #1a1a1a', paddingBottom: 16 },
  back: { color: '#555', textDecoration: 'none', fontSize: 12 },
  logo: { fontSize: 16, fontWeight: 700, color: '#fff' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 9, color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 },
  card: { background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 8, overflow: 'hidden' },
  row: { display: 'flex', padding: '9px 16px', borderBottom: '1px solid #141414', gap: 16 },
  label: { fontSize: 10, color: '#444', width: 100, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: 1 },
  value: { fontSize: 11, color: '#bbb', wordBreak: 'break-all' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontSize: 9, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'left', padding: '6px 12px', borderBottom: '1px solid #1a1a1a' },
  tr: { borderBottom: '1px solid #111' },
  td: { fontSize: 11, padding: '9px 12px', color: '#aaa' },
  link: { color: '#00E5FF', textDecoration: 'none' },
  empty: { fontSize: 12, color: '#444', padding: '12px 0' },
};
