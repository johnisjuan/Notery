import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI';
import axios from "axios"
import api from '../lib/axios';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';

const HomePage = () => {
  const [isRateLimited,setIsRateLimited] = useState(false);
  const [notes,setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes",error);
        if(error.response?.status === 429){
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes")
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  },[])

  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      {notes.length === 0 && !isRateLimited && <NotesNotFound />}

      <div className="max-w-7xl max-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
 
export default HomePage