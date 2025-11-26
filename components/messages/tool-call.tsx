import { ToolCallPart, ToolResultPart } from "ai";
import { Book, Globe, Search, Presentation, Wrench, Image as ImageIcon, Loader2 } from "lucide-react";
import { Shimmer } from "../ai-elements/shimmer";

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
  } catch {
    return "";
  }
}

function formatImageGenArgs(_: string, input: unknown): string {
  try {
    if (typeof input !== 'object' || input === null) return "";
    const args = input as Record<string, unknown>;
    return args.prompt ? `"${String(args.prompt).slice(0, 30)}..."` : "";
  } catch {
    return "";
  }
}

// --- Configuration Map ---

const TOOL_DISPLAY_MAP: Record<string, ToolDisplay> = {
  webSearch: {
    call_label: "Searching the web",
    call_icon: <Search className="w-4 h-4" />,
    result_label: "Searched the web",
    result_icon: <Globe className="w-4 h-4" />,
    formatArgs: formatWebSearchArgs,
  },
  generateImage: {
    call_label: "Creating image",
    call_icon: <ImageIcon className="w-4 h-4" />,
    result_label: "Generated image",
    result_icon: <ImageIcon className="w-4 h-4 text-blue-500" />,
    formatArgs: formatImageGenArgs,
  },
};

const DEFAULT_TOOL_DISPLAY: ToolDisplay = { 
  call_label: "Using tool", 
  call_icon: <Wrench className="w-4 h-4" />, 
  result_label: "Used tool", 
  result_icon: <Wrench className="w-4 h-4" /> 
};

// --- Utility Functions ---

function extractToolName(part: ToolCallPart | ToolResultPart): string | undefined {
  const partWithType = part as unknown as { type?: string; toolName?: string };
  if (partWithType.type && partWithType.type.startsWith("tool-")) {
    return partWithType.type.slice(5);
  }
  if (partWithType.toolName) return partWithType.toolName;
  if ('toolName' in part && part.toolName) return part.toolName;
  return undefined;
}

function formatToolArguments(toolName: string, input: unknown, toolDisplay?: ToolDisplay): string {
  if (toolDisplay?.formatArgs) {
    return toolDisplay.formatArgs(toolName, input);
  }
  try {
    if (typeof input !== 'object' || input === null) return String(input);
    const args = input as Record<string, unknown>;
    if (args.query) return String(args.query);
    if (args.prompt) return String(args.prompt);
    return "Arguments not available";
  } catch {
    return "Arguments not available";
  }
}

// --- Components ---

export function ToolCall({ part }: { part: ToolCallPart }) {
  const { input } = part;
  const toolName = extractToolName(part);
  const toolDisplay = toolName ? (TOOL_DISPLAY_MAP[toolName] || DEFAULT_TOOL_DISPLAY) : DEFAULT_TOOL_DISPLAY;
  const formattedArgs = formatToolArguments(toolName || "", input, toolDisplay);

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
        {toolDisplay.call_icon}
        <Shimmer duration={1}>{toolDisplay.call_label}</Shimmer>
      </div>
      {toolDisplay.formatArgs && formattedArgs && (
        <span className="text-muted-foreground/75 flex-1 min-w-0 truncate text-xs">
          {formattedArgs}
        </span>
      )}
    </div>
  );
}

export function ToolResult({ part }: { part: ToolResultPart }) {
  const { result } = part as any; // Cast to access result safely
  const toolName = extractToolName(part);
  const toolDisplay = toolName ? (TOOL_DISPLAY_MAP[toolName] || DEFAULT_TOOL_DISPLAY) : DEFAULT_TOOL_DISPLAY;

  // --- SPECIAL HANDLING FOR IMAGES ---
  if (toolName === 'generateImage') {
    if (result?.error) {
      return (
         <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm mb-2">
           Error: {result.error}
         </div>
      );
    }
    
    if (result?.imageUrl) {
      return (
        <div className="flex flex-col gap-2 my-2">
            {/* The Header (Icon + Label) */}
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                {toolDisplay.result_icon}
                <span>Image Generated Successfully</span>
            </div>
            
            {/* The Actual Image */}
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                <img 
                  src={result.imageUrl} 
                  alt="AI Generated" 
                  className="w-full h-auto object-cover" 
                  loading="lazy"
                />
            </div>
            {result.revisedPrompt && (
                <p className="text-[10px] text-gray-400 italic">
                    Prompt: {result.revisedPrompt.slice(0, 100)}...
                </p>
            )}
        </div>
      );
    }
  }
  // -----------------------------------

  // Standard Text-based Tool Result (e.g. Search)
  const input = 'input' in part ? part.input : undefined;
  const formattedArgs = input !== undefined ? formatToolArguments(toolName || "", input, toolDisplay) : "";

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
        {toolDisplay.result_icon}
        <span>{toolDisplay.result_label}</span>
      </div>
      {toolDisplay.formatArgs && formattedArgs && (
        <span className="text-muted-foreground/75 flex-1 min-w-0 truncate text-xs">
          {formattedArgs}
        </span>
      )}
    </div>
  );
}
