/* Datas — layout.md §7: "Devolver até" = hoje + 14 dias, em DD/MM/AAAA. */

export const PRAZO_PADRAO_DIAS = 14

export function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  return `${dia}/${mes}/${data.getFullYear()}`
}

export function prazoPadrao(hoje: Date = new Date()): string {
  const prazo = new Date(hoje)
  prazo.setDate(prazo.getDate() + PRAZO_PADRAO_DIAS)
  return formatarData(prazo)
}
