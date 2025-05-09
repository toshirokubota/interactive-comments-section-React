import React, { useContext, useState } from "react";
import type { CommentContextType, CommentType } from "../types";
import { staticAsset } from "../libs";
import { CommentContext } from "../App";

export default function ReplyToCommentCard({comment, setReplyToComment}: 
    {
        comment:CommentType,
        setReplyToComment: React.Dispatch<React.SetStateAction<boolean>>
    }): React.JSX.Element {

    const {currentUser, setComments, setFlatComments}=useContext<CommentContextType>(CommentContext);
    const [message, setMessage] = useState<string>('@' + comment.user.username + ' '    );
    
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
            const reply: CommentType = {
                id: 0, //Math.floor(Math.random() * 1000), //pseudo random number, temporary fix
                user: currentUser, 
                content: message, 
                score: 0,
                createdAt: Date.now().toString(),
                replies: [],
                replyingTo: comment.user
            };

            const addReplyRecursively = (comments: CommentType[], targetComment: CommentType, reply: CommentType): CommentType[] => {
                return comments.map(comment =>
                  comment === targetComment
                    ? { ...comment, replies: [...comment.replies, reply] } // Found the target, add reply
                    : { ...comment, replies: addReplyRecursively(comment.replies, targetComment, reply) } // Recursively search in replies
                );
              };
              
            setComments(prev => addReplyRecursively(prev, comment, reply));

            // setComments(prev =>
            //     prev.map(c =>
            //       c === comment // Finding the comment to update
            //         ? { ...c, replies: [...c.replies, reply] } // Creating new reply array
            //         : c
            //     )
            //   );
              
            // setComments(prev => {
            //     reply.id = Math.floor(Math.random() * 1000);
            //     comment.replies.push(reply);
            //     console.log('added reply = ', reply, 'to comment = ', comment);
            //     return [...prev];
            // });
            setFlatComments(prev => {return [...prev, reply];});
        } 
        setReplyToComment(false);        
    }

    return (
        <form onSubmit={(e)=> {handleSubmit(e);}}>
            <img src={staticAsset(currentUser.image.webp.slice(1))} alt={'avatar of ' + currentUser.username} className="avatar"/>
            <label htmlFor="reply-comment" className="sr-only">Reply to Comment</label>
            <textarea id='reply-comment' 
                rows={5} cols={30}
                value={message}
                onChange={handleChange}
            >                
            </textarea>
            <button className="px-4" name='Confirm'>Reply</button>
            <button className="px-4" name='Cancel'>Cancel</button>
        </form>
    )
}