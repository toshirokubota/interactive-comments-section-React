import React, { useContext } from 'react';
import { CommentContext } from '../App';
import type { CommentContextType } from '../types';
import CommentCard from './CommentCard';
import AddCommentCard from './AddCommentCard';


export default function CommentsContainer(): React.JSX.Element {
    const {comments, currentUser}=useContext<CommentContextType>(CommentContext);

    return (
        <div>
            {
                comments.map(comment => 
                    <CommentCard key={comment.id} comment={comment} currentUser={currentUser} />
                )
            }
            <AddCommentCard />
        </div>
    )
}