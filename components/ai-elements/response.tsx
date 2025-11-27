"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ResponseProps {
  children: string;
  className?: string;
}

export const Response = ({ children, className }: ResponseProps) => {
  // 1. THE CLEANING LAYER
  // This removes the ```markdown wrapper if the AI stubbornly adds it.
  const cleanContent = children
    .replace(/^```markdown\s*/, "") // Remove starting ```markdown
    .replace(/^```\s*/, "")         // Remove starting ```
    .replace(/```\s*$/, "");        // Remove ending ```

  return (
    <div className={`text-gray-800 dark:text-gray-200 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // --- Brand Headers ---
          h1: ({ ...props }) => (
            <h1 className="text-3xl font-bold text-[#003366] mt-6 mb-4" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-2xl font-bold text-[#003366] mt-6 mb-3 border-b border-gray-200 pb-2" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-xl font-bold text-[#003366] mt-4 mb-2" {...props} />
          ),

          // --- Lists (Crucial for your guidelines) ---
          ul: ({ ...props }) => (
            <ul className="list-disc ml-6 space-y-2 my-4 text-gray-700 dark:text-gray-300" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal ml-6 space-y-2 my-4 text-gray-700 dark:text-gray-300" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="pl-1" {...props} />
          ),

          // --- Emphasis & Text ---
          strong: ({ ...props }) => (
            <strong className="font-extrabold text-[#003366]" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="mb-4 whitespace-pre-line" {...props} />
          ),
          
          // --- Blockquotes (often used for notes) ---
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-[#FFCC00] pl-4 italic bg-gray-50 dark:bg-gray-800 py-2 rounded-r" {...props} />
          ),
        }}
      >
        {/* 2. PASS THE CLEANED CONTENT */}
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};
