// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a0a0a" />
      </Head>
      <body style={{ margin: 0, background: '#0a0a0a' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
