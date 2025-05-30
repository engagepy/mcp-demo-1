"use client";

import { useEffect, useState } from "react";

import { useCopilotChat, useCopilotAction, CatchAllActionRenderProps } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { MCPEndpointConfig } from "@copilotkit/runtime";
import { DefaultToolRender } from "@/components/default-tool-render";

const themeColor = "#6366f1";

export default function CopilotKitPage() {
  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <YourMainContent />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "MCP Assistant",
          initial: "👋 Hi, there! You're chatting with an LLM that can use MCP servers.\n\n You can ask me to use any MCP servers that you have set up on this page.  \n\n Now, what can I do for you?"
        }}
      />
    </main>
  );
}

function YourMainContent() {
  const { mcpServers, setMcpServers } = useCopilotChat();
  const [newMcpServer, setNewMcpServer] = useState("");

  useEffect(() => {
    setMcpServers([
      // Add any initial MCP servers here, find more at https://mcp.composio.dev or https://actions.zapier.com!
    ]);
  }, []);

  const removeMcpServer = (url: string) => {
    setMcpServers(mcpServers.filter((server) => server.endpoint !== url));
  }

  const addMcpServer = (server: MCPEndpointConfig) => {
    setMcpServers([...mcpServers, server]);
  }

  // 🪁 Copilot Suggestions: https://docs.copilotkit.ai/guides/copilot-suggestions
  useCopilotChatSuggestions({
    maxSuggestions: 3,
    instructions: "Give the user a short and concise suggestion based on the conversation and your available tools. If you have no tools, don't suggest anything.",
  })

  // 🪁 Catch-all Action for rendering MCP tool calls: https://docs.copilotkit.ai/guides/generative-ui?gen-ui-type=Catch+all+renders
  useCopilotAction({
    name: "*",
    render: ({ name, status, args, result }: CatchAllActionRenderProps<[]>) => (
      <DefaultToolRender status={status} name={name} args={args} result={result} />
    ),
  });

  // Style variables
  const classes = {
    wrapper:
      "h-screen w-screen flex justify-start items-center bg-gradient-to-br from-[#0d0d1d] to-[#1a1a2f] text-white relative z-10 px-8 transition-colors duration-300",
    container:
      "bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-2xl w-full",
    server:
      "bg-white/15 p-4 rounded-xl text-white relative group hover:bg-white/20 transition-all",
    deleteButton:
      "absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center",
    input:
      "bg-white/20 p-4 rounded-xl text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400",
    submitButton:
      "w-full p-4 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-bold transition-all",
  };

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className={classes.wrapper}
    >
      <div className={classes.container}>
        <h1 className="text-4xl font-bold text-white mb-2 text-center">MCP Demo by ZP</h1>
        <p className="text-gray-200 text-center">Discover more at <a href="https://m37labs.com" className="text-indigo-200">M37Labs.</a></p>
        <hr className="border-white/20 my-6" />

        <div className="flex flex-col gap-6">
          {mcpServers.map((server, index) => (
            <div key={index} className={classes.server}>
              <p className="pr-8 truncate">{server.endpoint}</p>
              <button className={classes.deleteButton} onClick={() => removeMcpServer(server.endpoint)}>
                ✕
              </button>
            </div>
          ))}
          <input 
            type="text" 
            placeholder="Enter MCP server URL" 
            className={classes.input} 
            value={newMcpServer}
            onChange={(e) => setNewMcpServer(e.target.value)}
          />
          <button className={classes.submitButton} onClick={() => {
            if (newMcpServer) {
              addMcpServer({ endpoint: newMcpServer });
              setNewMcpServer("");
            }
          }} >
            Add MCP Server
          </button>
        </div>
      </div>
    </div>
  );
}
