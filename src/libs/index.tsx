
import type { CommentType, UserType } from "../types"

export function staticAsset(assetName: string): string {
    return `${import.meta.env.BASE_URL}${assetName}`
}

export function collectUniqueUsers(comments: CommentType[]): UserType[] {
    const users: UserType[] = comments.map(comment => comment.user);
    const uniqueUsers: UserType[] = [];
    for(let user of users) {
        if(!uniqueUsers.some(existing => existing.username === user.username)) {
            uniqueUsers.push(user);
        }
    }

    return uniqueUsers;
}

/*
Look for the given COMMENT in a nested array of COMMENTS and returns the array
that contains COMMENT.
*/
export function recursiveSearch(comments: CommentType[], comment: CommentType): CommentType[] {
    for(let i=0; i < comments.length; ++i) {
        const arr = recursiveSearch(comments[i].replies, comment);
        if(arr.length > 0) return arr;
    }
    let idx = comments.findIndex(x => x === comment);
    if(idx >= 0) return comments;
    else return [];
}

export const updateCommentRecursively = (comments: CommentType[], 
        targetComment: CommentType,
        callback: (comment: CommentType)=> CommentType): CommentType[] => {

        return comments.map(comment =>
            comment === targetComment
            ? callback(comment)
            : { ...comment, replies: updateCommentRecursively(comment.replies, targetComment, callback) } 
        );
};

