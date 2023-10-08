"use client";

import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-hooks";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
            return toast({
                title: "Subreddit already exists",
                description: "Please choose another name",
                variant : "destructive"
            })
        }
        else if(err.response?.status === 422){
            return toast({
                title: "Invalid name",
                description: "Please choose a name between 3 and 21 characters",
                variant : "destructive"
            })
        }
        else if(err.response?.status === 401){
            return loginToast()
        }
      }
      toast({
        title : "Something went wrong",
        description : "Please try again later",
        variant : "destructive",  //destructive, success, neutral, info, warning
        action : <Link href="/r/create" className={buttonVariants({variant: "outline"})}>Try Again</Link>
      }
      )
    },
    onSuccess : (data)=>{
        router.push(`/r/${data}`)
    }
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="bg-zinc-500 h-[1px]" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className=" text-xs pb-0">
            Community names including capitalization cannot be changed.
          </p>

          <div className="relative mt-3">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              r/
            </p>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancle
          </Button>
          <Button
            isLoading={isLoading}
            onClick={() => createCommunity()}
            disabled={input.length === 0}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
