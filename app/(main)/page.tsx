"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <Button onClick={() => console.log("Click Me")}>Click Me</Button>
      </main>
    </div>
  );
}
