import { Download } from 'lucide-react';
import { exportService } from '../../services/exportService';
import toast from 'react-hot-toast';

export default function Export() {
  const handleExport = async (type) => {
    try {
      if (type === 'users') {
        await exportService.exportUsers();
        toast.success('Đã xuất danh sách người dùng');
      } else if (type === 'exams') {
        await exportService.exportExams();
        toast.success('Đã xuất danh sách đề thi');
      } else if (type === 'attempts') {
        await exportService.exportAttempts();
        toast.success('Đã xuất danh sách bài làm');
      }
    } catch (error) {
      toast.error('Không thể xuất dữ liệu');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Xuất dữ liệu</h1>
        <p className="text-gray-600 dark:text-gray-400">Xuất dữ liệu ra file Excel để phân tích</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { type: 'users', title: 'Xuất người dùng', desc: 'Xuất danh sách tất cả người dùng', color: 'education', iconBg: 'bg-education-100 dark:bg-education-900/30' },
          { type: 'exams', title: 'Xuất đề thi', desc: 'Xuất danh sách tất cả đề thi', color: 'primary', iconBg: 'bg-primary-100 dark:bg-primary-900/30' },
          { type: 'attempts', title: 'Xuất bài làm', desc: 'Xuất danh sách tất cả bài làm', color: 'accent', iconBg: 'bg-accent-100 dark:bg-accent-900/30' },
        ].map((item, idx) => {
          let colorClass, iconColorClass;
          if (item.color === 'education') {
            colorClass = 'bg-education-600';
            iconColorClass = 'text-education-600 dark:text-education-400';
          } else if (item.color === 'primary') {
            colorClass = 'bg-primary-600';
            iconColorClass = 'text-primary-600 dark:text-primary-400';
          } else {
            colorClass = 'bg-accent-600';
            iconColorClass = 'text-accent-600 dark:text-accent-400';
          }
          return (
          <div key={item.type} className="card-hover p-8 text-center group animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className={`w-20 h-20 rounded-2xl ${item.iconBg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
              <Download className={`h-10 w-10 ${iconColorClass}`} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{item.desc}</p>
            <button 
              onClick={() => handleExport(item.type)} 
              className={`btn w-full ${colorClass} text-white hover:shadow-glow`}
            >
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}
