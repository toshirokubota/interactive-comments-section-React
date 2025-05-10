import React, { useContext, useState } from "react";
import type { CommentContextType, CommentType } from "../types";
import { staticAsset, updateCommentRecursively } from "../libs";
import { CommentContext } from "../App";

export default function ReplyToCommentCard({comment, setReplyToComment}: 
    {
        comment:CommentType,
        setReplyToComment: React.Dispatch<React.SetStateAction<boolean>>
    }): React.JSX.Element {

    const {currentUser, setComments, nextId, setNextId}=useContext<CommentContextType>(CommentContext);
    const [message, setMessage] = useState<string>('@' + comment.user.username + ' '    );
    
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = (event.target as HTMLTextAreaElement).value;
        setMessage(value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        console.log("inside handleSubmit", event);
        event.preventDefault();

        const button = event.nativeEvent.submitter as HTMLButtonElement;
        //const name = (event.nativeEvent.submitter as HTMLButtonElement).name;
        if(button.name === 'Confirm' ) {
            const reply: CommentType = {
                id: nextId,
                user: currentUser, 
                content: message, 
                score: 0,
                createdAt: 'Now',
                replies: [],
                replyingTo: comment.user
            };
            setNextId(prev => prev + 1);

            setComments(prev=> updateCommentRecursively(prev, comment, (c)=>{
                return {...c, replies: [...c.replies, reply]}
            }));
        } 
        setReplyToComment(false);        
    }

    return (
        <section className="comment">
            <form onSubmit={(e)=> {handleSubmit(e);}} className="newcomment-grid">
                <img src={staticAsset(currentUser.image.webp.slice(1))} 
                    alt={'avatar of ' + currentUser.username} 
                    className="avatar comment-header"/>
                <label htmlFor="reply-comment" className="sr-only">Reply to Comment</label>
                <textarea id='reply-comment' 
                    className="comment-content fg-grayish-blue"
                    rows={5} cols={30}
                    value={message}
                    onChange={handleChange}
                >                
                </textarea>
                <div className="action-buttons flex">
                    <button className="rounded-button bg-moderate-blue text-white" name='Confirm'>Reply</button>
                    <button className="rounded-button bg-dark-blue text-white" name='Cancel'>Cancel</button>
                </div>
            </form>
        </section>
    )
}
