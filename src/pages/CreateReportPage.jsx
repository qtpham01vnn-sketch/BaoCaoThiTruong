import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import { saveReport } from '../lib/storage';

const ROUTES = [
  'Quận 1 - Tuyến Trung Tâm, TP.HCM',
  'Quận 3 - Tuyến Văn Phòng, TP.HCM',
  'Quận 7, TP.HCM',
  'Tân Phước Khánh - Bến Cát - Bình Dương',
  'Thuận An - Bình Dương',
  'Dĩ An - Bình Dương',
  'Cần Thơ - Vĩnh Long',
  'Khu vực Đồng Nai',
];

const DEALERS = [
  'Phương Hùng Dũng - 124 Lê Lợi',
  'Minh Khang - 45 Hai Bà Trưng',
  'Tạp hóa Cô Năm - 78 Nguyễn Huệ',
  'Đại lý Minh Quân - 123 Đường 30/4',
  'Đại lý Thành Đạt - 56 Trần Hưng Đạo',
];

function getTodayString() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  return `${d}/${m}/${y}`;
}

// Hàm giả lập AI xử lý text: Sửa lỗi chính tả, ngắt câu, nhưng KHÔNG THÊM data giả
function simulateAIProcessing(rawText) {
  // Thay thế các từ viết tắt phổ biến trong ngành
  let processed = rawText
    .replace(/hỏithawm/gi, 'hỏi thăm')
    .replace(/tr khai/gi, 'triển khai')
    .replace(/ch bị/gi, 'chuẩn bị')
    .replace(/jcao/gi, 'cao')
    .replace(/htai/gi, 'Hiện tại')
    .replace(/cty/gi, 'công ty')
    .replace(/sp /gi, 'sản phẩm ')
    .replace(/côgn/gi, 'công')
    .replace(/teanh/gi, 'tranh')
    .replace(/truwongf/gi, 'trường')
    .replace(/n2000m2/gi, '2000m2')
    .replace(/hox/gi, 'hỗ');

  // Viết hoa chữ cái đầu câu
  processed = processed.replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) {
    return c.toUpperCase();
  });

  return processed.trim();
}

function generateAIReport({ agentName, vehicleNumber, route, dealer, rawNotes }) {
  const today = getTodayString();
  const cleanedNotes = simulateAIProcessing(rawNotes);
  const lowerNotes = rawNotes.toLowerCase();

  // Dynamic Content Generation based on Keywords to simulate "Smart AI"
  let cause = '';
  let solution = '';
  let contribution = '';

  if (lowerNotes.includes('giá') || lowerNotes.includes('chiết khấu')) {
    cause += '- Áp lực cạnh tranh về giá đang tăng cao: Đối thủ liên tục tung ra các chương trình chiết khấu sâu và chính sách giá linh hoạt nhằm gia tăng thị phần, gây áp lực trực tiếp lên các dòng sản phẩm chủ lực của chúng ta.\n';
    cause += '- Tâm lý khách hàng: Đại lý có xu hướng ưu tiên nhập các mặt hàng có biên độ lợi nhuận cao và quay vòng vốn nhanh, dẫn đến việc sản phẩm của chúng ta tạm thời bị hạn chế trưng bày.\n';
    cause += '- Động thái xả kho: Có dấu hiệu cho thấy một số đối thủ đang xả hàng tồn kho cuối quý, khiến giá bán lẻ trên thị trường bị xáo trộn.\n';
    
    solution += '- Giải pháp xử lý ngay (Ngắn hạn): Đề xuất Ban Giám đốc xem xét ban hành ngay chương trình hỗ trợ giá tạm thời, kết hợp tặng kèm sản phẩm hoặc chiết khấu thanh toán nhanh để giữ chân các đại lý trọng điểm.\n';
    solution += '- Chiến lược cạnh tranh (Dài hạn): Không nên tham gia vào cuộc chiến giá cả kéo dài. Cần tập trung định vị lại phân khúc sản phẩm, nhấn mạnh vào chất lượng, dịch vụ hậu mãi và uy tín thương hiệu Phương Nam.\n';
    solution += '- Đề xuất Trade Marketing: Triển khai các gói combo mua hàng tặng vật phẩm trưng bày (kệ, bảng hiệu) để tăng độ phủ nhận diện thương hiệu tại điểm bán.\n';
  }
  
  if (lowerNotes.includes('công trình') || lowerNotes.includes('m2') || lowerNotes.includes('sàn')) {
    cause += '- Nhu cầu thị trường chuyển dịch: Các dự án công trình, khu dân cư đang bước vào giai đoạn hoàn thiện, kéo theo nhu cầu khổng lồ về các dòng sản phẩm gạch ốp lát kích thước lớn (như đã ghi nhận).\n';
    cause += '- Yêu cầu kỹ thuật cao: Khách hàng dự án yêu cầu rất khắt khe về chất lượng men, độ chống thấm và tính đồng màu của sản phẩm.\n';
    cause += '- Nguồn cung: Hiện tại một số đối thủ chưa đáp ứng đủ số lượng hoặc thời gian giao hàng, tạo ra khoảng trống thị trường mà chúng ta có thể khai thác.\n';
    
    contribution += '- Công tác thị trường: Đề nghị anh em sale tiếp tục bám sát tiến độ của các công trình đang thi công, thu thập thông tin chủ thầu để tư vấn trực tiếp.\n';
    contribution += '- Công tác hậu cần: Đề xuất bộ phận Kho vận chuẩn bị sẵn sàng phương án điều xe, đảm bảo tiến độ giao hàng cho các đơn hàng dự án lớn nhằm tạo uy tín với chủ đầu tư.\n';
    contribution += '- Phối hợp chéo: Cần sự phối hợp chặt chẽ giữa bộ phận Dự án và Thị trường để chốt các deal số lượng lớn.\n';
  }

  if (lowerNotes.includes('mẫu mới') || lowerNotes.includes('chuẩn bị ra') || lowerNotes.includes('mẫu mã')) {
    cause += '- Xu hướng thẩm mỹ thay đổi: Thị hiếu người tiêu dùng đang hướng tới các thiết kế hiện đại, tinh tế. Đối thủ đã nhanh chóng nắm bắt và tung ra các mẫu mã mới.\n';
    cause += '- Hiệu ứng truyền thông: Việc ra mắt mẫu mới của đối thủ tạo được sự tò mò và thu hút sự chú ý lớn từ phía các đại lý bán lẻ.\n';
    cause += '- Điểm nghẽn hiện tại: Dải sản phẩm của chúng ta tuy chất lượng nhưng đang có dấu hiệu bão hòa về mặt hình ảnh thiết kế đối với người tiêu dùng.\n';
    
    solution += '- Phản ứng nhanh: Tăng cường truyền thông, nhắc nhớ lại các đặc tính ưu việt của dòng sản phẩm hiện tại (độ bền, chống xước, công nghệ nano).\n';
    solution += '- Chiến lược R&D (Bền vững): Bộ phận R&D cần đẩy nhanh tiến độ nghiên cứu, khẩn trương đưa vào sản xuất và ra mắt các mẫu mã mới với thiết kế đột phá, bắt kịp xu hướng thị trường.\n';
    solution += '- Khảo sát ý kiến: Đề nghị tổ chức lấy ý kiến các đại lý chiến lược về màu sắc, hoa văn trước khi sản xuất hàng loạt.\n';
  }

  // Fallbacks if no keywords matched
  if (!cause) {
    cause = '- Biến động chu kỳ: Sự điều chỉnh thông thường của thị trường sau các đợt cao điểm bán hàng.\n- Tâm lý e ngại rủi ro: Đại lý đang duy trì mức tồn kho an toàn, hạn chế nhập số lượng lớn do lo ngại sức mua yếu.\n- Tác động ngoại cảnh: Các yếu tố về vận chuyển, thời tiết ảnh hưởng đến tiến độ nhập hàng của khu vực.';
  }
  if (!solution) {
    solution = '- Giải pháp chăm sóc: Tăng cường các chương trình trade marketing tại điểm bán, chăm sóc và hỗ trợ sắp xếp lại khu vực trưng bày cho đại lý.\n- Giải pháp chính sách: Tối ưu chi phí vận chuyển và cơ chế thưởng linh hoạt để kích thích đại lý nhập hàng.\n- Đào tạo sản phẩm: Cung cấp thêm tài liệu, mẫu vật lý để đại lý dễ dàng tư vấn cho khách lẻ.';
  }
  if (!contribution) {
    contribution = '- Cam kết: Duy trì tần suất viếng thăm đều đặn để củng cố mối quan hệ chiến lược với hệ thống đại lý cấp 1.\n- Kế hoạch tuần tới: Lên danh sách các đại lý có sản lượng giảm sút để tập trung tìm hiểu nguyên nhân và tháo gỡ khó khăn.\n- Đề xuất chung: Cần tổ chức buổi họp nhanh đầu tuần để anh em chia sẻ thông tin chéo giữa các khu vực.';
  }

  // Tiêu chuẩn hoá tên (Title Case) và biển số (UPPERCASE)
  const formatName = (name) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const standardizedName = agentName ? formatName(agentName) : '';
  const standardizedVehicle = vehicleNumber ? vehicleNumber.toUpperCase() : '(CHƯA NHẬP)';

  return `BÁO CÁO THỊ TRƯỜNG HẰNG NGÀY
Người BC: ${standardizedName}
*BC: Ngày ${today}
*Số xe đi thị trường: ${standardizedVehicle}
*Khu vực/Tuyến đường: ${route}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DIỄN BIẾN THỊ TRƯỜNG QUAN TRỌNG:

${cleanedNotes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. PHÂN TÍCH NGUYÊN NHÂN:

(Đánh giá chuyên sâu dựa trên thực tế ghi nhận):
${cause.trim()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. GIẢI PHÁP & ĐỀ XUẤT CHO CÔNG TY:

${solution.trim()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. ĐÓNG GÓP PHÁT TRIỂN:

${contribution.trim()}`;
}

export default function CreateReportPage() {
  const navigate = useNavigate();
  const [agentName, setAgentName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [route, setRoute] = useState(ROUTES[0]);
  const [dealer, setDealer] = useState(DEALERS[0]);
  const [rawNotes, setRawNotes] = useState('');
  const [aiReport, setAiReport] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [images, setImages] = useState([]);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleAIRewrite = () => {
    if (!rawNotes.trim()) return;
    if (!agentName.trim()) {
      alert('Vui lòng nhập tên nhân viên báo cáo trước khi AI viết lại.');
      return;
    }
    setIsProcessing(true);
    setAiReport('Hệ thống AI đang xử lý và chuẩn hóa dữ liệu...');

    setTimeout(() => {
      const report = generateAIReport({ agentName, vehicleNumber, route, dealer, rawNotes });
      setAiReport(report);
      setIsProcessing(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!agentName.trim()) {
      alert('Vui lòng nhập tên nhân viên báo cáo.');
      return;
    }

    const report = {
      agentName: agentName.trim(),
      vehicleNumber: vehicleNumber.trim(),
      route,
      dealer,
      title: `BC Thị trường ${route.split(' - ')[0]} - ${getTodayString()}`,
      rawNotes,
      aiReport: aiReport || rawNotes,
      images: images,
      status: 'draft',
      dealersVisited: 1,
      startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      endTime: '',
      duration: '',
      feedback: null,
    };

    const savedReport = saveReport(report);
    setIsSaved(true);

    // Navigate to the newly created report detail page so user knows where it went
    setTimeout(() => {
      navigate(`/report/${savedReport.id}`);
    }, 1000);
  };

  const handleCopy = () => {
    if (!aiReport) return;
    navigator.clipboard.writeText(aiReport);
    alert('Đã copy nội dung báo cáo!');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Create local blob URLs for preview
      const newImages = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopAppBar title="BaoCaoThiTruong" showBack />

      <main className="max-w-screen-xl mx-auto px-4 pt-20 space-y-6 page-enter">
        {/* Section 1: Nhân viên báo cáo */}
        <div className="bg-white border border-indigo-100 p-4 rounded-xl space-y-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            NHÂN VIÊN BÁO CÁO
          </label>
          <div className="relative">
            <input
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Nhập họ và tên nhân viên"
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">person</span>
          </div>
        </div>

        {/* Section 1b: Số xe đi thị trường */}
        <div className="bg-white border border-indigo-100 p-4 rounded-xl space-y-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            SỐ XE ĐI THỊ TRƯỜNG
          </label>
          <div className="relative">
            <input
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="VD: 60C - 815.56"
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">directions_car</span>
          </div>
        </div>

        {/* Section 2: Tuyến đường + Đại lý */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-indigo-100 p-4 rounded-xl space-y-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Tuyến đường / Khu vực
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-bright border border-outline-variant rounded-lg p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary appearance-none outline-none"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
              >
                {ROUTES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 p-4 rounded-xl space-y-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Đại lý / Cửa hàng
            </label>
            <div className="relative">
              <select
                className="w-full bg-surface-bright border border-outline-variant rounded-lg p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary appearance-none outline-none"
                value={dealer}
                onChange={(e) => setDealer(e.target.value)}
              >
                {DEALERS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">storefront</span>
            </div>
          </div>
        </div>

        {/* Section 3: Raw Notes */}
        <div className="bg-white border border-indigo-100 p-4 rounded-xl space-y-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center relative z-10">
            <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Nhập ghi chú nhanh
            </label>
            <span className="text-xs text-outline italic" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Dữ liệu thô</span>
          </div>
          <textarea
            className="w-full min-h-[140px] bg-surface-bright border border-outline-variant rounded-lg p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder:text-outline outline-none relative z-10"
            placeholder="VD: Sáng ghé đại lý hỏi thăm về mẫu mã mới triển khai của Phương Nam 30x60... Htai theo đại lý thì cty VNM tung ra dòng sp 60x60 giá hợp lý..."
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
          />
        </div>

        {/* Section 4: AI Action Button */}
        <div className="flex justify-center py-2">
          <button
            onClick={handleAIRewrite}
            disabled={isProcessing || !rawNotes.trim()}
            className="relative group overflow-hidden bg-primary text-on-primary font-semibold text-sm px-10 py-4 rounded-full flex items-center gap-2 shadow-lg active:scale-95 hover:shadow-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-container to-tertiary-container opacity-50 group-hover:opacity-80 transition-opacity"></div>
            <span className="relative z-10 material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isProcessing ? 'hourglass_top' : 'auto_awesome'}
            </span>
            <span className="relative z-10">{isProcessing ? 'Đang xử lý...' : 'AI Viết lại báo cáo'}</span>
          </button>
        </div>

        {/* Section 5: AI Preview */}
        <div className="ai-gradient-border p-4 rounded-xl space-y-2 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          {isProcessing && <div className="absolute top-0 left-0 w-full h-1.5 ai-shimmer bg-primary/50"></div>}
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              NỘI DUNG BÁO CÁO CHUẨN HÓA
            </label>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                disabled={!aiReport}
                className="flex items-center gap-1 text-[11px] font-bold uppercase text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                Copy
              </button>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase">Bản thảo AI</span>
            </div>
          </div>
          <textarea
            className="w-full min-h-[400px] bg-white border-none rounded-lg p-4 text-base focus:ring-0 resize-none leading-relaxed outline-none whitespace-pre-wrap"
            placeholder="Kết quả chuẩn hóa sẽ hiển thị tại đây..."
            value={aiReport}
            onChange={(e) => setAiReport(e.target.value)}
          />
          <p className="text-xs text-outline italic">Bạn có thể chỉnh sửa trực tiếp nội dung này trước khi lưu.</p>
        </div>

        {/* Section 6: Attachments */}
        <div className="bg-white border border-indigo-100 p-4 rounded-xl space-y-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider relative z-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Ảnh cửa hàng, bảng giá, đối thủ
          </label>
          
          {/* Hidden file inputs */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={cameraInputRef} 
            className="hidden" 
            onChange={handleImageUpload} 
          />
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleImageUpload} 
          />

          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            <div 
              onClick={() => cameraInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors group"
            >
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">add_a_photo</span>
              <span className="text-[10px] text-outline mt-1 font-medium">Chụp ảnh</span>
            </div>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-low transition-colors group"
            >
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">upload_file</span>
              <span className="text-[10px] text-outline mt-1 font-medium">Tải lên</span>
            </div>
            
            {/* Display uploaded images */}
            {images.map((imgUrl, index) => (
              <div key={index} className="aspect-square bg-surface-container rounded-xl overflow-hidden relative group">
                <img src={imgUrl} alt="Upload preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 bg-error text-on-error rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}

            {images.length === 0 && (
              <div className="aspect-square bg-surface-container rounded-xl flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-outline text-3xl">image</span>
                <span className="text-[10px] text-outline mt-1">0 ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 7: Primary Action */}
        <div className="pt-2 pb-4">
          {isSaved ? (
            <div className="w-full bg-tertiary text-on-tertiary font-semibold text-sm py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-md">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Đã lưu thành công! Đang chuyển hướng...
            </div>
          ) : (
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm py-4 rounded-xl shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] active:scale-[0.98] hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest transition-all duration-300"
            >
              <span className="material-symbols-outlined">save</span>
              Lưu báo cáo
            </button>
          )}
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
