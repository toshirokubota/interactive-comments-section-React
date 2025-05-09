
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
