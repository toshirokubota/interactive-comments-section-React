import React, { useEffect, useState, createContext } from 'react'
import './App.css'
import CommentsContainer from './components/CommentsContainer';
import { staticAsset } from './libs';
import type { UserType, CommentType, CommentContextType } from './types';

const defaultUser: UserType = { image: { png: '', webp: '' }, username: '' };

const CommentContext = createContext<CommentContextType>({
  comments:[], 
  setComments:()=>{},
  users: [],
  setUsers: ()=>{},
  currentUser: defaultUser,   
  setCurrentUser: () => {}
});
export {CommentContext}


function App(): React.JSX.Element {

  const normalizeData = (data: any): 
    {users: UserType[], comments: CommentType[], currentUser: UserType} => {
    //get all users
    const currentUser = data.currentUser as UserType;
    const users: UserType[] = [];
    users.push(currentUser);
    for(let comment of data.comments) {
      const user = comment.user;
      if(!users.some(existing => existing.username === user.username)) {
        users.push(user);
      }
      for(let reply of comment.replies) {
        const user = reply.user;
        if(!users.some(existing => existing.username === user.username)) {
          users.push(user);
        }  
      }
    }

    //normalize comment. done recursively
    const normalizeComment = (comment: any):CommentType => {
      const username = comment?.user?.username;
      
      let newcomment:CommentType = {...comment};
      if(!newcomment.replies) newcomment.replies = [];
      if(!newcomment.replyingTo) newcomment.replyingTo= null;
      let user0 = users.find(user => user.username === username);
      if(user0) newcomment.user = user0;
      if(comment.replies) {
        for(let i = 0; i < comment.replies.length; i++) {
          let reply = comment.replies[i];
          newcomment.replies[i] = normalizeComment(reply);
        }
      }
      return newcomment;
    }
    const comments: CommentType[] = [];
    for(let comment of data.comments) {
      comments.push(normalizeComment(comment));
    }

    return {users, comments, currentUser};
  }

  const [comments, setComments] = useState<CommentType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>(defaultUser);
  const [flatComments, setFlatComments] = useState<CommentType[]>([]);

  useEffect(()=>{
    fetch(staticAsset('/data.json'))
    .then(res => {                
        return res.json();
    })
    .then(data => {
        const normalized = normalizeData(data);
        setComments(normalized.comments);
        setUsers(normalized.users);
        setCurrentUser(normalized.currentUser);
    })
    .catch(error => {
      console.error('Fetch Error:', error);
    })
    .finally(() => {
      console.log('done fetching the data.')
    });
  }, [])

  useEffect(()=>{
    console.log('comments', comments);
  }, [comments])
  useEffect(()=>{
    console.log('flat comments', flatComments);
  }, [flatComments])

  return (
    <>
      <CommentContext.Provider value={{comments, setComments, users, setUsers, currentUser, setCurrentUser, flatComments, setFlatComments}}>
        <CommentsContainer />
      </CommentContext.Provider>
    </>
  )
}

export default App
