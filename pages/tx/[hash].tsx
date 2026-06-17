// explorer/pages/tx/[hash].tsx
// Transaction detail page
// NOTE: qc-node doesn't yet have eth_getTransactionByHash â€” transactions
// are only accessible as part of a block. This page is a forward-compatible
// stub; it displays a clear message and links back to the explorer.
// Full tx lookup requires adding an index to Storage (M13+).

import Head from 'next/head';
import Link from 'next/link';

interface Props { hash: string }

export async function getServerSideProps({ params }: { params: { hash: string } }) {
  return { props: { hash: params.hash ?? '' } };
}

export default function TxPage({ hash }: Props) {
  return (
    <>
      <Head><title>Tx {hash.slice(0, 18)}â€¦ â€” QTC Explorer</title></Head>
      <div style={s.root}>
        <header style={s.header}>
          <Link href="/" style={s.back}>â† explorer</Link>
          <span style={s.logo}>Transaction</span>
        </header>

        <div style={s.card}>
          <div style={s.row}>
            <span style={s.label}>hash</span>
            <span style={s.value}>{hash}</span>
          </div>
          <div style={s.notice}>
            Direct transaction lookup is not yet available â€” transactions are
            currently only accessible via their containing block.
            <br /><br />
            This will be indexed in M13 when <code>eth_getTransactionByHash</code>
            is added to qc-node.
          </div>
        </div>

        <p style={s.hint}>
          To find this transaction, search for it in the block list on the{' '}
          <Link href="/" style={s.link}>explorer home</Link>.
        </p>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { background: '#0a0a0a', color: '#d0d0d0', fontFamily: "'JetBrains Mono', monospace", minHeight: '100vh', padding: '24px 32px' },
  header: { display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, borderBottom: '1px solid #1a1a1a', paddingBottom: 16 },
  back: { color: '#555', textDecoration: 'none', fontSize: 12 },
  logo: { fontSize: 16, fontWeight: 700, color: '#fff' },
  card: { background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 8, overflow: 'hidden', marginBottom: 20 },
  row: { display: 'flex', padding: '12px 16px', borderBottom: '1px solid #141414', gap: 16 },
  label: { fontSize: 10, color: '#444', width: 80, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: 1 },
  value: { fontSize: 11, color: '#bbb', wordBreak: 'break-all' },
  notice: { fontSize: 11, color: '#666', padding: '14px 16px', lineHeight: 1.7 },
  hint: { fontSize: 11, color: '#444' },
  link: { color: '#00E5FF', textDecoration: 'none' },
};
