import React, { useContext } from "react";
import type { CommentContextType, CommentType } from "../types";
import { staticAsset } from "../libs";
import { CommentContext } from "../App";


export default function EditCommentCard({comment, setEditComment}: 
        {
            comment:CommentType,
            setEditComment: React.Dispatch<React.SetStateAction<boolean>>
        }): React.JSX.Element {
    const {currentUser}=useContext<CommentContextType>(CommentContext);
    return (
        <form>
            <img src={staticAsset(currentUser.image.webp.slice(1))} alt={'avatar of ' + currentUser.username} className="avatar"/>
            <label htmlFor="reply-comment" className="sr-only">Edit Comment</label>
            <textarea id='reply-comment' rows={5} cols={30} placeholder="Add reply comments">                
            </textarea>
            <button onClick={()=>setEditComment(false)} className="px-4">Reply</button>
            <button onClick={()=>setEditComment(false)} className="px-4">Cancel</button>
        </form>
    )
}