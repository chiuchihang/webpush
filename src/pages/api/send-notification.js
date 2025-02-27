import webPush from 'web-push';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'subscriptions.json');

webPush.setVapidDetails(
  'mailto:example@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { endpoint, payload } = req.body;

    // Read subscriptions
    const subscriptions = JSON.parse(fs.readFileSync(filePath));

    // Find the subscription by endpoint
    const subscription = subscriptions.find((sub) => sub.endpoint === endpoint);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found.' });
    }

    try {
      await webPush.sendNotification(subscription, payload);
      res.status(200).json({ message: 'Notification sent successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to send notification.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}