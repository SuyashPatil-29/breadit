import Editor from '@/components/Editor'
import { Button } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'

type SubmitPageProps = {
    params : {
        slug : string
    }
}

const page = async ({params: {slug}}: SubmitPageProps) => {
    
  const subreddit = await db.subreddit.findUnique({
    where :{
        name : slug
    }
  })

  if(!subreddit) return notFound()

  return (
    <div className='flex flex-col items-start gap-6'>
        <div className='border-b border-gray-300 pb-2'>
            <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
                <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-gray-900'>Create Posts</h3>
                <p className='ml-2 mt-2 truncate text-sm text-gray-500'>in r/{subreddit.name}</p>
            </div>
        </div>

        {/* form */}
        <Editor subredditId={subreddit.id}/>
    </div>
  )
}

export default page