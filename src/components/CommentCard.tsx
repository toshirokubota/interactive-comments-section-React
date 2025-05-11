import React, { useContext, useEffect, useState } from "react";
import { staticAsset, updateCommentRecursively } from "../libs";
import type { CommentContextType, CommentType, UserType } from "../types";
import UpDownVoter from "./UpDownVoter";
import { CommentContext } from "../App";
import ReplyToCommentCard from "./ReplyToCommentCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { formatDistanceToNow } from "date-fns";

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
        setComments(prev=> {
            let updated = updateCommentRecursively(prev, comment, (c)=>{
                return {...c, score:count}
            });
            updated.sort((a,b)=>b.score - a.score); //sort by the score
            return updated;
        });
    }, [count])

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = (event.target as HTMLTextAreaElement).value;
        setMessage(value);
    }
    function updateComment() {
        setComments(prev=> updateCommentRecursively(prev, comment, (c)=>{
            return {...c, content:message}
        }));
    }

    function styleMessage(message: string): React.JSX.Element {
        const replyingTo:UserType|null = comment.replyingTo; 
        if(replyingTo) {
            const searchStr:string = '@' + replyingTo.username;
            const idx: number = message.indexOf(searchStr);
            if(idx >= 0) {
                return (
                    <>
                        <span>{message.slice(0,idx)}</span>
                        <span className="fg-moderate-blue">{message.slice(idx, idx+searchStr.length)}</span>
                        <span>{message.slice(idx + searchStr.length)}</span>
                    </>
                );
            } else {
                return (
                    <>
                        <span className="fg-moderate-blue">{searchStr} </span>
                        <span>{message}</span>
                    </>
                )
            }
        } 
        return <span>{message}</span>;
    }

    return (
        <section className={"comment " + (comment.replyingTo ? 'indent': '')}>
            <div className={"card-grid " + (comment.replyingTo ? 'indent': '')}>
                <UpDownVoter count={count} setCount={setCount} />
                <div className="comment-header flex">
                    <img src={staticAsset(comment.user.image.webp.slice(1))} 
                        alt={'avatar of ' + comment.user.username}
                        className="avatar"
                    />
                    <span className="px-4 fg-dark-blue font-medium">{comment.user.username}</span>
                    {comment.user.username === currentUser.username &&
                        <span
                            className="bg-moderate-blue text-white h-6 px-2 rounded-md">
                            you
                        </span>
                    }
                    <span className="px-4 fg-grayish-blue">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </span>
                </div>

                <div className='action-buttons'>
                    {comment.user.username === currentUser.username ? 
                        editComment ?
                            <>
                                <button className="fg-soft-red px-4" onClick={() => {updateComment(); setEditComment(false);}}>
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
                        <button className="fg-moderate-blue px-4" onClick={() => setReplyToComment(true)}>
                            <img src={staticAsset('/images/icon-reply.svg')} alt="reply icon" 
                                className="icon"/>
                            Reply
                        </button>
                }
                </div>
                {editComment ? 
                        <textarea
                            className="comment-content fg-grayish-blue"
                            value={message}
                            rows={4}
                            onChange={handleChange}
                        >
                        </textarea>
                    :
                        <p className="comment-content fg-grayish-blue min-h-24 overflow-hidden">
                            {styleMessage(message)}
                        </p>
                }
            </div>
            {deleteComment && <DeleteConfirmationModal comment={comment} setDeleteComment={setDeleteComment}/>}
            {replayToComment && <ReplyToCommentCard comment={comment} setReplyToComment={setReplyToComment}/>}
        </section>
    )
}