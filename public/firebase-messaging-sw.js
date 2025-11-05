/**
 * Firebase Cloud Messaging Service Worker
 * 
 * This service worker runs in the background and handles push notifications
 * when the browser/app is closed or not in focus.
 * 
 * IMPORTANT: This file must be in the /public directory and served at the root URL.
 * 
 * @see https://firebase.google.com/docs/cloud-messaging/js/receive
 */

// Import Firebase scripts for service worker
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

/**
 * Firebase configuration
 * Note: Environment variables are not available in service workers,
 * so we need to inject these values or use a different approach.
 * 
 * TODO: For production, consider generating this file dynamically with actual env values
 * For now, we'll use a postMessage approach to get config from the main app.
 */
const firebaseConfig = {
    apiKey: "AIzaSyCgDYqtcxl6XM5dd1B54BOc45tASXb-pc8",
    authDomain: "befix-panel.firebaseapp.com",
    projectId: "befix-panel",
    storageBucket: "befix-panel.firebasestorage.app",
    messagingSenderId: "110844709095",
    appId: "1:110844709095:web:26c3b39903bca7212afa42",
    measurementId: "G-MRBYVTENF9"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Get Firebase Messaging instance
const messaging = firebase.messaging();

/**
 * Handle background messages (when app is closed/not in focus)
 * This will show a notification automatically
 */
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message:", payload);

    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
        body: payload.notification?.body || "You have a new notification",
        icon: payload.notification?.icon || "/icon-192x192.png",
        badge: "/icon-192x192.png",
        tag: payload.data?.notificationId || "default",
        data: {
            url: payload.data?.actionUrl || "/notifications",
            ...payload.data,
        },
        requireInteraction: false,
        silent: false,
    };

    // Show notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Handle notification click
 * Opens the app and navigates to the relevant page
 */
self.addEventListener("notificationclick", (event) => {
    console.log("[firebase-messaging-sw.js] Notification clicked:", event.notification);

    event.notification.close();

    const urlToOpen = event.notification.data?.url || "/notifications";

    // Open the app or focus existing window
    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUnmatched: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && "focus" in client) {
                        client.focus();
                        client.postMessage({
                            type: "NOTIFICATION_CLICKED",
                            url: urlToOpen,
                        });
                        return;
                    }
                }

                // App not open, open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

/**
 * Service Worker lifecycle events
 */
self.addEventListener("install", (event) => {
    console.log("[firebase-messaging-sw.js] Service Worker installing");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[firebase-messaging-sw.js] Service Worker activating");
    event.waitUntil(clients.claim());
});

