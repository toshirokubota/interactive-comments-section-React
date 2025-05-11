import React, { useContext } from 'react';
import { CommentContext } from '../App';
import type { CommentContextType } from '../types';
import CommentCard from './CommentCard';
import AddCommentCard from './AddCommentCard';
import { recursiveVisits } from '../libs';


export default function CommentsContainer(): React.JSX.Element {
    const {comments, currentUser}=useContext<CommentContextType>(CommentContext);

    const cards: React.JSX.Element[]= [];
    recursiveVisits(comments, (comment) => {
        cards.push(<CommentCard key={comment.id} comment={comment} currentUser={currentUser} />);
    });


    return (
        <div>
            {
                cards
            }
            <AddCommentCard />
        </div>
    )
}