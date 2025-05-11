import React, { useContext, useEffect, useState } from "react";
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
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log("inside AddCommentCard::handleSubmit");
        event.preventDefault();

        const submitEvent = event.nativeEvent as SubmitEvent;
        const button = submitEvent.submitter as HTMLButtonElement;
        if(button.name === 'Confirm' ) {
            if(message.trim().length > 0) { //prevent an empty message from being sent
                const newcomment: CommentType = {
                    id: nextId,
                    user: currentUser, 
                    content: message, 
                    score: 0,
                    createdAt: Date.now(),
                    replies: [],
                    replyingTo: null
                };
                setNextId(prev => prev + 1);
                setComments(prev => [...prev, newcomment]);
                setMessage('');  
            }
        } else {
            setMessage('');
        }
    };

    return (
        <section className="comment">
            <form onSubmit={handleSubmit} className="newcomment-grid">
                <img src={staticAsset(currentUser.image.webp.slice(1))} 
                    alt={'avatar of ' + currentUser.username} 
                    className="avatar comment-header"/>
                <label htmlFor="comment-content" className="sr-only">Add Comment</label>
                <textarea id='comment-content' 
                    className="comment-content fg-grayish-blue border-slate-200"
                    rows={5} cols={30} 
                    value={message}
                    onChange={handleChange}
                    placeholder="Add a comment...">                
                </textarea>
                <div className="action-buttons flex">
                    <button 
                        id="add-comment-send"
                        disabled={message.trim().length == 0}
                        className="rounded-button bg-moderate-blue text-white" name="Confirm">
                        <label htmlFor="add-comment-send">Send</label>
                    </button>
                    <button 
                        id="add-comment-cancel"
                        disabled={message.trim().length == 0}
                        className="rounded-button bg-dark-blue text-white" name="Cancel">
                        <label htmlFor="add-comment-cancel">Cancel</label>
                    </button>
                </div>
            </form>
        </section>
    )
}
