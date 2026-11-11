// Decisão determinística do gate. Não executa texto do modelo.
export function podeEncerrar(packet, events, report, exitCode) {
  return exitCode === 0 && !events.some(e => e.type === 'turn.failed')
    && /Veredito:\s*(?:\*\*)?PRONTA\b/.test(report)
    && !/\|\s*(?:REPROVADO|SEM TESTE|AMBÍGUO|OUTRO REPOSITÓRIO)\s*\|/.test(report)
    && packet.checks.length > 0 && packet.checks.every(c => c.exitCode === 0)
    && packet.criterios.every(id => report.split('\n').some(line => line.startsWith('|') && line.includes(id) && /\|\s*ATENDIDO\s*\|/.test(line)))
    && packet.criterios.every(id => packet.checks.some(c => c.resultado?.testResults?.some(s => s.assertionResults?.some(t => t.fullName?.includes(id) && t.status === 'passed' && t.numPassingAsserts > 0))))
    && !events.some(e => ['command_execution', 'mcp_tool_call', 'collab_tool_call', 'file_change', 'web_search'].includes(e.item?.type))
}
