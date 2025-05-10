import React, { useContext, useState } from "react";
import type { CommentContextType, CommentType } from "../types";
import { staticAsset } from "../libs";
import { CommentContext } from "../App";


export default function EditCommentCard({comment, setEditComment}: 
        {
            comment:CommentType,
            setEditComment: React.Dispatch<React.SetStateAction<boolean>>
        }): React.JSX.Element {
    const {currentUser, setComments}=useContext<CommentContextType>(CommentContext);
    const [message, setMessage] = useState<string>(comment.content);

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
            const editCommentRecursively = (comments: CommentType[], targetComment: CommentType, message: string): CommentType[] => {
                return comments.map(comment =>
                  comment === targetComment
                    ? { ...comment, content: message } // Found the target, add reply
                    : { ...comment, replies: editCommentRecursively(comment.replies, targetComment, message) } // Recursively search in replies
                );
              };
            setComments(prev => editCommentRecursively(prev, comment, message));
        } 
        setEditComment(false);        
    }

    return (
        <form onSubmit={handleSubmit}>
            <img src={staticAsset(currentUser.image.webp.slice(1))} alt={'avatar of ' + currentUser.username} className="avatar"/>
            <label htmlFor="reply-comment" className="sr-only">Edit Comment</label>
            <textarea id='reply-comment' 
                rows={5} cols={30} 
                value={message}
                onChange={handleChange}>                
            </textarea>
            <div className="action-buttons">
                <button className="px-4" name="Confirm">Update</button>
                <button className="px-4" name="Cancel">Cancel</button>
            </div>
        </form>
    )
}