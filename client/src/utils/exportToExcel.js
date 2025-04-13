import * as XLSX from 'xlsx';

const exportToExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export default exportToExcel;