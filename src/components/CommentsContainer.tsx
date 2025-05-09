import React, { useContext } from 'react';
import { CommentContext } from '../App';
import type { CommentContextType } from '../types';
import CommentCard from './CommentCard';
import AddCommentCard from './AddCommentCard';


export default function CommentsContainer(): React.JSX.Element {
    const {comments, currentUser}=useContext<CommentContextType>(CommentContext);

    // const items: React.JSX.Element[] = [];
    // for(let comment of comments) {
    //     items.push(<CommentCard key={comment.id} comment={comment} currentUser={currentUser} />);
    //     for(let reply of comment.replies) {
    //         items.push(<CommentCard key={reply.id} comment={reply} currentUser={currentUser} />)
    //     }
    // }
    //console.log(items);
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