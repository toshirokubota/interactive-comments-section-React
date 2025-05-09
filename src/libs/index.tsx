
import type { CommentType, UserType } from "../types"

export function staticAsset(assetName: string): string {
    return `${import.meta.env.BASE_URL}${assetName}`
}

// export function collectUniqueUsers(comments: CommentType[]): UserType[] {
//     const users: UserType[] = comments.map(comment => comment.user);
//     const uniqueUsers: UserType[] = [];
//     for(let user of users) {
//         if(!uniqueUsers.some(existing => existing.username === user.username)) {
//             uniqueUsers.push(user);
//         }
//     }

//     return uniqueUsers;
// }

/*
Visit each comment (nested replies included) recursively.
*/
export function recursiveVisits(comments: CommentType[], 
    callback: (comment: CommentType)=> void): void {
    for(let c of comments) {
        callback(c);
        if(c.replies && c.replies.length > 0) {
            recursiveVisits(c.replies, callback);
        }
    }
}

/*
Look for the given COMMENT in a nested array of COMMENTS and returns the array
that contains COMMENT.
*/
// export function recursiveSearchOfContainingArray(comments: CommentType[], comment: CommentType): CommentType[] {
//     for(let i=0; i < comments.length; ++i) {
//         const arr = recursiveSearchOfContainingArray(comments[i].replies, comment);
//         if(arr.length > 0) return arr;
//     }
//     let idx = comments.findIndex(x => x === comment);
//     if(idx >= 0) return comments;
//     else return [];
// }


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
        // if(!comments || comments.length == 0) return [];
        // else {
        // return updateCommentArrayRecursively(
        //     comments.map(c => ({...c, replies: updateCommentArrayRecursively(c.replies, targetComment, callback)})),
        //     targetComment, callback);
        // }
    return (
        comments.includes(targetComment) ? 
            callback(comments):
            comments.map(c => { c.replies = updateCommentArrayRecursively(c.replies, targetComment, callback); return c})
    );
};

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
    // for(let comment of data.comments) {
    //     const user = comment.user;
    //     if(!users.some(existing => existing.username === user.username)) {
    //     users.push(user);
    //     }
    //     for(let reply of comment.replies) {
    //     const user = reply.user;
    //     if(!users.some(existing => existing.username === user.username)) {
    //         users.push(user);
    //     }  
    //     }
    // }

    //normalize comment. done recursively
    const normalizeComment = (comment: any):CommentType => {
        const username = comment?.user?.username;
        
        let newcomment:CommentType = {...comment};
        if(!newcomment.replies) newcomment.replies = [];
        if(!newcomment.replyingTo) newcomment.replyingTo= null;
        let user0 = users.find(user => user.username === username);
        if(user0) newcomment.user = user0;
        if(comment.replies) {
            for(let i = 0; i < comment.replies.length; i++) {
                let reply = comment.replies[i];
                newcomment.replies[i] = normalizeComment(reply);
            }
        }
        return newcomment;
    }
    const comments: CommentType[] = [];
    for(let comment of data.comments) {
        comments.push(normalizeComment(comment));
    }

    return {users, comments, currentUser};
}



