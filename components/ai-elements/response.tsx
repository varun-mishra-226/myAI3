"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ResponseProps {
  children: string;
  className?: string;
}

export const Response = ({ children, className }: ResponseProps) => {
  // 1. Clean up excessive newlines that might cause gaps
  const cleanContent = children
    .replace(/^```markdown\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/```\s*$/, "")
    .replace(/\n{3,}/g, "\n\n"); // Replace 3+ newlines with just 2

  return (
    <div className={`text-gray-800 dark:text-gray-200 text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // --- HEADINGS (Tighter spacing) ---
          h1: ({ ...props }) => (
            <h1 className="text-2xl font-bold text-[#003366] mt-4 mb-2" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-lg font-bold text-[#003366] mt-4 mb-2 border-b border-gray-200 pb-1" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-base font-bold text-[#003366] mt-3 mb-1" {...props} />
          ),

          // --- LISTS (Remove vertical gaps) ---
          ul: ({ ...props }) => (
            <ul className="list-disc ml-5 my-2 space-y-1" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal ml-5 my-2 space-y-1" {...props} />
          ),
          // This matches the screenshot issue: if a list item has a paragraph, kill the margin
          li: ({ children, ...props }) => (
            <li className="pl-1 [&>p]:mb-0" {...props}>
              {children}
            </li>
          ),

          // --- PARAGRAPHS (Reduced bottom margin) ---
          p: ({ ...props }) => (
            <p className="mb-2 last:mb-0" {...props} />
          ),

          // --- BOLD ---
          strong: ({ ...props }) => (
            <strong className="font-bold text-[#003366]" {...props} />
          ),
          
          // --- BLOCKQUOTE ---
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-[#FFCC00] pl-4 py-1 my-2 italic bg-gray-50 text-gray-600" {...props} />
          ),
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};
