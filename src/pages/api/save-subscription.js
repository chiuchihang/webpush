import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'subscriptions.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const subscription = req.body;

    // Read existing subscriptions
    let subscriptions = [];
    if (fs.existsSync(filePath)) {
      subscriptions = JSON.parse(fs.readFileSync(filePath));
    }

    // Add new subscription
    subscriptions.push(subscription);

    // Save subscriptions to file
    fs.writeFileSync(filePath, JSON.stringify(subscriptions));

    res.status(200).json({ message: 'Subscription saved successfully.' });
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}