"use client"
import { useCustomToast } from '@/hooks/use-custom-hooks'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'

type PostClientProps = {
    postId :string
    initialVotesAmt : number
    initialVote? : VoteType | null
}

const PostVoteClient = ({postId,initialVotesAmt,initialVote}: PostClientProps) => {

  const {loginToast} = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)  
  const [currentVote, setCurrentVote] = useState(initialVote)
  const previousVote = usePrevious(currentVote)

  useEffect(()=>{
    setCurrentVote(initialVote)
  },[initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId: postId,
      }

      await axios.patch('/api/subreddit/post/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      // reset current vote
      setCurrentVote(previousVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your vote was not registered. Please try again.',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(type)
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })



  return (
    <div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
        <Button onClick={()=>vote("UP")} size="sm" variant="ghost" aria-label='upvote'><ArrowBigUp className={cn("h-5 w-5 text-zinc-700", {"text-emerald-500 fill-emerald-500" : currentVote === "UP"})}/></Button>
        <p className='text-center py-2 font-medium text-sm text-zinc-900'>{votesAmt}</p>
        <Button onClick={()=>vote("DOWN")} size="sm" variant="ghost" aria-label='downvote'><ArrowBigDown className={cn("h-5 w-5 text-zinc-700", {"text-red-500 fill-red-500" : currentVote === "DOWN"})}/></Button>
    </div>
  )
}

export default PostVoteClient