import React, { useEffect, useState, createContext } from 'react'
import './App.css'
import CommentsContainer from './components/CommentsContainer';
import { normalizeData, recursiveVisits, staticAsset } from './libs';
import type { UserType, CommentType, CommentContextType } from './types';

const defaultUser: UserType = { image: { png: '', webp: '' }, username: '' };

const CommentContext = createContext<CommentContextType>({
  comments:[], 
  setComments:()=>{},
  users: [],
  setUsers: ()=>{},
  currentUser: defaultUser,   
  setCurrentUser: () => {},
  nextId: 0,
  setNextId: () => {},
});
export {CommentContext}


function App(): React.JSX.Element {

  const [comments, setComments] = useState<CommentType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>(defaultUser);
  const [nextId, setNextId] = useState<number>(0);
  const storageKey = 'interactive-comments';

  useEffect(()=>{
    const item = localStorage.getItem(storageKey);
    if(item) {
      const normalized = normalizeData(JSON.parse(item));
      setComments(normalized.comments);
      setUsers(normalized.users);
      setCurrentUser(normalized.currentUser);
      let id = 0;
      recursiveVisits(normalized.comments, (c)=> {id = Math.max(id, c.id);});
      setNextId(id + 1);
    } else {
      fetch(staticAsset('/data.json'))
      .then(res => {                
          return res.json();
      })
      .then(data => {
          const normalized = normalizeData(data);
          setComments(normalized.comments);
          setUsers(normalized.users);
          setCurrentUser(normalized.currentUser);
          let id = 0;
          recursiveVisits(normalized.comments, (c)=> {id = Math.max(id, c.id);});
          setNextId(id + 1);
        })
      .catch(error => {
        console.error('Fetch Error:', error);
      })
      .finally(() => {
        console.log('done fetching the data.')
      });
    }
  }, [])

  useEffect(()=>{
    if(comments.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify({currentUser, comments}));
    }
    console.log('comments', comments);
  }, [comments])
  useEffect(()=>{
    if(users.length > 0) {
      console.log('users', users);
    }
  }, [users])

  return (
    <>
      <CommentContext.Provider value={{comments, setComments, users, setUsers, currentUser, setCurrentUser, nextId, setNextId}}>
        <CommentsContainer/>
      </CommentContext.Provider>
    </>
  )
}

export default App
