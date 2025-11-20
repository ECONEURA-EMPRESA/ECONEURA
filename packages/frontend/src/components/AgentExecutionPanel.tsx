import React from 'react';

interface AgentExecutionPanelProps {
  executions?: any[];
}

export function AgentExecutionPanel({ executions = [] }: AgentExecutionPanelProps) {
  return (
    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Agent Executions</h3>
      <p className="text-gray-600">Total executions: {executions.length}</p>
      {executions.length > 0 && (
        <div className="mt-4 space-y-2">
          {executions.slice(0, 5).map((exec: any, idx: number) => (
            <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
              <p><strong>Status:</strong> {exec.status}</p>
              <p><strong>Time:</strong> {exec.duration_ms}ms</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
