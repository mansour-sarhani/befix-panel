# 📱 Notification System - User Guide

## For End Users

### Getting Started

**First Time:**
1. Login to the BeFix Admin Panel
2. A popup will ask: "Allow notifications?"
3. Click **"Allow"**
4. Done! You'll now receive notifications

**Already Allowed:**
- No action needed! Notifications work automatically

---

### Viewing Notifications

**Option 1: Quick View (Dropdown)**
1. Look for the 🔔 bell icon (top-right corner)
2. Red badge shows unread count
3. Click bell icon
4. See recent 5 notifications
5. Click notification to open related page

**Option 2: Full Page**
1. Click bell icon dropdown
2. Click "View all notifications"
3. OR navigate to "Notifications" in sidebar
4. See all notifications with tabs and filters

---

### Managing Notifications

**Mark as Read:**
- Click any unread notification (blue background)
- It becomes read (white background)
- Badge count decreases

**Mark All as Read:**
- On notifications page
- Click "Mark all read" button (top-right)
- All unread → read instantly

**Delete Notification:**
- On notifications page
- Click "Delete" button next to notification
- Confirm deletion
- Notification removed

**Delete All Read:**
- Switch to "Read" tab
- Click "Delete all read" button
- Confirm deletion
- All read notifications removed

---

### Understanding Notifications

**Types:**
- 🟢 **Success** - Positive events (account activated, etc.)
- 🔵 **Info** - General information
- 🟡 **Warning** - Important notices
- 🔴 **Error** - Problems that need attention
- 🟣 **System** - System-generated messages
- 🟠 **Admin** - Messages from administrators

**Parts:**
- **Title** - Main heading
- **Message** - Notification details
- **Time** - When it was sent ("2 hours ago")
- **Sender** - Who sent it (for admin messages)
- **Action** - Optional button to go somewhere

---

### What Notifications Look Like

**In-App (When Panel is Open):**
- Toast notification appears (top-right)
- Shows title and message
- Auto-dismisses after 5 seconds
- Badge count updates automatically

**Push (When Panel is Closed/Background):**
- Windows notification appears (bottom-right)
- Click to open panel
- Automatically goes to relevant page
- Badge shows when you return

---

### Tips & Tricks

**Keep Track:**
- Badge shows unread count
- Check regularly to stay updated
- Mark old ones as read to keep organized

**Take Action:**
- Click action buttons for quick access
- Notifications often link to relevant pages
- Don't ignore warnings or errors!

**Organize:**
- Use tabs to filter (All/Unread/Read)
- Use type filter to find specific kinds
- Delete old read notifications to declutter

---

## For Admins & Managers

### Sending Custom Notifications

**Access:**
1. Look for "Send Notification" in sidebar
2. Under "Admin Tools" section
3. Click to open sender page

**Sending to All Users:**
1. Select "All Users" in "Send To" dropdown
2. Enter title and message
3. Select type (Info/Success/Warning/Error)
4. (Optional) Add action URL and label
5. Click "Send Notification"
6. All active users receive push!

**Sending to Specific Role:**
1. Select "Specific Role"
2. Choose role: Admin / Manager / User
3. Fill in notification details
4. Send!
5. All users with that role receive it

**Sending to One User:**
1. Select "Single User"
2. Choose user from dropdown (shows name, email, role)
3. Fill in notification details
4. Send!
5. That user receives it

**Using Templates:**
- Click template buttons (Welcome, Maintenance, etc.)
- Form auto-fills with pre-written content
- Customize as needed
- Send!

**Preview:**
- See live preview of notification
- Exactly how users will see it
- Adjust before sending

---

### Best Practices for Admins

**When to Send:**
- ✅ Important announcements
- ✅ System maintenance notices
- ✅ New feature releases
- ✅ Account status changes
- ✅ Security alerts
- ❌ Spam or unnecessary messages
- ❌ Too frequently (respect users!)

**Writing Good Notifications:**
- **Clear titles** - "Maintenance Tonight" not "Info"
- **Concise messages** - Get to the point
- **Action URLs** - Link to relevant pages
- **Right type** - Warning for urgent, Info for general
- **Proofread** - Check spelling and grammar

**Recipient Selection:**
- **All Users** - Major announcements only
- **By Role** - Role-specific information
- **Single User** - Personal messages, account issues

---

### Monitoring

**Check Delivery:**
- Look at MongoDB notifications collection
- Check `deliveryStatus.pushDelivered` field
- `true` = Successfully delivered
- `false` + error = Check Firebase quota or user tokens

**User Tokens:**
- Users automatically register tokens on login
- Tokens stored in `users.fcmTokens` array
- Old tokens (60+ days) automatically excluded
- No manual management needed

---

## Troubleshooting

### "I'm not receiving notifications"

**Check:**
1. Did you allow notifications when prompted?
2. Check browser settings → Notifications → Allow localhost
3. Check Windows notification settings (not blocked)
4. Try logging out and in again
5. Check `/firebase-test` page to verify token

### "Bell icon shows wrong count"

**Fix:**
1. Refresh the page (Ctrl+R)
2. Badge auto-updates every 30 seconds
3. If still wrong, check MongoDB unread count

### "Can't send notifications (Admin)"

**Check:**
1. Are you logged in as Admin or Manager?
2. Regular users can't send notifications
3. Check role in user menu (top-right)

### "Notifications page is slow"

**Reason:**
- Too many notifications (1000+)
- Use pagination (20 per page)
- Delete old read notifications
- Database indexes optimize queries

---

## FAQ

**Q: Will I miss notifications if I'm offline?**  
A: No! Firebase delivers them when you come back online.

**Q: Can I disable notifications?**  
A: Yes, via browser settings or block the permission popup.

**Q: How long are notifications kept?**  
A: Forever, unless you delete them or admin sets expiration.

**Q: Can I send notifications on mobile apps?**  
A: Future feature - same system will work on iOS/Android!

**Q: Are notifications secure?**  
A: Yes! httpOnly cookies, encrypted connections, role-based access.

**Q: What happens if I deny permission?**  
A: You won't get push notifications, but can still view in-app.

---

**Need Help?** Contact your system administrator or check the troubleshooting guide!

---

**Version:** 1.0.0  
**Last Updated:** November 5, 2025  
**System Status:** ✅ Fully Operational

