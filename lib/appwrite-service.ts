import { Client, Account, Databases, Storage, ID, Query, Models } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'studygenius_db';

export const COLLECTIONS = {
  USERS: 'users',
  QUESTIONS: 'questions',
  NOTES: 'notes',
  STUDY_PLANS: 'study_plans',
  FLASHCARDS: 'flashcards',
  PROGRESS: 'progress',
} as const;

export const BUCKETS = {
  AVATARS: 'avatars',
  ATTACHMENTS: 'attachments',
} as const;

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AppwriteUser extends Models.User<Models.Preferences> {}

export interface UserProfile extends Models.Document {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  streak: number;
  totalQuestions: number;
  totalNotes: number;
  totalPlans: number;
  badges: string[];
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Question extends Models.Document {
  userId: string;
  question: string;
  answer: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags: string[];
  isFavorite: boolean;
  votes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Note extends Models.Document {
  userId: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  isFavorite: boolean;
  color?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyPlan extends Models.Document {
  userId: string;
  title: string;
  description: string;
  goals: string[];
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate: string;
  }>;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard extends Models.Document {
  userId: string;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  repetitions: number;
  easeFactor: number;
  createdAt: string;
  updatedAt: string;
}

export interface Progress extends Models.Document {
  userId: string;
  subject: string;
  totalStudyTime: number;
  questionsAnswered: number;
  notesCreated: number;
  plansCompleted: number;
  lastActivity: string;
  weeklyGoal: number;
  weeklyProgress: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AUTHENTICATION SERVICE
// ============================================

export const authService = {
  // Email & Password Authentication
  async signUp(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await this.createSession(email, password);
      await this.createUserProfile(user);
      return user;
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    }
  },

  async signIn(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  },

  async createSession(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Session creation failed');
    }
  },

  // OAuth Authentication
  async signInWithGoogle() {
    try {
      await account.createOAuth2Session(
        'google' as any,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/auth/signin`
      );
    } catch (error: any) {
      throw new Error(error.message || 'Google sign in failed');
    }
  },

  async signInWithGithub() {
    try {
      await account.createOAuth2Session(
        'github' as any,
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/auth/signin`
      );
    } catch (error: any) {
      throw new Error(error.message || 'GitHub sign in failed');
    }
  },

  // Anonymous Authentication
  async signInAnonymous() {
    try {
      return await account.createAnonymousSession();
    } catch (error: any) {
      throw new Error(error.message || 'Anonymous sign in failed');
    }
  },

  // Get Current User
  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Get User Profile
  async getUserProfile(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );
      return response.documents[0] as unknown as UserProfile;
    } catch (error) {
      return null;
    }
  },

  // Create User Profile
  async createUserProfile(user: AppwriteUser) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        ID.unique(),
        {
          userId: user.$id,
          name: user.name,
          email: user.email,
          avatar: '',
          bio: '',
          streak: 0,
          totalQuestions: 0,
          totalNotes: 0,
          totalPlans: 0,
          badges: [],
          preferences: {
            theme: 'system',
            notifications: true,
            language: 'en',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Profile creation failed');
    }
  },

  // Update Profile
  async updateProfile(userId: string, data: Partial<UserProfile>) {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) throw new Error('Profile not found');

      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        profile.$id,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  },

  // Sign Out
  async signOut() {
    try {
      await account.deleteSession('current');
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  },

  // Password Reset
  async resetPassword(email: string) {
    try {
      return await account.createRecovery(
        email,
        `${window.location.origin}/auth/reset-password`
      );
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  },

  async completePasswordReset(userId: string, secret: string, password: string) {
    try {
      return await account.updateRecovery(userId, secret, password);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset completion failed');
    }
  },

  // Email Verification
  async sendVerificationEmail() {
    try {
      return await account.createVerification(`${window.location.origin}/auth/verify`);
    } catch (error: any) {
      throw new Error(error.message || 'Verification email failed');
    }
  },

  async verifyEmail(userId: string, secret: string) {
    try {
      return await account.updateVerification(userId, secret);
    } catch (error: any) {
      throw new Error(error.message || 'Email verification failed');
    }
  },
};

// ============================================
// DATABASE SERVICE - CRUD OPERATIONS
// ============================================

export const dbService = {
  // ============================================
  // QUESTIONS CRUD
  // ============================================
  
  async createQuestion(data: Omit<Question, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        ID.unique(),
        {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Question creation failed');
    }
  },

  async getQuestion(documentId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        documentId
      ) as Question;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch question');
    }
  },

  async getUserQuestions(userId: string, limit: number = 25, offset: number = 0) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch questions');
    }
  },

  async searchQuestions(userId: string, searchTerm: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        [
          Query.equal('userId', userId),
          Query.search('question', searchTerm),
          Query.orderDesc('$createdAt'),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Search failed');
    }
  },

  async updateQuestion(documentId: string, data: Partial<Question>) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        documentId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Question update failed');
    }
  },

  async deleteQuestion(documentId: string) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.QUESTIONS,
        documentId
      );
    } catch (error: any) {
      throw new Error(error.message || 'Question deletion failed');
    }
  },

  async toggleQuestionFavorite(documentId: string, isFavorite: boolean) {
    try {
      return await this.updateQuestion(documentId, { isFavorite });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to toggle favorite');
    }
  },

  // ============================================
  // NOTES CRUD
  // ============================================

  async createNote(data: Omit<Note, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        ID.unique(),
        {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Note creation failed');
    }
  },

  async getNote(documentId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        documentId
      ) as Note;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch note');
    }
  },

  async getUserNotes(userId: string, limit: number = 50, offset: number = 0) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch notes');
    }
  },

  async searchNotes(userId: string, searchTerm: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        [
          Query.equal('userId', userId),
          Query.search('title', searchTerm),
          Query.orderDesc('$createdAt'),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Search failed');
    }
  },

  async getNotesBySubject(userId: string, subject: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        [
          Query.equal('userId', userId),
          Query.equal('subject', subject),
          Query.orderDesc('$createdAt'),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch notes');
    }
  },

  async updateNote(documentId: string, data: Partial<Note>) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        documentId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Note update failed');
    }
  },

  async deleteNote(documentId: string) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.NOTES,
        documentId
      );
    } catch (error: any) {
      throw new Error(error.message || 'Note deletion failed');
    }
  },

  async toggleNoteFavorite(documentId: string, isFavorite: boolean) {
    try {
      return await this.updateNote(documentId, { isFavorite });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to toggle favorite');
    }
  },

  // ============================================
  // STUDY PLANS CRUD
  // ============================================

  async createStudyPlan(data: Omit<StudyPlan, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.STUDY_PLANS,
        ID.unique(),
        {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Study plan creation failed');
    }
  },

  async getStudyPlan(documentId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.STUDY_PLANS,
        documentId
      ) as StudyPlan;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch study plan');
    }
  },

  async getUserStudyPlans(userId: string, limit: number = 25, offset: number = 0) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDY_PLANS,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch study plans');
    }
  },

  async getActiveStudyPlans(userId: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDY_PLANS,
        [
          Query.equal('userId', userId),
          Query.equal('status', 'active'),
          Query.orderDesc('$createdAt'),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch active plans');
    }
  },

  async updateStudyPlan(documentId: string, data: Partial<StudyPlan>) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.STUDY_PLANS,
        documentId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Study plan update failed');
    }
  },

  async deleteStudyPlan(documentId: string) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.STUDY_PLANS,
        documentId
      );
    } catch (error: any) {
      throw new Error(error.message || 'Study plan deletion failed');
    }
  },

  async updatePlanProgress(documentId: string, progress: number, status?: 'active' | 'completed' | 'paused') {
    try {
      const updateData: any = { progress };
      if (status) updateData.status = status;
      return await this.updateStudyPlan(documentId, updateData);
    } catch (error: any) {
      throw new Error(error.message || 'Progress update failed');
    }
  },

  // ============================================
  // FLASHCARDS CRUD
  // ============================================

  async createFlashcard(data: Omit<Flashcard, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FLASHCARDS,
        ID.unique(),
        {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Flashcard creation failed');
    }
  },

  async getFlashcard(documentId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.FLASHCARDS,
        documentId
      ) as Flashcard;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch flashcard');
    }
  },

  async getUserFlashcards(userId: string, subject?: string) {
    try {
      const queries = [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
      ];

      if (subject) {
        queries.push(Query.equal('subject', subject));
      }

      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FLASHCARDS,
        queries
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch flashcards');
    }
  },

  async getDueFlashcards(userId: string) {
    try {
      const now = new Date().toISOString();
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FLASHCARDS,
        [
          Query.equal('userId', userId),
          Query.lessThanEqual('nextReview', now),
          Query.orderAsc('nextReview'),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch due flashcards');
    }
  },

  async updateFlashcard(documentId: string, data: Partial<Flashcard>) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.FLASHCARDS,
        documentId,
        {
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Flashcard update failed');
    }
  },

  async deleteFlashcard(documentId: string) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.FLASHCARDS,
        documentId
      );
    } catch (error: any) {
      throw new Error(error.message || 'Flashcard deletion failed');
    }
  },

  // Spaced Repetition Algorithm (SM-2)
  async reviewFlashcard(documentId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) {
    try {
      const card = await this.getFlashcard(documentId);
      let { repetitions, easeFactor } = card;

      if (quality >= 3) {
        repetitions += 1;
        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      } else {
        repetitions = 0;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
      }

      easeFactor = Math.max(1.3, easeFactor);

      let interval = 0;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round((repetitions - 1) * easeFactor);

      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);

      return await this.updateFlashcard(documentId, {
        repetitions,
        easeFactor,
        lastReviewed: new Date().toISOString(),
        nextReview: nextReview.toISOString(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Review failed');
    }
  },

  // ============================================
  // PROGRESS TRACKING CRUD
  // ============================================

  async createProgress(data: Omit<Progress, '$id' | '$createdAt' | '$updatedAt' | '$permissions' | '$collectionId' | '$databaseId'>) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        ID.unique(),
        {
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Progress creation failed');
    }
  },

  async getProgress(documentId: string) {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        documentId
      ) as Progress;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch progress');
    }
  },

  async getUserProgress(userId: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
        ]
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch progress');
    }
  },

  async getSubjectProgress(userId: string, subject: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        [
          Query.equal('userId', userId),
          Query.equal('subject', subject),
        ]
      );
      return response.documents[0] as unknown as Progress;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch subject progress');
    }
  },

  async updateProgress(documentId: string, data: Partial<Progress>) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        documentId,
        {
          ...data,
          lastActivity: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error: any) {
      throw new Error(error.message || 'Progress update failed');
    }
  },

  async deleteProgress(documentId: string) {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        documentId
      );
    } catch (error: any) {
      throw new Error(error.message || 'Progress deletion failed');
    }
  },

  async incrementStudyTime(userId: string, subject: string, minutes: number) {
    try {
      const progress = await this.getSubjectProgress(userId, subject);
      if (!progress) {
        const now = new Date().toISOString();
        return await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.PROGRESS,
          ID.unique(),
          {
            userId,
            subject,
            totalStudyTime: minutes,
            questionsAnswered: 0,
            notesCreated: 0,
            plansCompleted: 0,
            lastActivity: now,
            weeklyGoal: 300,
            weeklyProgress: minutes,
            createdAt: now,
            updatedAt: now,
          }
        ) as unknown as Progress;
      }
      return await this.updateProgress(progress.$id, {
        totalStudyTime: progress.totalStudyTime + minutes,
        weeklyProgress: progress.weeklyProgress + minutes,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to increment study time');
    }
  },
};

// ============================================
// STORAGE SERVICE
// ============================================

export const storageService = {
  async uploadFile(bucketId: string, file: File) {
    try {
      return await storage.createFile(bucketId, ID.unique(), file);
    } catch (error: any) {
      throw new Error(error.message || 'File upload failed');
    }
  },

  async getFile(bucketId: string, fileId: string) {
    try {
      return await storage.getFile(bucketId, fileId);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get file');
    }
  },

  async deleteFile(bucketId: string, fileId: string) {
    try {
      return await storage.deleteFile(bucketId, fileId);
    } catch (error: any) {
      throw new Error(error.message || 'File deletion failed');
    }
  },

  getFilePreview(bucketId: string, fileId: string, width: number = 400, height: number = 400) {
    return storage.getFilePreview(bucketId, fileId, width, height);
  },

  getFileDownload(bucketId: string, fileId: string) {
    return storage.getFileDownload(bucketId, fileId);
  },

  getFileView(bucketId: string, fileId: string) {
    return storage.getFileView(bucketId, fileId);
  },
};

export default {
  account,
  databases,
  storage,
  authService,
  dbService,
  storageService,
};
