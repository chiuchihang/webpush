import Head from 'next/head';
import SubscribeButton from '../components/SubscribeButton';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Push Notification App</title>
        <meta name="description" content="Next.js app with push notifications" />
      </Head>
      <h1 className="text-center mt-5">Push Notification App</h1>
      <SubscribeButton />
    </div>
  );
}