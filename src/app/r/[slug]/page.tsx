import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import React from "react";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "../../../../config";
import { notFound } from "next/navigation";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";

interface SubredditPageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: SubredditPageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy : {
          createdAt : 'desc'
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });
  if (!subreddit) return notFound();
  return (
    <div>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name}/>
    </div>
  );
};

export default Page;
