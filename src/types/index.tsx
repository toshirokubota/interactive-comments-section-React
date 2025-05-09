
export type CommentType = {
    id: number,
    content: string,
    createdAt: string,
    score: number,
    user: UserType,
    replies: CommentType[],
    replayingTo: UserType | null
}

export type UserType = {
    image: {png: string, webp: string},
    username: string
}

export interface CommentContextType {
    comments: CommentType[],
    users: UserType[],
    setComments: React.Dispatch<React.SetStateAction<CommentType[]>>
    setUsers: React.Dispatch<React.SetStateAction<UserType[]>>
    currentUser?: UserType,
    setCurrentUser: React.Dispatch<React.SetStateAction<UserType | undefined>>
}

