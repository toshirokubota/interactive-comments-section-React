import React, { useContext, useEffect, useState } from "react";
import { staticAsset } from "../libs";
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
    useEffect(()=>{
        setComments(prev=> prev.map(c => 
            c === comment ? {...c, score: count}: c
        ))
    }, [count])



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

                <div className="action-icons">
                    {comment.user.username === currentUser.username ? 
                        <>
                            <span className="fg-soft-red px-4" onClick={() => setDeleteComment(true)}>
                                <img src={staticAsset('/images/icon-delete.svg')} alt="delete icon" 
                                    className="icon"
                                    />
                                Delete
                            </span>
                            <span className="fg-moderate-blue px-4" onClick={() => setEditComment(true)}>
                                <img src={staticAsset('/images/icon-edit.svg')} alt="edit icon" 
                                    className="icon"
                                />
                                Edit
                            </span>
                        </>:
                        <span className="fg-moderate-blue px-4" onClick={() => setReplyToComment(true)}>
                            <img src={staticAsset('/images/icon-reply.svg')} alt="reply icon" 
                                className="icon"
                            />
                            Reply
                        </span>
                    }
                </div>
                <p className="comment-content">
                    {comment.content}
                </p>
            </div>
            {deleteComment && <DeleteConfirmationModal comment={comment} setDeleteComment={setDeleteComment}/>}
            {editComment && <EditCommentCard comment={comment} setEditComment={setEditComment}/>}
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