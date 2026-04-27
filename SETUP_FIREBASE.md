# Firebase Backend Setup Guide

Your portfolio now has a proper backend using Firebase (Option 2: Backend-as-a-Service). Here's how to set it up:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "Asad Portfolio")
4. Follow the setup wizard (you can disable Google Analytics if you want)
5. Click "Create project"

## Step 2: Create a Firestore Database

1. In your Firebase project dashboard, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose **Start in test mode** (we'll secure it later)
4. Select a location closest to your users
5. Click "Enable"

## Step 3: Get Your Firebase Config

1. In Firebase Console, go to Project Settings (gear icon next to Project Overview)
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register your app with a nickname (e.g., "Portfolio Website")
5. Copy the `firebaseConfig` object shown

## Step 4: Update Your Code

Open `/workspace/src/utils/firebase.ts` and replace the placeholder config with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Set Up Firestore Security Rules

In Firebase Console → Firestore Database → Rules tab, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read content
    match /content/{document} {
      allow read: if true;
      allow write: if false; // Only admin can write (done through your admin panel)
    }
    
    // Allow anyone to read testimonials
    match /testimonials/{document} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow anyone to submit contact forms
    match /contact_submissions/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

## Step 6: Add Initial Content to Firestore

You need to manually add initial content to Firestore or use the admin panel in your website:

### Collections to create:
1. **content** - Document IDs: `hero`, `about`, `contact`, `experience`, `projects`
2. **testimonials** - Auto-generated document IDs
3. **contact_submissions** - Auto-generated document IDs

### Example content document structure:

**content/hero**:
```json
{
  "eyebrow": "Welcome",
  "headline": "I'm Asad Ali Janjua",
  "sub": "Full Stack Web Developer",
  "roleTitle": "Developer",
  "name": "Asad Ali Janjua"
}
```

**content/contact**:
```json
{
  "email": "your-email@example.com",
  "phone": "+1 234 567 8900",
  "location": "Your Location"
}
```

## Step 7: Deploy Changes

After updating the Firebase config, tell me to:
1. Commit and push the changes
2. Redeploy to GitHub Pages

## Features Now Available:

✅ **Contact Form**: Submissions are saved to Firestore database  
✅ **Dynamic Content**: All sections (Hero, About, Experience, Projects, Contact) can be updated via Admin Dashboard  
✅ **Testimonials**: Can be added/managed through Admin Dashboard  
✅ **Real-time Updates**: Changes reflect immediately across all visitors  

## Viewing Contact Submissions:

Go to Firebase Console → Firestore Database → `contact_submissions` collection to see all form submissions.

## Next Steps:

Once you've created your Firebase project and copied the config, share the config values with me and I'll update the code and deploy it for you!
