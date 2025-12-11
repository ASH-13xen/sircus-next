import StreamVideoProvider from "@/providers/StreamClientProvider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
}
