import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>cRUNicle - Your Running Journal</title> {/* Default title */}
        <meta name="description" content="cRUNicle is your personalized running journal to stay motivated and track your progress." />
      </Head>
      <Component {...pageProps} />
    </>
  );
}