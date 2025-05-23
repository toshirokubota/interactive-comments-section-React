import React, { useContext } from "react";
import type { CommentContextType, CommentType } from "../types";
import { CommentContext } from "../App";
import { updateCommentArrayRecursively } from "../libs";


export default function DeleteConfirmationModal({comment, setDeleteComment}
    : {
        comment: CommentType,
        setDeleteComment: React.Dispatch<React.SetStateAction<boolean>>
    }
): React.JSX.Element {
    const {setComments}=useContext<CommentContextType>(CommentContext);

    function deleteComment(comment: CommentType) {
        setDeleteComment(false);
        setComments(prev => updateCommentArrayRecursively(
            prev, comment, (arr) => arr.filter(a => a != comment)));
    }
    return (
        <div className="lightbox">
            <div className="delete-comment-card rounded-lg bg-white m-4 p-4">
                <h1 className="text-2xl ">Delete comment</h1>
                <p className="text-sm text-slate-600">
                    Are you sure you want to delete this comment? This will remove the comment and can’t be undone.
                </p>
                <div className="flex items-center justify-between">
                    <button onClick={()=>setDeleteComment(false)} className="rounded-button bg-dark-blue text-white">No Cancel</button>
                    <button onClick={()=>deleteComment(comment)}  className="rounded-button bg-soft-red text-white">Yes Delete</button>
                </div>
            </div>
        </div>
    )
}