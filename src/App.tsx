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
      if(!newcomment.replayingTo) newcomment.replayingTo= null;
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
      // const username = comment.user.username;
      
      // let newcomment:CommentType = {...comment};
      // if(!newcomment.replies) newcomment.replies = [];
      // if(!newcomment.replayingTo) newcomment.replayingTo= null;
      // let user0 = users.find(user => user.username === username);
      // if(user0) newcomment.user = user0;
      // for(let i = 0; i < comment.replies.length; i++) {
      //   let reply = comment.replies[i];
      //   if(!reply.replies) reply.replies = [];
      //   let replier = users.find(user => user.username === reply.user.username);
      //   //console.log('normalizeData', replier, reply, users)
      //   newcomment.replies[i] = {...reply, user: replier}
      //   newcomment.replies[i].replayingTo = newcomment.user;
      // }

      comments.push(normalizeComment(comment));
    }

    return {users, comments, currentUser};
  }

  const [comments, setComments] = useState<CommentType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>(); //({image: {png: '', webp: ''}, username: ''});

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
    //console.log('users', users);
    console.log('comments', comments);
    //console.log('currentUser', currentUser);
  }, [comments])

  return (
    <>
      <CommentContext.Provider value={{comments, setComments, users, setUsers, currentUser, setCurrentUser}}>
        <CommentsContainer />
      </CommentContext.Provider>
    </>
  )
}

export default App
