import React, { useContext } from "react";
import type { CommentContextType, CommentType } from "../types";
import { CommentContext } from "../App";
import { recursiveSearch } from "../libs";


export default function DeleteConfirmationModal({comment, setDeleteComment}
    : {
        comment: CommentType,
        setDeleteComment: React.Dispatch<React.SetStateAction<boolean>>
    }
): React.JSX.Element {
    const {setComments}=useContext<CommentContextType>(CommentContext);

    function deleteComment(comment: CommentType) {
        // function recursiveSearchAndDeleteion(comments: CommentType[], comment: CommentType) {
        //     if(comments) {
        //         for(let i=0; i < comments.length; ++i) {
        //             comments[i].replies = recursiveSearchAndDeleteion(comments[i].replies, comment);
        //         }
        //         let idx = comments.findIndex(x => x === comment);
        //         console.log('deleteComment:', idx)
        //         if(idx >= 0) {
        //             console.log('deleting...', comment)
        //             return [...comments.slice(0, idx), ...comments.slice(idx + 1)];
        //         } else {
        //             return [...comments];
        //         }
        //     }
        //     return comments;
        // }
        setDeleteComment(false);
        setComments(prev => {
            const arr = recursiveSearch(prev, comment);
            const idx = arr.findIndex(x => x === comment);
            if(idx >= 0) {
                console.log('delete: find the containing array', arr);
                arr.splice(idx, 1);
                return [...prev];
            }
            else return prev;
        });
    }
    return (
        <div className="lightbox">
            <div className="delete-comment-card rounded-lg bg-white">
                <h1 className="text-2xl ">Delete comment</h1>
                <p className="text-sm text-slate-600">
                    Are you sure you want to delete this comment? This will remove the comment and can’t be undone.
                </p>
                <div className="flex items-center justify-between">
                    <button onClick={()=>setDeleteComment(false)} className="px-4">No Cancel</button>
                    <button onClick={()=>deleteComment(comment)}  className="px-4">Yes Delete</button>
                </div>
            </div>
        </div>
    )
}