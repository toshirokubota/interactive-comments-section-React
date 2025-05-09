import React, { useContext, useState } from "react";
import type { CommentContextType, CommentType } from "../types";
import { staticAsset } from "../libs";
import { CommentContext } from "../App";


export default function AddCommentCard(): React.JSX.Element {
    const {currentUser, setComments}=useContext<CommentContextType>(CommentContext);
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
            id: Math.floor(Math.random() * 1000), //pseudo random number, temporary fix
            user: currentUser, 
            content: message, 
            score: 0,
            createdAt: 'Now',
            replies: [],
            replyingTo: null
        };

        if(button.name === 'Confirm' ) {
            setComments(prev => [...prev, newcomment]);
        } 
        setMessage('');        
    }

    return (
        <form onSubmit={handleSubmit}>
            <img src={staticAsset(currentUser.image.webp.slice(1))} alt={'avatar of ' + currentUser.username} className="avatar"/>
            <label htmlFor="add-comment" className="sr-only">Edit Comment</label>
            <textarea id='add-comment' 
                rows={5} cols={30} 
                value={message}
                onChange={handleChange}>                
            </textarea>
            <button className="px-4" name="Confirm">Send</button>
            <button className="px-4" name="Cancel">Cancel</button>
        </form>
    )
}
