// localStorage helper for saving/loading reports

const STORAGE_KEY = 'baocaothitruong_reports';

export function getReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getReportById(id) {
  const reports = getReports();
  return reports.find(r => r.id === id) || null;
}

export function saveReport(report) {
  const reports = getReports();
  const newReport = {
    ...report,
    id: report.id || Date.now().toString(),
    createdAt: report.createdAt || new Date().toISOString(),
  };
  reports.unshift(newReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return newReport;
}

export function updateReport(id, updates) {
  const reports = getReports();
  const index = reports.findIndex(r => r.id === id);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return reports[index];
  }
  return null;
}

export function deleteReport(id) {
  const reports = getReports().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

// Seed demo data if empty
export function seedDemoData() {
  if (getReports().length > 0) return;

  const demoReports = [
    {
      id: '1',
      agentName: 'Nguyễn Hoàng Nam',
      vehicleNumber: '60C - 815.56',
      route: 'Cần Thơ - Vĩnh Long',
      dealer: 'Đại lý Minh Quân - 123 Đường 30/4',
      title: 'Khảo sát Đại lý Cấp 1 - KV Miền Tây',
      rawNotes: 'Sáng ghé Minh Quân, thị trường tăng 15%, đối thủ X chiết khấu 2% cho đại lý mới',
      aiReport: `***Chào Toàn Thể Anh/ Chị/ Em!\n**KHUNG BÁO CÁO THỊ TRƯỜNG HẰNG NGÀY!\nNgười BC: Nguyễn Hoàng Nam\n*BC: Ngày 15/05/2024\n*Số xe đi thị trường: 60C - 815.56\n*Khu vực/Tuyến đường: Cần Thơ - Vĩnh Long\n\n1. Diễn Biến Thị Trường Quan Trọng\n- Sáng ghé Minh Quân, thị trường khu vực Cần Thơ ghi nhận sức tiêu thụ tăng 15%.\n- Các đại lý tập trung nhập hàng chuẩn bị cho cao điểm.\n\n2. Phân Tích Nguyên Nhân\n- Áp lực cạnh tranh gia tăng, đối thủ X vừa tung gói chiết khấu 2% cho đại lý mới.\n- Vận chuyển thủy gặp khó do triều cường.\n\n3. Giải Pháp & Đề Xuất Cho Công Ty\n- Giải pháp ngắn hạn: Xem xét điều chỉnh chính sách hậu mãi cho nhóm đại lý Platinum.\n- Giải pháp dài hạn: Hỗ trợ chi phí kho bãi mùa lũ.\n\n4. Đóng Góp Phát Triển\n- Theo dõi sát sản lượng của đại lý Minh Quân trong tuần tới.`,
      status: 'approved',
      dealersVisited: 12,
      startTime: '08:15 AM',
      endTime: '09:45 AM',
      duration: '1h 30m',
      feedback: {
        author: 'Sếp kinh doanh (Trần Văn A)',
        initials: 'SK',
        time: '2 giờ trước',
        message: 'Báo cáo rất chi tiết, đặc biệt là phần phân tích đối thủ X. Chú ý theo dõi sát sản lượng của đại lý Minh Quân trong tuần tới.',
      },
      createdAt: '2024-05-15T08:15:00.000Z',
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoReports));
}
