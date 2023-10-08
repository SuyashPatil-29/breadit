"use client"
import { useCustomToast } from '@/hooks/use-custom-hooks'
import { toast } from '@/hooks/use-toast'
import { CommentRequest } from '@/lib/validators/comment'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/Button'
import { Label } from './ui/Label'
import { Textarea } from './ui/Textarea'


type CommentProps = {
  postId : string,
  replyToId? : string
}

const CreateComments = ({postId, replyToId}: CommentProps) => {

  const [input , setInput ] = useState<string>("")
  const {loginToast} = useCustomToast()
  const router = useRouter()

  const {mutate : createComment, isLoading : isCreatingComment} = useMutation({
    mutationFn : async ({postId, text ,replyToId} : CommentRequest)=>{
      const payload : CommentRequest = {
        postId,
        text,
        replyToId
      }
      await axios.patch("/api/subreddit/post/comment", payload) 
      return
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          return toast({
            title: "Already unsubscribed",
            description: "You are already unsubscribed to this subreddit",
            variant: "destructive",
          });
        } else if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    },
    onSuccess : ()=>{
      router.refresh();
      setInput("")
    }
  })

  return (
    <div className='grid w-full gap-1.5'>
        <Label htmlFor='comment'>Your Comment</Label>
        <div className="mt-2">
            <Textarea id="comment" value={input} onChange={(e)=>setInput(e.target.value)}
            rows={1} placeholder='Write your comment here...'/>
            <div className="mt-2 flex justify-end">
              <Button type='submit' isLoading={isCreatingComment} disabled={input.length === 0} onClick={()=>createComment({postId, text:input, replyToId})}>Post</Button>
            </div>
        </div>
    </div>
  )
}

export default CreateComments