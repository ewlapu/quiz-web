import { Download } from 'lucide-react';
import { exportService } from '../../services/exportService';
import toast from 'react-hot-toast';

export default function Export() {
  const handleExport = async (type) => {
    try {
      if (type === 'exams') {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 text-center">
          <div className="mb-4">
            <Download className="h-12 w-12 mx-auto text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Xuất đề thi</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Xuất danh sách đề thi của tôi</p>
          <button onClick={() => handleExport('exams')} className="btn btn-primary w-full">
            <Download className="h-4 w-4 mr-2" />
            Tải xuống
          </button>
        </div>

        <div className="card p-6 text-center">
          <div className="mb-4">
            <Download className="h-12 w-12 mx-auto text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Xuất bài làm</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Xuất danh sách bài làm</p>
          <button onClick={() => handleExport('attempts')} className="btn btn-primary w-full">
            <Download className="h-4 w-4 mr-2" />
            Tải xuống
          </button>
        </div>
      </div>
    </div>
  );
}
