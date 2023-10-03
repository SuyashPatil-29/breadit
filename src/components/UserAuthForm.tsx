"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps {
  className?: string;
}

const UserAuthForm = ({ className }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {toast} = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      throw new Error("Google login not implemented yet");  
      await signIn("google");
    } catch (error) {
        toast({
            title: "There was a problem",
            description: "There was an error logging you in. Please try again later",
            variant: "destructive"
        })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <Button
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
