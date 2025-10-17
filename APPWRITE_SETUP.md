# Appwrite Database Setup Guide for StudyGenius

This guide will help you set up the Appwrite database, collections, and storage buckets for StudyGenius.

## Prerequisites
- Appwrite Cloud account (fra.cloud.appwrite.io)
- Project ID: `68f2335f00047e77ef55` (already configured in `.env.local`)

## Database Setup

### 1. Create Database
- Database ID: `studygenius_db`
- Database Name: StudyGenius Database

## Collections Setup

### Collection 1: users
**Collection ID:** `users`

**Attributes:**
| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | string | 255 | Yes | - | No |
| name | string | 255 | Yes | - | No |
| email | string | 255 | Yes | - | No |
| avatar | string | 2000 | No | - | No |
| bio | string | 1000 | No | - | No |
| totalPoints | integer | - | Yes | 0 | No |
| currentStreak | integer | - | Yes | 0 | No |
| longestStreak | integer | - | Yes | 0 | No |
| level | integer | - | Yes | 1 | No |
| badges | string | 50 | No | - | Yes |
| preferences | string | 5000 | No | {} | No |
| createdAt | string | 255 | Yes | - | No |
| updatedAt | string | 255 | Yes | - | No |

**Indexes:**
- `userId_index` (key) - Attribute: `userId` (ASC)
- `email_index` (unique) - Attribute: `email` (ASC)

**Permissions:**
- Read: User level
- Create: User level  
- Update: User level
- Delete: User level

---

### Collection 2: questions
**Collection ID:** `questions`

**Attributes:**
| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | string | 255 | Yes | - | No |
| question | string | 5000 | Yes | - | No |
| answer | string | 10000 | Yes | - | No |
| subject | string | 100 | Yes | - | No |
| difficulty | string | 20 | Yes | Medium | No |
| tags | string | 50 | No | - | Yes |
| isFavorite | boolean | - | Yes | false | No |
| views | integer | - | Yes | 0 | No |
| rating | integer | - | Yes | 0 | No |
| createdAt | string | 255 | Yes | - | No |
| updatedAt | string | 255 | Yes | - | No |

**Indexes:**
- `userId_index` (key) - Attribute: `userId` (ASC)
- `subject_index` (key) - Attribute: `subject` (ASC)
- `createdAt_index` (key) - Attribute: `createdAt` (DESC)

**Permissions:**
- Read: User level
- Create: User level
- Update: User level
- Delete: User level

---

### Collection 3: notes
**Collection ID:** `notes`

**Attributes:**
| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | string | 255 | Yes | - | No |
| title | string | 500 | Yes | - | No |
| content | string | 50000 | Yes | - | No |
| subject | string | 100 | Yes | - | No |
| tags | string | 50 | No | - | Yes |
| isFavorite | boolean | - | Yes | false | No |
| attachments | string | 500 | No | - | Yes |
| color | string | 20 | No | blue | No |
| createdAt | string | 255 | Yes | - | No |
| updatedAt | string | 255 | Yes | - | No |

**Indexes:**
- `userId_index` (key) - Attribute: `userId` (ASC)
- `subject_index` (key) - Attribute: `subject` (ASC)
- `updatedAt_index` (key) - Attribute: `updatedAt` (DESC)

**Permissions:**
- Read: User level
- Create: User level
- Update: User level
- Delete: User level

---

### Collection 4: study_plans
**Collection ID:** `study_plans`

**Attributes:**
| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | string | 255 | Yes | - | No |
| title | string | 500 | Yes | - | No |
| description | string | 2000 | No | - | No |
| subject | string | 100 | Yes | - | No |
| tasks | string | 100 | No | - | Yes |
| completedTasks | string | 100 | No | - | Yes |
| startDate | string | 255 | Yes | - | No |
| endDate | string | 255 | Yes | - | No |
| progress | integer | - | Yes | 0 | No |
| status | string | 20 | Yes | active | No |
| priority | string | 20 | Yes | medium | No |
| aiGenerated | boolean | - | Yes | false | No |
| createdAt | string | 255 | Yes | - | No |
| updatedAt | string | 255 | Yes | - | No |

**Indexes:**
- `userId_index` (key) - Attribute: `userId` (ASC)
- `status_index` (key) - Attribute: `status` (ASC)
- `endDate_index` (key) - Attribute: `endDate` (ASC)

**Permissions:**
- Read: User level
- Create: User level
- Update: User level
- Delete: User level

---

### Collection 5: flashcards
**Collection ID:** `flashcards`

**Attributes:**
| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | string | 255 | Yes | - | No |
| front | string | 2000 | Yes | - | No |
| back | string | 5000 | Yes | - | No |
| subject | string | 100 | Yes | - | No |
| tags | string | 50 | No | - | Yes |
| difficulty | integer | - | Yes | 0 | No |
| interval | integer | - | Yes | 0 | No |
| repetitions | integer | - | Yes | 0 | No |
| easeFactor | float | - | Yes | 2.5 | No |
| nextReview | string | 255 | Yes | - | No |
| lastReviewed | string | 255 | No | - | No |
| createdAt | string | 255 | Yes | - | No |
| updatedAt | string | 255 | Yes | - | No |

**Indexes:**
- `userId_index` (key) - Attribute: `userId` (ASC)
- `subject_index` (key) - Attribute: `subject` (ASC)
- `nextReview_index` (key) - Attribute: `nextReview` (ASC)

**Permissions:**
- Read: User level
- Create: User level
- Update: User level
- Delete: User level

---

### Collection 6: progress
**Collection ID:** `progress`

**Attributes:**
| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | string | 255 | Yes | - | No |
| subject | string | 100 | Yes | - | No |
| totalStudyTime | integer | - | Yes | 0 | No |
| questionsAnswered | integer | - | Yes | 0 | No |
| notesCreated | integer | - | Yes | 0 | No |
| plansCompleted | integer | - | Yes | 0 | No |
| lastActivity | string | 255 | Yes | - | No |
| weeklyGoal | integer | - | Yes | 300 | No |
| weeklyProgress | integer | - | Yes | 0 | No |
| createdAt | string | 255 | Yes | - | No |
| updatedAt | string | 255 | Yes | - | No |

**Indexes:**
- `userId_index` (key) - Attribute: `userId` (ASC)
- `subject_index` (key) - Attribute: `subject` (ASC)
- `userId_subject_unique` (unique) - Attributes: `userId` (ASC), `subject` (ASC)

**Permissions:**
- Read: User level
- Create: User level
- Update: User level
- Delete: User level

---

## Storage Buckets

### Bucket 1: avatars
**Bucket ID:** `avatars`
**Bucket Name:** User Avatars

**Settings:**
- Maximum File Size: 5MB
- Allowed File Extensions: `jpg`, `jpeg`, `png`, `gif`, `webp`
- Encryption: Enabled
- Antivirus: Enabled

**Permissions:**
- Read: User level
- Create: User level
- Update: User level
- Delete: User level

---

### Bucket 2: attachments
**Bucket ID:** `attachments`
**Bucket Name:** Note Attachments

**Settings:**
- Maximum File Size: 10MB
- Allowed File Extensions: `jpg`, `jpeg`, `png`, `gif`, `pdf`, `doc`, `docx`, `txt`, `md`
- Encryption: Enabled
- Antivirus: Enabled

**Permissions:**
- Read: User level
- Create: User level
- Update: User level
- Delete: User level

---

## Setup Instructions

### Step 1: Access Appwrite Console
1. Go to https://fra.cloud.appwrite.io
2. Log in to your account
3. Select your project (ID: 68f2335f00047e77ef55)

### Step 2: Create Database
1. Navigate to "Databases" in the left sidebar
2. Click "Create Database"
3. Enter Database ID: `studygenius_db`
4. Enter Database Name: "StudyGenius Database"
5. Click "Create"

### Step 3: Create Collections
For each collection listed above:
1. Click "Create Collection"
2. Enter the Collection ID and Name
3. Add all attributes as specified in the tables
4. Create the indexes as listed
5. Set up permissions (User level for all operations)
6. Save the collection

### Step 4: Create Storage Buckets
1. Navigate to "Storage" in the left sidebar
2. For each bucket:
   - Click "Create Bucket"
   - Enter Bucket ID and Name
   - Configure file size and extensions
   - Enable encryption and antivirus
   - Set permissions
   - Save the bucket

### Step 5: Verify Setup
1. Check that all 6 collections are created
2. Verify all attributes and indexes
3. Confirm both storage buckets exist
4. Test permissions by creating a test document

---

## Environment Variables
Your `.env.local` file should have:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68f2335f00047e77ef55
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
```

---

## OAuth Configuration

### Google OAuth
1. Go to Project Settings → Auth → OAuth2 Providers
2. Enable Google OAuth
3. Add your OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
4. Add authorized redirect URIs:
   - `http://localhost:3000/dashboard`
   - `https://yourdomain.com/dashboard`

### GitHub OAuth
1. Enable GitHub OAuth in the same section
2. Add your OAuth credentials:
   - Client ID: (from GitHub Developer Settings)
   - Client Secret: (from GitHub Developer Settings)
3. Add authorized callback URL:
   - `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/github/68f2335f00047e77ef55`

---

## Testing

After setup, test the following:
1. ✅ User registration with email/password
2. ✅ User login with email/password
3. ✅ Google OAuth sign in
4. ✅ GitHub OAuth sign in
5. ✅ Anonymous session creation
6. ✅ Create/Read/Update/Delete operations for each collection
7. ✅ File upload to avatars bucket
8. ✅ File upload to attachments bucket

---

## Troubleshooting

### Common Issues:

**Issue:** Cannot create documents
- **Solution:** Check collection permissions are set to "User" level

**Issue:** OAuth redirect fails
- **Solution:** Verify redirect URIs in OAuth provider settings match your domain

**Issue:** File upload fails
- **Solution:** Check file size and extension restrictions in bucket settings

**Issue:** Cannot fetch user profile
- **Solution:** Ensure `userId` attribute exists and is indexed in users collection

**Issue:** Duplicate document errors
- **Solution:** Check unique indexes are properly configured

---

## Next Steps

After completing the database setup:

1. ✅ Authentication system is ready
2. ✅ All CRUD operations are implemented
3. ✅ Start using the app and test all features
4. ✅ Monitor database usage in Appwrite console
5. ✅ Set up backups and monitoring

For support, refer to:
- Appwrite Documentation: https://appwrite.io/docs
- Project Code: `/lib/appwrite-service.ts`
