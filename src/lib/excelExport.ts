import * as XLSX from 'xlsx';
import type { DailySchedule } from '../types/lab';

export interface ExportData {
  Data: string;
  'Dia da Semana': string;
  'Horário Início': string;
  'Horário Fim': string;
  Status: string;
  Observações: string;
}

export function exportDailySchedulesToExcel(
  dailySchedules: { [dateKey: string]: DailySchedule },
  fileName: string = 'cronograma_laboratorio'
) {
  try {
    // Sort dates and convert to export format
    const sortedDates = Object.keys(dailySchedules).sort();
    const exportData: ExportData[] = sortedDates.map(dateKey => {
      const schedule = dailySchedules[dateKey];
      const date = new Date(dateKey);
      
      return {
        'Data': date.toLocaleDateString('pt-BR'),
        'Dia da Semana': date.toLocaleDateString('pt-BR', { weekday: 'long' }),
        'Horário Início': schedule.active ? schedule.start : '-',
        'Horário Fim': schedule.active ? schedule.end : '-',
        'Status': schedule.active ? 'Funcionando' : 'Fechado',
        'Observações': schedule.notes || ''
      };
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Data
      { wch: 15 }, // Dia da Semana
      { wch: 15 }, // Horário Início
      { wch: 15 }, // Horário Fim
      { wch: 12 }, // Status
      { wch: 30 }, // Observações
    ];
    worksheet['!cols'] = colWidths;

    // Style header row
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:F1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellRef]) continue;
      
      worksheet[cellRef].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // Add summary sheet
    const summary = {
      'Total de Dias': exportData.length,
      'Dias Funcionando': exportData.filter(d => d.Status === 'Funcionando').length,
      'Dias Fechados': exportData.filter(d => d.Status === 'Fechado').length,
      'Data de Exportação': new Date().toLocaleString('pt-BR')
    };

    const summaryData = Object.entries(summary).map(([key, value]) => ({
      'Informação': key,
      'Valor': value
    }));

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 30 }];

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cronograma Diário');
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Resumo');

    // Generate file name with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fullFileName);
    
    return { success: true, fileName: fullFileName };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao exportar Excel' 
    };
  }
}

export function exportMonthlySchedulesToExcel(
  dailySchedules: { [dateKey: string]: DailySchedule },
  year: number,
  month: number,
  fileName: string = 'cronograma_mensal'
) {
  // Filter schedules for the specific month
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthlySchedules = Object.keys(dailySchedules)
    .filter(dateKey => dateKey.startsWith(monthKey))
    .reduce((acc, dateKey) => {
      acc[dateKey] = dailySchedules[dateKey];
      return acc;
    }, {} as { [dateKey: string]: DailySchedule });

  const monthName = new Date(year, month).toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });
  
  const fullFileName = `${fileName}_${monthName.replace(' ', '_')}`;
  
  return exportDailySchedulesToExcel(monthlySchedules, fullFileName);
}