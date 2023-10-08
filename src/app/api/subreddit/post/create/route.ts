import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/posts";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId, title, content } = PostValidator.parse(body);

    // check if user has already subscribed to subreddit
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response(
        "You cannot post to a subreddit you're not subscribed to",
        {
          status: 400,
        }
      );
    }

    // create subreddit and associate it with the user
    await db.post.create({
      data: {
        subredditId,
        title,
        content,
        authorId: session.user.id,
      },
    });

    return new Response("Success", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not post to subreddit at this time. Please try again later",
      { status: 500 }
    );
  }
}
