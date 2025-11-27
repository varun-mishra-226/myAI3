"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ResponseProps {
  children: string; 
  className?: string;
}

export const Response = ({ children, className }: ResponseProps) => {
  return (
    <div className={`text-gray-800 dark:text-gray-200 leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // --- Brand Headers ---
          h1: ({ ...props }) => <h1 className="text-2xl font-bold text-[#003366] mt-6 mb-3" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold text-[#003366] mt-5 mb-2 border-b border-gray-200 pb-1" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold text-[#003366] mt-4 mb-2" {...props} />,
          
          // --- Lists ---
          ul: ({ ...props }) => <ul className="list-disc ml-5 space-y-1 my-3" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal ml-5 space-y-1 my-3" {...props} />,
          li: ({ ...props }) => <li className="pl-1" {...props} />,
          
          // --- Formatting ---
          strong: ({ ...props }) => <strong className="font-bold text-blue-900" {...props} />,
          p: ({ ...props }) => <p className="mb-3" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
