"use client";
import LinkAccountButton from "@/components/ui/link-account-button";
import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const { userId } = useAuth();
  return (
    <div>
      <LinkAccountButton />
    
    </div>
  );
}
