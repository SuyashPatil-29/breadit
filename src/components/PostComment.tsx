"use client"

import React, { useRef } from 'react'
import UserAvatar from './UserAvatar'
import { CommentVote, User } from '@prisma/client'
import { formatTimeToNow } from '@/lib/utils'

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
  }


type CommentProps = {
    comment : ExtendedComment
}

const PostComment = ({comment}: CommentProps) => {

    const commentRef = useRef<HTMLDivElement>(null)
  return (
    <div className='flex flex-col' ref={commentRef} >
        <div className='flex items-center'>
            <UserAvatar user={{
                name : comment.author.name ?? null,
                image : comment.author.image ?? null
            }}
            className='h-6 w-6'
            />

            <div className='ml-2 flex items-start gap-x-2'>
                <p className='text-sm font-medium text-zinc-900'>u/
                    {comment.author.username}
                </p>

            </div>
        </div>
        <p className='text-sm text-zinc-900 mt-2'>{comment.textContent}</p>
    </div>
  )
}

export default PostComment