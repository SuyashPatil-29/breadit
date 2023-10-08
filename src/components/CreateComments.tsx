"use client"
import React, { useState } from 'react'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { CommentRequest } from '@/lib/validators/comment'


type Props = {}

const CreateComments = (props: Props) => {

  const [input , setInput ] = useState<string>("")

  const {mutate : createComment} = useMutation({
    mutationFn : async ({postId, text ,replyToId} : CommentRequest)=>{
      const payload : CommentRequest = {
        postId,
        text,
        replyToId
      }
      const {data} = await axios.patch("/api/subreddit/post/comment", payload) 
      return
    },
    onError : (error)=>{},
    onSuccess : (data)=>{}
  })

  return (
    <div className='grid w-full gap-1.5'>
        <Label htmlFor='comment'>Your Comment</Label>
        <div className="mt-2">
            <Textarea id="comment" value={input} onChange={(e)=>setInput(e.target.value)}
            rows={1} placeholder='Write your comment here...'/>
            <div className="mt-2 flex justify-end">
              <Button type='submit'>Post</Button>
            </div>
        </div>
    </div>
  )
}

export default CreateComments