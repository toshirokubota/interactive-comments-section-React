import React, { useContext, useState } from "react";
import type { CommentContextType, CommentType } from "../types";
import { staticAsset } from "../libs";
import { CommentContext } from "../App";


export default function AddCommentCard(): React.JSX.Element {
    const {currentUser, setComments, nextId, setNextId}=useContext<CommentContextType>(CommentContext);
    const [message, setMessage] = useState<string>('');

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = (event.target as HTMLTextAreaElement).value;
        setMessage(value);
    }
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        console.log("inside handleSubmit", event);
        event.preventDefault();

        const button = event.nativeEvent.submitter as HTMLButtonElement;
        const newcomment: CommentType = {
            id: nextId,
            user: currentUser, 
            content: message, 
            score: 0,
            createdAt: 'Now',
            replies: [],
            replyingTo: null
        };
        setNextId(prev => prev + 1);
        if(button.name === 'Confirm' ) {
            setComments(prev => [...prev, newcomment]);
        } 
        setMessage('');        
    }

    return (
        <section className="comment">
            <form onSubmit={handleSubmit} className="newcomment-grid">
                <img src={staticAsset(currentUser.image.webp.slice(1))} 
                    alt={'avatar of ' + currentUser.username} 
                    className="avatar comment-header"/>
                <label htmlFor="comment-content" className="sr-only">Edit Comment</label>
                <textarea id='comment-content' 
                    className="comment-content fg-grayish-blue"
                    rows={5} cols={30} 
                    value={message}
                    onChange={handleChange}>                
                </textarea>
                <div className="action-buttons flex">
                    <button className="rounded-button bg-moderate-blue text-white" name="Confirm">Send</button>
                    <button className="rounded-button bg-dark-blue text-white" name="Cancel">Cancel</button>
                </div>
            </form>
        </section>
    )
}
