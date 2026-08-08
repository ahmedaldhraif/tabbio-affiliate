import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@refref/ui/components/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="grid min-h-screen place-items-center bg-[#030d28] p-6 text-center text-white"
    >
      <div>
        <p className="text-sm font-semibold text-[#bdaeff]">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          This demo page is not here.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          Return to the public partner page or open the local partner workspace.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button
            asChild
            variant="secondary"
            className="h-12 rounded-full px-5"
          >
            <Link href="/">
              <ArrowLeft />
              Public page
            </Link>
          </Button>
          <Button
            asChild
            className="h-12 rounded-full bg-[#5a2aff] px-5 hover:bg-[#512eff]"
          >
            <Link href="/partner">Partner demo</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
