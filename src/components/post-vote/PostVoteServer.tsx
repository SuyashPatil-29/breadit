import { getAuthSession } from '@/lib/authOptions'
import { Post, Vote, VoteType } from '@prisma/client'
import { notFound } from 'next/navigation'
import PostVoteClient from './PostVoteClient'

type PostVoteServerProps = {
    postId: string,
    initialVotesAmt?: number,
    initialVote? : VoteType | null,
    getData? : () => Promise<(Post & {votes: Vote[]}) | null>
}

const PostVoteServer = async ({postId, initialVotesAmt, initialVote, getData}: PostVoteServerProps) => {
  const session = await getAuthSession()
  
  let _votesAmt :number = 0
  let _currentVote :VoteType | null | undefined = undefined

  if(getData){
    const post = await getData()
    if(!post) return notFound()

    _votesAmt = post.votes.reduce((acc, vote)=>{
        if(vote.type === "UP") return acc + 1
        else if(vote.type === "DOWN") return acc - 1
        return acc
    }, 0)

    _currentVote = post.votes.find((vote)=>vote.userId === session?.user.id)?.type

  }else {
    _votesAmt = initialVotesAmt!
    _currentVote = initialVote
  }

  return (
    <div>
        <PostVoteClient postId={postId} initialVote={_currentVote} initialVotesAmt={_votesAmt}/>
    </div>
  )
}

export default PostVoteServer