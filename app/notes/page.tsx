'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { dbService } from '@/lib/appwrite';
import ProtectedRoute from '@/components/protected-route';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  FileText,
  Calendar,
  Filter,
  BookOpen,
} from 'lucide-react';

interface Note {
  $id: string;
  title: string;
  content: string;
  subject?: string;
  tags?: string[];
  $createdAt: string;
  $updatedAt: string;
}

function NotesPageContent() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: '',
    tags: '',
  });
  const [loading, setLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  // Filter notes based on search and subject
  useEffect(() => {
    let filtered = notes;

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter((note) => note.subject === selectedSubject);
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedSubject]);

  const fetchNotes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const fetchedNotes = await dbService.getUserNotes(user.$id);
      setNotes(fetchedNotes.documents as unknown as Note[]);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!user || !newNote.title.trim()) return;

    try {
      const tagsArray = newNote.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await dbService.createNote({
        userId: user.$id,
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject,
        tags: tagsArray,
        isFavorite: false,
      });

      setNewNote({ title: '', content: '', subject: '', tags: '' });
      setIsCreating(false);
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;

    try {
      const tagsArray = newNote.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      await dbService.updateNote(editingNote.$id, {
        title: newNote.title,
        content: newNote.content,
        subject: newNote.subject,
        tags: tagsArray,
      });

      setEditingNote(null);
      setNewNote({ title: '', content: '', subject: '', tags: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await dbService.deleteNote(noteId);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      subject: note.subject || '',
      tags: note.tags?.join(', ') || '',
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingNote(null);
    setNewNote({ title: '', content: '', subject: '', tags: '' });
  };

  const subjects = ['all', ...new Set(notes.map((n) => n.subject).filter(Boolean))];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Notes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Organize your study materials and important information
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>

                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </div>
            </div>

            {/* Create/Edit Note Form */}
            <AnimatePresence>
              {isCreating && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{editingNote ? 'Edit Note' : 'Create New Note'}</span>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Note Title"
                          value={newNote.title}
                          onChange={(e) =>
                            setNewNote({ ...newNote, title: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Subject (e.g., Math, Physics)"
                          value={newNote.subject}
                          onChange={(e) =>
                            setNewNote({ ...newNote, subject: e.target.value })
                          }
                        />
                      </div>

                      <Textarea
                        placeholder="Note content..."
                        value={newNote.content}
                        onChange={(e) =>
                          setNewNote({ ...newNote, content: e.target.value })
                        }
                        rows={8}
                      />

                      <Input
                        placeholder="Tags (comma-separated)"
                        value={newNote.tags}
                        onChange={(e) =>
                          setNewNote({ ...newNote, tags: e.target.value })
                        }
                      />

                      <div className="flex gap-2">
                        <Button
                          onClick={editingNote ? handleUpdateNote : handleCreateNote}
                          disabled={!newNote.title.trim()}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {editingNote ? 'Update Note' : 'Save Note'}
                        </Button>
                        <Button variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notes Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  {notes.length === 0 ? 'No notes yet' : 'No notes found'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {notes.length === 0
                    ? 'Create your first note to get started!'
                    : 'Try adjusting your search or filters'}
                </p>
                {notes.length === 0 && (
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Note
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note, index) => (
                  <motion.div
                    key={note.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-start justify-between">
                          <span className="flex-1 line-clamp-2">{note.title}</span>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(note)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note.$id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4 mb-4">
                          {note.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {note.subject && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {note.subject}
                            </span>
                          )}
                          {note.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(note.$createdAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <NotesPageContent />
    </ProtectedRoute>
  );
}
