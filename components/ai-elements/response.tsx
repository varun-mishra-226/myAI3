"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown, defaultRehypePlugins } from "streamdown";
import { rehypeSingleCharLink } from "@/lib/rehype-single-char-link";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    // FIX: Added 'prose', 'prose-neutral', and 'dark:prose-invert'
    // This tells Tailwind to style the markdown (Headings, bold, lists)
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Streamdown
        className={cn(
          "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          className
        )}
        rehypePlugins={[
          defaultRehypePlugins.raw,
          defaultRehypePlugins.katex,
          rehypeSingleCharLink,
        ]}
        {...props}
      />
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
