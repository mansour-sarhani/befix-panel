# BeFix Admin Panel - Real-Time Notification System Plan

## Status: PLANNING PHASE

**Last Updated:** November 4, 2025  
**Target Platforms:** Web Browser + Mobile Apps (iOS/Android)  
**Deployment:** VPS/Dedicated Server  
**Budget:** Free tier (FCM: 10M messages/month)

---

## Overview

This document outlines the plan for implementing a comprehensive real-time notification system for the BeFix Admin Panel that supports:

- **Push Notifications:** Delivered even when browser/app is closed (via Firebase Cloud Messaging)
- **Real-time In-App Notifications:** Instant updates when panel is open (via Socket.io WebSockets)
- **Persistent Storage:** All notifications stored in MongoDB for history/management
- **Cross-Platform:** Works on web browsers now, seamlessly extends to mobile apps later

---

## Technology Stack Decision

### Selected Approach: Firebase Cloud Messaging (FCM) + Socket.io

**Why This Combination?**

1. **FCM (Firebase Cloud Messaging):**
   - Free tier: 10 million messages/month (more than sufficient)
   - Native support for web browsers AND mobile apps (iOS/Android)
   - Handles push delivery complexity (retry logic, device management, etc.)
   - Works offline - delivers notifications when device comes online
   - Industry standard, battle-tested at scale

2. **Socket.io (WebSocket Server):**
   - Real-time bidirectional communication
   - Instant notification delivery when user is online
   - Auto-reconnection handling
   - Room-based broadcasting (send to specific users)
   - Works perfectly on VPS/Dedicated Server
   - Completely free (self-hosted)

3. **MongoDB:**
   - Persist all notifications for history
   - Support pagination, filtering, search
   - Track read/unread status
   - Audit trail

**How They Work Together:**

- **User Online:** Socket.io delivers notification instantly → Update UI immediately
- **User Offline:** FCM sends push notification → User clicks → Opens app → Sees notification
- **Notification History:** All stored in MongoDB regardless of delivery method

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser/Mobile)                  │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ React UI       │  │ Socket.io      │  │ FCM Service   │ │
│  │ - Dropdown     │◄─┤ Client         │  │ Worker        │ │
│  │ - Badge        │  │ - Listeners    │  │ - Background  │ │
│  │ - Full Page    │  │ - Auto-reconnect│  │ - Push API   │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└──────────────┬────────────────┬────────────────┬────────────┘
               │                │                │
               │ HTTPS          │ WebSocket      │ FCM Protocol
               │                │                │
┌──────────────▼────────────────▼────────────────▼────────────┐
│                      NEXT.JS SERVER (VPS)                    │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ API Routes     │  │ Socket.io      │  │ FCM Admin SDK │ │
│  │ - CRUD         │  │ Server         │  │ - Send Push   │ │
│  │ - Mark Read    │  │ - Rooms        │  │ - Token Mgmt  │ │
│  │ - Send (Admin) │  │ - Broadcast    │  │               │ │
│  └────────┬───────┘  └────────┬───────┘  └───────┬───────┘ │
│           │                   │                   │          │
│           └───────────────────┴───────────────────┘          │
│                               │                              │
│                    ┌──────────▼──────────┐                  │
│                    │   Notification      │                  │
│                    │   Helper Functions  │                  │
│                    └──────────┬──────────┘                  │
└───────────────────────────────┼──────────────────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │   MongoDB Database   │
                    │   - Notifications    │
                    │   - Users (FCM tokens)│
                    └──────────────────────┘
```

---

## Customer Decision Points

### Questions Still Pending Customer Confirmation:

1. **Notification Types:** What events should trigger notifications?
   - User created/edited/deleted by admin?
   - Status changes (active/inactive/suspended)?
   - Role changes?
   - System maintenance alerts?
   - Custom admin announcements?
   - Other business-specific events?

2. **User Permissions:** Who can send custom notifications?
   - Admin only?
   - Admin + Manager roles?
   - Should there be approval workflow?

3. **Notification Preferences:** Should users control what they receive?
   - Option to disable push notifications?
   - Option to disable in-app notifications?
   - Frequency controls (immediate, digest, etc.)?
   - Note: User model already has `preferences.pushNotifications` field

4. **Retention Policy:** How long to keep notifications?
   - Keep all forever?
   - Auto-delete read notifications after X days?
   - Auto-delete all after X days?

5. **Mobile App Timeline:** When are mobile apps planned?
   - Already in development?
   - Future (3-6 months)?
   - No specific timeline yet?

---

## Database Schema

### Notification Model (New)

```javascript
{
    recipient: ObjectId (ref: User),
    sender: ObjectId (ref: User, nullable for system),
    type: Enum [system, admin, info, warning, success, error],
    title: String (max 100 chars),
    message: String (max 500 chars),
    actionUrl: String (optional, e.g., "/users/123"),
    actionLabel: String (optional, e.g., "View Details"),
    read: Boolean (default: false),
    readAt: Date (nullable),
    metadata: Object (optional extra data),
    expiresAt: Date (optional auto-cleanup),
    deliveryStatus: {
        socketDelivered: Boolean,
        pushDelivered: Boolean,
        pushError: String
    },
    timestamps: true (createdAt, updatedAt)
}
```

**Indexes:**
- Compound: `[recipient, read, createdAt]` for efficient queries

### User Model Updates (Extend Existing)

```javascript
// Add to existing User model:
fcmTokens: [{
    token: String,
    device: String (web/ios/android),
    createdAt: Date,
    lastUsed: Date
}]
```

---

## Components to Build

### Backend (Node.js/Next.js API)

1. **Database:**
   - `src/models/Notification.js` - Mongoose model

2. **Socket.io Server:**
   - `src/lib/socket/server.js` - Socket.io server setup
   - `src/lib/socket/auth.js` - JWT authentication middleware for Socket.io
   - User rooms (join on connect, leave on disconnect)

3. **Firebase Admin SDK:**
   - `src/lib/firebase/admin.js` - FCM Admin SDK initialization
   - `src/lib/firebase/push.js` - Push notification sender

4. **Notification Helpers:**
   - `src/lib/notifications.js` - Unified notification sender
     - `sendNotification(userId, data)` - Sends via Socket.io + FCM
     - `createSystemNotification()` - System event triggers
     - `sendBulkNotification()` - Batch sending

5. **API Routes:**
   - `GET /api/notifications` - List user's notifications (paginated)
   - `GET /api/notifications/count` - Unread count
   - `PATCH /api/notifications/[id]/read` - Mark as read
   - `PATCH /api/notifications/mark-all-read` - Mark all read
   - `DELETE /api/notifications/[id]` - Delete notification
   - `POST /api/notifications/send` - Admin send custom notification
   - `POST /api/notifications/fcm-token` - Register FCM token

6. **Integration Points:**
   - Modify `src/app/api/users/route.js` - Trigger notifications on user events
   - Modify `src/app/api/users/[id]/route.js` - Status/role change notifications

### Frontend (React/Next.js)

1. **Redux State Management:**
   - `src/features/notifications/notificationsSlice.js` - Redux slice
   - `src/services/notification.service.js` - API calls

2. **Firebase Client SDK:**
   - `src/lib/firebase/client.js` - FCM client initialization
   - `public/firebase-messaging-sw.js` - Service Worker for background push

3. **Socket.io Client:**
   - `src/contexts/NotificationContext.js` - Socket.io connection management
   - Connect on auth, disconnect on logout
   - Listen for `notification:new` event

4. **UI Components:**
   - `src/components/layout/NotificationDropdown.js` - Bell icon dropdown
   - `src/app/(dashboard)/notifications/page.js` - Full notifications page
   - `src/app/(dashboard)/notifications/send/page.js` - Admin send page (role-gated)

5. **Header Updates:**
   - Replace static bell icon with `NotificationDropdown`
   - Real-time badge count from Redux

---

## Implementation Phases

### Phase 1: Database & Models
- Create Notification Mongoose model
- Add `fcmTokens` field to User model
- Database indexes

### Phase 2: Socket.io Real-Time (In-App)
- Setup Socket.io server on Next.js
- JWT authentication for Socket.io connections
- User-specific rooms
- Test real-time delivery

### Phase 3: Firebase Cloud Messaging (Push)
- Setup Firebase project
- Install Firebase Admin SDK (backend)
- Install Firebase Client SDK (frontend)
- Create service worker for background push
- Token registration endpoint
- Test push notifications

### Phase 4: Unified Notification System
- Notification helper functions
- Send via Socket.io + FCM simultaneously
- Handle online/offline states
- Delivery status tracking

### Phase 5: API Routes
- CRUD endpoints for notifications
- Unread count endpoint
- Mark as read functionality
- Admin send endpoint with role check

### Phase 6: Frontend - State Management
- Redux slice for notifications
- Service layer API integration
- NotificationContext for Socket.io

### Phase 7: Frontend - UI Components
- NotificationDropdown in Header
- Badge with unread count
- Full notifications page with pagination
- Admin send notification page

### Phase 8: System Integration
- Trigger notifications on user events
- System notification templates
- Testing all notification flows

### Phase 9: Polish & Testing
- Error handling (Socket.io reconnection, FCM delivery failures)
- Loading states
- Empty states
- Accessibility (ARIA labels, keyboard nav)
- Cross-browser testing
- Mobile responsive design

### Phase 10: Documentation & Deployment
- Environment variable setup guide
- Firebase project setup instructions
- VPS deployment checklist (Socket.io port configuration)
- User guide for notification preferences

---

## Dependencies to Install

### Backend (package.json):
```json
{
  "firebase-admin": "^12.0.0",
  "socket.io": "^4.7.0"
}
```

### Frontend (package.json):
```json
{
  "firebase": "^10.7.0",
  "socket.io-client": "^4.7.0"
}
```

---

## Environment Variables Needed

```env
# Firebase Admin SDK (backend)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key

# Firebase Client SDK (frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key

# Socket.io Configuration
SOCKET_IO_PORT=3001 (optional, or use same as Next.js)
SOCKET_IO_PATH=/socket.io
```

---

## Firebase Setup Steps (Reference)

1. Create Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging
3. Generate VAPID key for web push
4. Download service account JSON for Admin SDK
5. Add web app to Firebase project
6. Copy config values to .env

---

## VPS Deployment Considerations

1. **Port Configuration:**
   - Option A: Run Socket.io on same port as Next.js (easier)
   - Option B: Run Socket.io on separate port (requires firewall config)

2. **Process Management:**
   - Use PM2 or systemd to keep Socket.io server running
   - Auto-restart on crashes

3. **Reverse Proxy (Nginx/Caddy):**
   - Configure WebSocket proxy pass
   - Ensure proper headers for Socket.io upgrade

4. **SSL/TLS:**
   - HTTPS required for service workers (FCM push)
   - WebSocket needs WSS protocol

---

## Security Considerations

1. **Socket.io Authentication:**
   - Verify JWT token on connection
   - Only allow users to join their own room

2. **FCM Token Management:**
   - Store tokens securely in database
   - Remove stale tokens (expired/invalid)
   - One user can have multiple tokens (multiple devices)

3. **Authorization:**
   - Only admins can send custom notifications
   - Users can only read/delete their own notifications

4. **Rate Limiting:**
   - Prevent notification spam
   - Limit admin custom notifications (e.g., 100/hour)

5. **Input Validation:**
   - Sanitize notification content
   - Validate actionUrl to prevent XSS

---

## Future Enhancements (Post-MVP)

- Email notifications (integrate with SendGrid/Mailgun)
- SMS notifications (Twilio)
- Notification templates with variables
- Scheduled notifications
- Notification analytics (delivery rate, open rate)
- Rich notifications (images, action buttons)
- Notification sounds (user preference)
- Do Not Disturb mode
- Notification grouping/threading

---

## Testing Checklist

- [ ] Socket.io connects successfully on login
- [ ] Real-time notification appears instantly when user is online
- [ ] Push notification delivered when user is offline
- [ ] Click push notification opens correct page
- [ ] Badge count updates in real-time
- [ ] Mark as read updates UI immediately
- [ ] Notifications persist after page refresh
- [ ] Multiple devices receive notifications
- [ ] Admin can send to all users
- [ ] Admin can send to specific user
- [ ] System notifications trigger on user events
- [ ] Unread count matches reality
- [ ] Pagination works correctly
- [ ] Notification dropdown scrolls properly
- [ ] Mobile responsive design
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Browser notification permission request
- [ ] Handle permission denied gracefully

---

## Success Metrics

- Real-time delivery latency: < 1 second
- Push notification delivery rate: > 95%
- Socket.io connection uptime: > 99.9%
- Average time to mark notification as read: < 5 seconds
- Zero notification loss (all stored in DB)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| FCM quota exceeded | High | Monitor usage, implement rate limiting |
| Socket.io server crashes | High | PM2 auto-restart, health checks |
| Firebase service outage | Medium | Graceful degradation, retry logic |
| WebSocket blocked by firewall | Medium | Fallback to long polling |
| User denies browser permission | Low | In-app notifications still work |
| Database query performance | Medium | Proper indexes, pagination |

---

## Notes

- This plan assumes MongoDB is already running (✓ confirmed)
- User model already has `preferences.pushNotifications` field (✓ confirmed)
- AuthContext already manages user state (✓ confirmed)
- Redux Toolkit already configured (✓ confirmed)
- Existing project uses httpOnly cookies for auth (✓ confirmed)

---

**Status:** Awaiting customer confirmation on decision points before implementation.

**Next Steps:**
1. Customer answers decision point questions
2. Update this plan based on answers
3. Setup Firebase project (obtain credentials)
4. Begin Phase 1 implementation

