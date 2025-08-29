# 🔥 JobTrac Firestore Database - Complete End-to-End Implementation

## 📋 **Database Architecture Overview**

### **Firebase Configuration**
- **Version**: Firebase 12.0.0
- **Services Used**: Firestore, Authentication, Analytics
- **Environment**: Environment variables for configuration (`VITE_FIREBASE_*`)
- **Initialization**: Single firebase.ts configuration file

---

## 🗄️ **Database Structure & Collections**

### **Root Level Collections**

#### 1. **`users/{userId}` - User Document**
**Purpose**: Store user metadata and profile information
```typescript
// Document structure:
{
  uid: string,
  email: string | null,
  createdAt: string,
  lastLoginAt: string,
  profile?: {
    name: string,
    ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '56+',
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say',
    country?: string,
    profileCompleted: boolean,
    profileCompletedAt: Timestamp
  }
}
```

#### 2. **analytics Collection**
**Purpose**: Store application-wide analytics data
- **`analytics/overview`**: Total user count and last updated timestamp
- **`analytics/demographics`**: Gender, age ranges, and country statistics

---

### **User Subcollections** (Under `users/{userId}/`)

#### 1. **applications Collection**
**Data Written**: Job application tracking
```typescript
interface Application {
  id: string,
  company: string,
  role: string,
  link: string,
  date: string,
  status: ApplicationStatus,
  nextStep: string,
  recruiter: string,
  referral: 'Y' | 'N',
  location: string,
  notes: string,
  jobDescription?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. **prepEntries Collection**
**Data Written**: Interview preparation sessions
```typescript
interface PrepEntry {
  id: string,
  date: string,
  topic: string,
  problems: string,
  time: number,
  confidence: number,
  notes: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 3. **companies Collection**
**Data Written**: Company research data
```typescript
interface CompanyResearch {
  id: string,
  company: string,
  whatTheyDo: string,
  values: string,
  why: string,
  questions: string,
  news: string,
  createdAt: string
}
```

#### 4. **contacts Collection**
**Data Written**: Networking contacts
```typescript
interface NetworkingContact {
  id: string,
  name: string,
  company: string,
  role: string,
  date: string,
  status: string,
  referral: 'Y' | 'N',
  notes: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 5. **stories Collection**
**Data Written**: STAR method behavioral interview stories
```typescript
interface StarStory {
  id: string,
  title: string,
  situation: string,
  task: string,
  action: string,
  result: string,
  createdAt: string,
  updatedAt: Timestamp
}
```

#### 6. **`notesCollection` Collection**
**Data Written**: User notes with markdown support
```typescript
interface NotePage {
  id: string,
  title: string,
  content: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  color: string,
  tags: string[],
  pinned: boolean
}
```

#### 7. **settings Subcollection**
- **`settings/onboarding`**: User onboarding progress and demo mode state
- **`settings/notesSettings`**: Notes configuration and preferences

---

## 🔄 **Data Flow & Operations**

### **WRITE Operations (When & What)**

#### **User Authentication & Profile**
- **When**: User signs in for the first time
- **What**: Creates/updates user document with metadata
- **Location**: `users/{userId}`
- **Trigger**: `onAuthStateChanged` in useAuth.ts

#### **CRUD Operations on Main Collections**
- **When**: User creates, updates, or deletes items through UI
- **What**: All data types (applications, prep entries, companies, contacts, stories, notes)
- **How**: Via useFirestore hook with automatic timestamp management
- **Auto-added fields**: createdAt, updatedAt

#### **Analytics Data**
- **When**: User completes profile setup
- **What**: Increments counters in analytics collection
- **Location**: `analytics/overview` and `analytics/demographics`
- **Service**: AnalyticsService.saveUserProfile()

#### **Onboarding & Settings**
- **When**: User completes onboarding steps, enables demo mode
- **What**: Progress tracking, feature completion status
- **Location**: `users/{userId}/settings/onboarding`

#### **Demo Mode Data**
- **When**: User enables demo mode during onboarding
- **What**: Populates all collections with sample data
- **How**: Batch writes using enableDemoMode() in useOnboarding

---

### **READ Operations (Real-time Listeners)**

#### **Real-time Data Synchronization**
```typescript
// All main collections use onSnapshot for real-time updates
onSnapshot(query(collectionRef, orderBy('createdAt', 'desc')), (snapshot) => {
  const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setData(items);
});
```

**Active Listeners**:
- Applications tracker
- Prep log entries
- Company research
- Networking contacts
- STAR stories
- Notes collection
- Onboarding state

---

### **DELETE Operations (When & What)**

#### **Individual Item Deletion**
- **When**: User deletes specific items through UI
- **What**: Single document deletion
- **How**: `deleteDoc()` via `useFirestore.deleteItem()`

#### **Complete User Data Deletion**
- **When**: Anonymous user logs out OR user deletes account
- **What**: Batch deletion of ALL user data
- **Collections Deleted**:
  - applications
  - prepEntries
  - companies
  - contacts
  - stories
  - `notesCollection`
  - `settings/notesSettings`
- **Method**: `writeBatch()` for atomic deletion
- **Location**: deleteUserData() in useAuth.ts

---

## 👥 **User Management & Authentication**

### **User Types Supported**
1. **Google OAuth Users**: Full persistent accounts
2. **Email/Password Users**: Full persistent accounts  
3. **Anonymous Users**: Temporary accounts with data deletion on logout

### **User Lifecycle**

#### **User Creation**
1. **Authentication**: Firebase Auth handles login
2. **Document Creation**: User document created in Firestore
3. **Profile Setup**: Optional profile completion for analytics
4. **Onboarding**: Welcome wizard and feature introduction

#### **User Session Management**
- **Persistence**: Automatic Firebase Auth persistence
- **State Management**: `onAuthStateChanged` listener
- **Profile Tracking**: Checks if profile setup needed

#### **User Deletion (Anonymous Users)**
1. **Confirmation**: User warned about data loss
2. **Re-authentication**: Refresh token before deletion
3. **Data Cleanup**: Batch delete all Firestore data
4. **Account Removal**: Delete from Firebase Auth
5. **UI Update**: Return to login state

---

## 🔒 **Security & Data Isolation**

### **Data Scoping Strategy**
- **User Isolation**: All user data stored under `users/{userId}/`
- **Authentication Required**: All operations require authenticated user
- **Collection References**: Built dynamically with user ID
```typescript
collection(db, 'users', userId, collectionName)
```

### **Security Implementation**
- **Client-side Validation**: User ID required for all operations
- **Error Handling**: Comprehensive error catching and user feedback
- **Firestore Rules**: Assumed to be configured (not visible in codebase)

---

## 📊 **Performance & Optimization**

### **Real-time Updates**
- **Efficient Listeners**: Uses `onSnapshot` with query ordering
- **Automatic Cleanup**: Listeners properly unsubscribed
- **Loading States**: Proper loading/error state management

### **Batch Operations**
- **Demo Data**: Batch writes for sample data creation
- **User Deletion**: Batch deletion for atomic cleanup
- **Error Recovery**: Graceful handling of batch operation failures

### **Memory Management**
- **Hook-based**: React hooks manage subscription lifecycles
- **Dependency Arrays**: Proper cleanup when user changes
- **State Reset**: Data cleared when user logs out

---

## 🛠️ **Data Import/Export**

### **Import Capabilities**
- **CSV Support**: Can import applications, prep entries, stories, companies, contacts
- **JSON Support**: Full data import with validation
- **Data Cleaning**: Automatic field validation and transformation

### **Export Features**
- **JSON Export**: Complete data export functionality
- **Sample Generation**: Can generate CSV templates
- **Bulk Operations**: Support for batch data operations

---

## 🔍 **Debugging & Diagnostics**

### **Built-in Debugging**
- **Connectivity Tests**: AnalyticsService.testFirestoreConnection()
- **Verbose Logging**: Comprehensive console logging for all operations
- **Error Tracking**: Detailed error information with stack traces
- **Verification Checks**: Post-write verification for critical operations

---

## 📈 **Analytics & Metrics**

### **User Analytics**
- **Demographics Tracking**: Age, gender, country statistics
- **User Count**: Total registered users
- **Profile Completion**: Tracks profile setup completion
- **Privacy Focused**: Aggregated data only, no personal information

### **Usage Analytics**
- **Onboarding Progress**: Track feature adoption
- **Demo Mode**: Track users trying demo features
- **Feature Usage**: Task completion tracking in onboarding

---