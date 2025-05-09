import React, { useContext, useEffect, useState } from "react";
import { staticAsset, updateCommentRecursively } from "../libs";
import type { CommentContextType, CommentType, UserType } from "../types";
import UpDownVoter from "./UpDownVoter";
import { CommentContext } from "../App";
import ReplyToCommentCard from "./ReplyToCommentCard";
import EditCommentCard from "./EditCommentCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function CommentCard({comment, currentUser}:
    {
        comment: CommentType,
        currentUser: UserType
    }
): React.JSX.Element {
    const { setComments }=useContext<CommentContextType>(CommentContext);
    const [count, setCount] = useState<number>(comment.score);
    const [deleteComment, setDeleteComment] = useState<boolean>(false);
    const [editComment, setEditComment] = useState<boolean>(false);
    const [replayToComment, setReplyToComment] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(comment.content);
    useEffect(()=>{
        // const updateScoreRecursively = (comments: CommentType[], targetComment: CommentType, count: number): CommentType[] => {
        //     return comments.map(comment =>
        //         comment === targetComment
        //         ? { ...comment, count } // Found the target, add reply
        //         : { ...comment, replies: updateScoreRecursively(comment.replies, targetComment, count) } // Recursively search in replies
        //     );
        // };

        // setComments(prev=> updateScoreRecursively(prev, comment, count))

        setComments(prev=> updateCommentRecursively(prev, comment, (c)=>{
            console.log('updating count ', count)
            return {...c, score:count}
        }));


    }, [count])

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = (event.target as HTMLTextAreaElement).value;
        setMessage(value);
    }
    function updateComment() {
        // const updateContentRecursively = (comments: CommentType[], targetComment: CommentType, content: string): CommentType[] => {
        //     return comments.map(comment =>
        //         comment === targetComment
        //         ? { ...comment, content } // Found the target, add reply
        //         : { ...comment, replies: updateContentRecursively(comment.replies, targetComment, content) } // Recursively search in replies
        //     );
        // };
        setComments(prev=> updateCommentRecursively(prev, comment, (c)=>{
            return {...c, content:message}
        }));
    }


    return (
        <section className="comment">
            <div className="card-grid">
                <UpDownVoter count={count} setCount={setCount} />
                <div className="comment-header flex">
                    <img src={staticAsset(comment.user.image.webp.slice(1))} 
                        alt={'avatar of ' + comment.user.username}
                        className="avatar"
                    />
                    <span className="px-4">{comment.user.username}</span>
                    {comment.user.username === currentUser.username &&
                        <span
                            className="bg-moderate-blue text-white h-6 px-2 rounded-md">
                            you
                        </span>
                    }
                    <span className="px-4">{comment.createdAt}</span>
                </div>

                <div>
                    {comment.user.username === currentUser.username ? 
                        editComment ?
                            <>
                                <button className="fg-soft-red px-4" onClick={() => updateComment()}>
                                    <img src={staticAsset('/images/icon-delete.svg')} alt="delete icon" 
                                        className="icon"
                                        />
                                    Update
                                </button>
                                <button className="fg-moderate-blue px-4" onClick={() => setEditComment(false)}>
                                    <img src={staticAsset('/images/icon-edit.svg')} alt="edit icon" 
                                        className="icon"
                                    />
                                    Cancel
                                </button>
                            </>
                            :
                            <>
                                <button className="fg-soft-red px-4" onClick={() => setDeleteComment(true)}>
                                    <img src={staticAsset('/images/icon-delete.svg')} alt="delete icon" 
                                        className="icon"
                                        />
                                    Delete
                                </button>
                                <button className="fg-moderate-blue px-4" onClick={() => setEditComment(true)}>
                                    <img src={staticAsset('/images/icon-edit.svg')} alt="edit icon" 
                                        className="icon"
                                    />
                                    Edit
                                </button>
                            </>
                        
                        :
                        <span className="fg-moderate-blue px-4" onClick={() => setReplyToComment(true)}>
                        <img src={staticAsset('/images/icon-reply.svg')} alt="reply icon" 
                            className="icon"
                        />
                        Reply
                    </span>
                }
                </div>
                <textarea 
                    className="comment-content" 
                    disabled={!editComment}
                    value={message}
                    onChange={handleChange}>
                </textarea>
            </div>
            {deleteComment && <DeleteConfirmationModal comment={comment} setDeleteComment={setDeleteComment}/>}
            {/* {editComment && <EditCommentCard comment={comment} setEditComment={setEditComment}/>} */}
            {replayToComment && <ReplyToCommentCard comment={comment} setReplyToComment={setReplyToComment}/>}

            <div>
            {
                comment.replies.map(reply =>
                    <CommentCard key={reply.id} comment={reply} currentUser={currentUser}/>
                )
            }
            </div>
        </section>
    )
}