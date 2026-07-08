import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, BorderStyle, WidthType } from 'docx';
import { saveAs } from 'file-saver';

const convertMillimetersToTwips = (mm) => Math.round(mm * 56.6929);

export async function generateWordDocument(report) {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  
  const reportNo = report.id?.substring(0, 4) || '01';
  
  // Xử lý nội dung văn bản (tách đoạn)
  const reportContent = report.aiReport || report.rawNotes || '';
  const paragraphs = reportContent.split('\n').map(text => {
    // Nếu là dòng trống
    if (text.trim() === '') {
      return new Paragraph({ text: '', spacing: { after: 120 } });
    }
    // Nếu là tiêu đề mục (có số ở đầu hoặc chữ in hoa hoàn toàn)
    if (/^[0-9]+\./.test(text.trim()) || (text.trim() === text.trim().toUpperCase() && text.trim().length > 10)) {
      return new Paragraph({
        children: [
          new TextRun({
            text: text.trim(),
            bold: true,
            size: 28, // 14pt
          })
        ],
        spacing: { before: 240, after: 120 },
      });
    }
    
    // Đoạn văn bản bình thường (căn đều, lùi đầu dòng)
    return new Paragraph({
      children: [
        new TextRun({
          text: text.trim(),
          size: 28, // 14pt
        })
      ],
      alignment: AlignmentType.JUSTIFIED,
      indent: {
        firstLine: convertMillimetersToTwips(12.7), // 1.27cm indent
      },
      spacing: { after: 120, line: 360 }, // 1.5 line spacing
    });
  });

  const doc = new Document({
    creator: "Stitch AI Market Reporter",
    title: report.title || "Báo Cáo Thị Trường",
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 28, // 14pt
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertMillimetersToTwips(20),
              bottom: convertMillimetersToTwips(20),
              left: convertMillimetersToTwips(30),
              right: convertMillimetersToTwips(20),
            },
          },
        },
        children: [
          // Bảng Header (Quốc hiệu, Tiêu ngữ)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "CÔNG TY PHƯƠNG NAM", bold: true, size: 26 })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: `SỐ: ${reportNo}/BC-PN`, size: 26 })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "-------", bold: true })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 26 })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 28 })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "------------------", bold: true })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: `TP.HCM, ngày ${day} tháng ${month} năm ${year}`, italics: true, size: 28 })
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 120 },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { after: 400 } }), // Khoảng trống

          // Tiêu đề báo cáo
          new Paragraph({
            children: [
              new TextRun({ text: "BÁO CÁO THỊ TRƯỜNG", bold: true, size: 32 }) // 16pt
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),

          // Trích yếu
          new Paragraph({
            children: [
              new TextRun({ text: `V/v: Tuyến ${report.route || ''}`, bold: true, size: 28 })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Nội dung báo cáo
          ...paragraphs,

          new Paragraph({ text: "", spacing: { after: 600 } }), // Khoảng trống trước chữ ký

          // Bảng Chữ ký
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Nơi nhận:", italics: true, bold: true, size: 24 })
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "- Ban Giám đốc (để b/c);", size: 22 })
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "- Lưu: VT.", size: 22 })
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "NGƯỜI LẬP BÁO CÁO", bold: true, size: 28 })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "(Ký, ghi rõ họ tên)", italics: true, size: 24 })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({ text: "", spacing: { after: 1200 } }), // Chừa chỗ ký
                      new Paragraph({
                        children: [
                          new TextRun({ text: report.agentName || "........................", bold: true, size: 28 })
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `BaoCao_${report.route?.replace(/\s+/g, '')}_${day}${month}${year}.docx`);
}
