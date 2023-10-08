"use client";

import { useCustomToast } from "@/hooks/use-custom-hooks";
import { toast } from "@/hooks/use-toast";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "./ui/Button";

type SubscribeLeaveToggleProps = {
  subredditId: string;
  isSubscribed: boolean;
  subredditName: string;
};

const SubscribeLeaveToggle = ({
  subredditId,
  isSubscribed,
  subredditName,
}: SubscribeLeaveToggleProps) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubscribing } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      };
      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          return toast({
            title: "Already subscribed",
            description: "You are already subscribed to this subreddit",
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
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Subscribed successfully",
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubscribing } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      };
      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
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
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Unsubscribed successfully",
        description: `You are now unsubscribed from r/${subredditName}`,
        variant: "destructive",
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => unsubscribe()}
      isLoading={isUnsubscribing}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className=" w-full mt-1 mb-4"
      isLoading={isSubscribing}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
