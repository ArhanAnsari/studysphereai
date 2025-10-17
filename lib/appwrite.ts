import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and Collection IDs
export const DATABASE_ID = 'studygenius';
export const COLLECTIONS = {
  USERS: 'users',
  QUESTIONS: 'questions',
  NOTES: 'notes',
  PROGRESS: 'progress',
  FLASHCARDS: 'flashcards',
  STUDY_PLANS: 'study_plans',
};

export { ID, Query };

// Types
export interface UserProfile {
  $id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  lastActivity: string;
  badges: string[];
  createdAt: string;
}

export interface Question {
  $id: string;
  userId: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mode: 'quick' | 'detailed';
  hasVisual: boolean;
  createdAt: string;
}

export interface Note {
  $id: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  $id: string;
  userId: string;
  date: string;
  questionsAsked: number;
  topicsCompleted: string[];
  studyTime: number; // in minutes
  xpEarned: number;
}

export interface Flashcard {
  $id: string;
  userId: string;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  createdAt: string;
}

export interface StudyPlan {
  $id: string;
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
  createdAt: string;
}

// Authentication helpers
export const authService = {
  async signUpWithEmail(email: string, password: string, name: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      await this.createUserProfile(user.$id, name, email);
      return user;
    } catch (error) {
      throw error;
    }
  },

  async signInWithEmail(email: string, password: string) {
    return await account.createEmailPasswordSession(email, password);
  },

  async signInWithGoogle() {
    return await account.createOAuth2Session(
      'google' as any, 
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/auth/signin`
    );
  },

  async signInWithGithub() {
    return await account.createOAuth2Session(
      'github' as any,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/auth/signin`
    );
  },

  async signInAnonymous() {
    return await account.createAnonymousSession();
  },

  async signOut() {
    return await account.deleteSession('current');
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  async createUserProfile(userId: string, name: string, email: string) {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      ID.unique(),
      {
        userId,
        name,
        email,
        level: 1,
        xp: 0,
        streak: 0,
        lastActivity: new Date().toISOString(),
        badges: [],
        createdAt: new Date().toISOString(),
      }
    );
  },
};

// Database helpers
export const dbService = {
  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('userId', userId)]
      );
      return response.documents[0] as unknown as UserProfile;
    } catch {
      return null;
    }
  },

  async updateUserProfile(documentId: string, data: Partial<UserProfile>) {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      documentId,
      data
    );
  },

  // Question operations
  async saveQuestion(data: Omit<Question, '$id' | 'createdAt'>) {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.QUESTIONS,
      ID.unique(),
      {
        ...data,
        createdAt: new Date().toISOString(),
      }
    );
  },

  async getUserQuestions(userId: string, limit = 50) {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.QUESTIONS,
      [Query.equal('userId', userId), Query.orderDesc('createdAt'), Query.limit(limit)]
    );
  },

  // Note operations
  async createNote(data: Omit<Note, '$id' | 'createdAt' | 'updatedAt'>) {
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
  },

  async updateNote(documentId: string, data: Partial<Note>) {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.NOTES,
      documentId,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  async deleteNote(documentId: string) {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.NOTES,
      documentId
    );
  },

  async getUserNotes(userId: string) {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.NOTES,
      [Query.equal('userId', userId), Query.orderDesc('updatedAt')]
    );
  },

  // Progress operations
  async getTodayProgress(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        [Query.equal('userId', userId), Query.equal('date', today)]
      );
      return response.documents[0] as unknown as Progress;
    } catch {
      return null;
    }
  },

  async updateProgress(userId: string, data: Partial<Progress>) {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.getTodayProgress(userId);
    
    if (existing) {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        existing.$id,
        data
      );
    } else {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        ID.unique(),
        {
          userId,
          date: today,
          questionsAsked: 0,
          topicsCompleted: [],
          studyTime: 0,
          xpEarned: 0,
          ...data,
        }
      );
    }
  },

  async getWeeklyProgress(userId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PROGRESS,
      [
        Query.equal('userId', userId),
        Query.greaterThanEqual('date', weekAgoStr),
        Query.orderDesc('date')
      ]
    );
  },

  // Flashcard operations
  async createFlashcard(data: Omit<Flashcard, '$id' | 'createdAt'>) {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.FLASHCARDS,
      ID.unique(),
      {
        ...data,
        createdAt: new Date().toISOString(),
      }
    );
  },

  async getUserFlashcards(userId: string, subject?: string) {
    const queries = [Query.equal('userId', userId), Query.orderDesc('createdAt')];
    if (subject) {
      queries.push(Query.equal('subject', subject));
    }
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FLASHCARDS,
      queries
    );
  },

  async updateFlashcard(documentId: string, data: Partial<Flashcard>) {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.FLASHCARDS,
      documentId,
      data
    );
  },

  async deleteFlashcard(documentId: string) {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.FLASHCARDS,
      documentId
    );
  },

  // Study Plan operations
  async createStudyPlan(data: Omit<StudyPlan, '$id' | 'createdAt'>) {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.STUDY_PLANS,
      ID.unique(),
      {
        ...data,
        createdAt: new Date().toISOString(),
      }
    );
  },

  async getUserStudyPlans(userId: string) {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STUDY_PLANS,
      [Query.equal('userId', userId), Query.orderDesc('createdAt')]
    );
  },

  async updateStudyPlan(documentId: string, data: Partial<StudyPlan>) {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDY_PLANS,
      documentId,
      data
    );
  },

  async deleteStudyPlan(documentId: string) {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.STUDY_PLANS,
      documentId
    );
  },
};

export default client;
