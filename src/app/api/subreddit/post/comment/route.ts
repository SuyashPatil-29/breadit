import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req:Request){
    try {
        const session = await getAuthSession()
        if(!session) return new Response("Unauthorized", {status: 401})

        const body = await req.json()
        const {postId,text,replyToId} = CommentValidator.parse(body)

        await db.comment.create({
            data : {
                postId,
                text,
                authorId : session.user.id,
                replyToId
            }  
        })
        
        return new Response("Comment posted successfully", {status: 200})
      }
     catch (error) {
        if (error instanceof z.ZodError) {
          return new Response("Invalid Data Passed", { status: 400 });
        }
    
        return new Response(
          "Could not post the comment at this time. Please try again later",
          { status: 500 }
        );
      }
    }