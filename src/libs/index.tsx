
import type { CommentType, UserType } from "../types"

export function staticAsset(assetName: string): string {
    return `${import.meta.env.BASE_URL}${assetName}`
}


/*
Visit each item in COMMENTS and the nested replies recursively and perform some action given by the CALLBACK.
*/
export function recursiveVisits(comments: CommentType[], 
    callback: (comment: CommentType)=> any): any {
    for(let c of comments) {
        callback(c);
        if(c.replies && c.replies.length > 0) {
            recursiveVisits(c.replies, callback);
        }
    }
}

/*
Look for the given TARGETCOMMENT in a nested array of COMMENTS and make a change by calling the CALLBACK function.
*/
export const updateCommentRecursively = (comments: CommentType[], 
    targetComment: CommentType,
    callback: (comment: CommentType)=> CommentType): CommentType[] => {
        return comments.map(comment =>
            comment === targetComment
            ? callback(comment)
            : { ...comment, replies: updateCommentRecursively(comment.replies, targetComment, callback) } 
        );
};

/*
Look for an array with TARGETCOMMENT and make a change to the array with the CALLBACK function.
*/
export const updateCommentArrayRecursively = (comments: CommentType[], 
    targetComment: CommentType,
    callback: (arr: CommentType[])=> CommentType[]): CommentType[] => {

    return (
        (comments.includes(targetComment) ? callback(comments): [...comments])
            .map(c => c.replies?.length > 0 ? 
                ({...c, replies: updateCommentArrayRecursively(c.replies, targetComment, callback)}) : 
                ({...c}))
    );
};

/*
From JSON data, collect CURRENTUSER, USERS, and COMMENTS. Replace each user description to the 
correspoinding USER object.
*/
export const normalizeData = (data: any): 
    {users: UserType[], comments: CommentType[], currentUser: UserType} => {
    //get all users
    const currentUser = data.currentUser as UserType;
    const users: UserType[] = [];
    users.push(currentUser);
    recursiveVisits(data.comments as CommentType[], (comment)=>{
        if(comment.user && !users.some(existing => existing.username === comment.user.username)) {
            users.push(comment.user);
        }
    });

    recursiveVisits(data.comments as CommentType[], (comment)=> {
        if(!comment.replies) comment.replies = [];
        if(!comment.replyingTo) comment.replyingTo= null;
        const username = comment.user.username;
        let found = users.find(user => user.username === username);
        if(found) comment.user = found;
        const replyTo = comment.replyingTo?.username || comment.replyingTo;
        let found2 = users.find(user => user.username === replyTo);
        if(found2) comment.replyingTo = found2;
        //comment.createdAt = Date.now();
    })
    const comments: CommentType[] = (data.comments as CommentType[]).map(c => ({...c}));
    comments.sort((a, b) => b.score - a.score); //sort by the score
 
    return {users, comments, currentUser};
}



