import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const SubscribeButton = () => {
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect if the user is on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
  }, []);

  const subscribeToPushNotifications = async () => {
    if (!('serviceWorker' in navigator)) {
      setError('Service Worker not supported.');
      return;
    }

    if (!('PushManager' in window)) {
      setError('Push notifications are not supported.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      setSubscription(subscription);

      // Send the subscription to the backend
      await fetch('/api/save-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (err) {
      setError('Failed to subscribe to push notifications.');
      console.error(err);
    }
  };

  return (
    <div className="text-center mt-5">
      {isIOS ? (
        <Alert variant="warning">
          Push notifications are not supported on iOS. Please subscribe to email notifications.
        </Alert>
      ) : (
        <>
          <Button onClick={subscribeToPushNotifications} disabled={!!subscription}>
            {subscription ? 'Subscribed!' : 'Subscribe to Push Notifications'}
          </Button>
          {subscription && (
            <div className="mt-3">
              <h5>Subscription Details:</h5>
              <pre>{JSON.stringify(subscription, null, 2)}</pre>
            </div>
          )}
        </>
      )}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default SubscribeButton;