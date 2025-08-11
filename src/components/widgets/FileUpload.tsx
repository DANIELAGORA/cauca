import React, { useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Upload, FileText, Image, Table } from 'lucide-react';

export const FileUpload: React.FC = () => {
  const { uploadFile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const category = determineCategory(file);
      await uploadFile(file, category);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const determineCategory = (file: File): string => {
    if (file.type.includes('image')) return 'images';
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) return 'excel';
    return 'documents';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return Image;
    if (type.includes('spreadsheet') || type.includes('excel')) return Table;
    return FileText;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="h-5 w-5 text-green-600 mr-2" />
        Gestión de Archivos
      </h3>

      {/* Upload area */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          accept=".xlsx,.xls,.jpg,.jpeg,.png,.pdf,.doc,.docx"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600">Subir archivos</p>
          <p className="text-xs text-gray-400">Excel, imágenes, documentos</p>
        </button>
      </div>

      {/* Upload categories */}
      <div className="grid grid-cols-3 gap-2">
        <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
          <Table className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <span className="text-xs text-blue-800 font-medium">Excel</span>
        </button>
        <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
          <Image className="h-5 w-5 text-green-600 mx-auto mb-1" />
          <span className="text-xs text-green-800 font-medium">Imágenes</span>
        </button>
        <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
          <FileText className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <span className="text-xs text-purple-800 font-medium">Docs</span>
        </button>
      </div>

      {/* AI Assistant hint */}
      <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800">
          <span className="font-medium">🤖 IA Asistente:</span> Los archivos serán categorizados y distribuidos automáticamente según su contenido y relevancia territorial.
        </p>
      </div>
    </div>
  );
};