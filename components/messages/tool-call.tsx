import { ToolCallPart, ToolResultPart } from "ai";
import { Globe, Search, Wrench, Image as ImageIcon } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";

// --- Types ---
export interface ToolDisplay {
  call_label: string;
  call_icon: React.ReactNode;
  result_label: string;
  result_icon: React.ReactNode;
  formatArgs?: (toolName: string, input: unknown) => string;
};

// --- Helper Functions ---
function formatWebSearchArgs(_: string, input: unknown): string {
  try {
    if (typeof input !== 'object' || input === null) return "";
    const args = input as Record<string, unknown>;
    return args.query ? String(args.query) : "";
  } catch { return ""; }
}

function formatImageGenArgs(_: string, input: unknown): string {
  try {
    if (typeof input !== 'object' || input === null) return "";
    const args = input as Record<string, unknown>;
    return args.prompt ? `"${String(args.prompt).slice(0, 30)}..."` : "";
  } catch { return ""; }
}

// --- Configuration Map ---
const TOOL_DISPLAY_MAP: Record<string, ToolDisplay> = {
  webSearch: {
    call_label: "Searching...",
    call_icon: <Search className="w-4 h-4" />,
    result_label: "Searched Web",
    result_icon: <Globe className="w-4 h-4 text-blue-500" />,
    formatArgs: formatWebSearchArgs,
  },
  generateImage: {
    call_label: "Designing image...",
    call_icon: <ImageIcon className="w-4 h-4" />,
    result_label: "Image Generated",
    result_icon: <ImageIcon className="w-4 h-4 text-green-600" />,
    formatArgs: formatImageGenArgs,
  },
};

const DEFAULT_TOOL_DISPLAY: ToolDisplay = { 
  call_label: "Using tool", 
  call_icon: <Wrench className="w-4 h-4" />, 
  result_label: "Tool Finished", 
  result_icon: <Wrench className="w-4 h-4" /> 
};

// --- Utility Functions ---
function extractToolName(part: ToolCallPart | ToolResultPart): string | undefined {
  // 1. Check for explicit toolName property FIRST
  if ('toolName' in part && part.toolName) return part.toolName;
  
  // 2. Fallback to type slicing
  const partWithType = part as unknown as { type?: string };
  if (partWithType.type && partWithType.type.startsWith("tool-")) {
    return partWithType.type.slice(5);
  }
  return undefined;
}

function formatToolArguments(toolName: string, input: unknown, toolDisplay?: ToolDisplay): string {
  if (toolDisplay?.formatArgs) return toolDisplay.formatArgs(toolName, input);
  return "";
}

// --- Components ---

export function ToolCall({ part }: { part: ToolCallPart }) {
  const { input } = part;
  const toolName = extractToolName(part);
  const toolDisplay = toolName ? (TOOL_DISPLAY_MAP[toolName] || DEFAULT_TOOL_DISPLAY) : DEFAULT_TOOL_DISPLAY;
  const formattedArgs = formatToolArguments(toolName || "", input, toolDisplay);

  return (
    <div className="flex items-center gap-2 py-1 text-sm text-gray-500">
      {toolDisplay.call_icon}
      <Shimmer duration={1.5} className="font-medium">{toolDisplay.call_label}</Shimmer>
      <span className="opacity-50 truncate max-w-[200px]">{formattedArgs}</span>
    </div>
  );
}

export function ToolResult({ part }: { part: ToolResultPart }) {
  // FIX: Safely extract 'result' regardless of TypeScript strictness
  const anyPart = part as any;
  const result = anyPart.result || anyPart.output; 

  const toolName = extractToolName(part);
  const toolDisplay = toolName ? (TOOL_DISPLAY_MAP[toolName] || DEFAULT_TOOL_DISPLAY) : DEFAULT_TOOL_DISPLAY;

  // --- IMAGE RENDERING ---
  if (toolName === 'generateImage') {
    if (result?.error) {
       return <div className="text-red-500 text-sm">❌ {result.error}</div>;
    }
    // Check if result exists and has imageUrl
    if (result?.imageUrl) {
      return (
        <div className="my-3">
            <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 shadow-md">
