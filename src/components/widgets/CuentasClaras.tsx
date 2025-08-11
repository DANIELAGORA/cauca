import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  DollarSign, 
  PlusCircle, 
  MinusCircle, 
  FileText,
  Calendar,
  Tag,
  Info,
  Upload
} from 'lucide-react';
import { CampaignFinanceEntry } from '../../types';

export const CuentasClaras: React.FC = () => {
  const { state, addCampaignFinanceEntry, uploadFile } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Omit<CampaignFinanceEntry, 'id' | 'user_id' | 'created_at' | 'transaction_date'>>({
    type: 'income',
    category: '',
    description: '',
    amount: 0,
    document_url: '',
  });
  const [transactionDate, setTransactionDate] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo para subir.');
      return;
    }
    if (!state.user) {
      setError('Debes iniciar sesión para subir documentos.');
      return;
    }

    setUploadingFile(true);
    setError(null);
    try {
      const category = 'cuentas-claras-documentos';
      const publicUrl = await uploadFile(selectedFile, category);
      setNewEntry(prev => ({ ...prev, document_url: publicUrl }));
      alert('Documento subido con éxito!');
    } catch (err: any) {
      logError('Error al subir documento:', err);
      setError(err.message || 'Error al subir el documento.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    if (!newEntry.amount || !newEntry.category || !transactionDate) {
      setError('Por favor, complete los campos obligatorios (Monto, Categoría, Fecha).');
      return;
    }
    if (isNaN(newEntry.amount)) {
      setError('El monto debe ser un número válido.');
      return;
    }

    setError(null);
    try {
      await addCampaignFinanceEntry({
        ...newEntry,
        amount: parseFloat(newEntry.amount.toString()),
        transaction_date: new Date(transactionDate),
      });
      alert('Movimiento registrado con éxito!');
      setNewEntry({
        type: 'income',
        category: '',
        description: '',
        amount: 0,
        document_url: '',
      });
      setTransactionDate('');
      setSelectedFile(null);
      setShowForm(false);
    } catch (err: any) {
      logError('Error al registrar movimiento:', err);
      setError(err.message || 'Error al registrar el movimiento.');
    }
  };

  const totalIncome = state.campaignFinances
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpense = state.campaignFinances
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
        Cuentas Claras
      </h3>

      {/* Balance Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <div className="text-sm text-gray-500">Ingresos</div>
          <div className="text-xl font-bold text-green-600">${totalIncome.toLocaleString('es-CO')}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Egresos</div>
          <div className="text-xl font-bold text-red-600">${totalExpense.toLocaleString('es-CO')}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Balance</div>
          <div className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>${balance.toLocaleString('es-CO')}</div>
        </div>
      </div>

      {/* Add New Entry Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center mb-6"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        {showForm ? 'Ocultar Formulario' : 'Registrar Nuevo Movimiento'}
      </button>

      {/* New Entry Form */}
      {showForm && (
        <div className="space-y-4 mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-md font-semibold text-gray-800">Detalles del Movimiento</h4>
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select
              name="type"
              value={newEntry.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="income">Ingreso</option>
              <option value="expense">Egreso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
            <input
              type="text"
              name="category"
              value={newEntry.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ej: Donación, Publicidad, Transporte"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={newEntry.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Detalles del movimiento"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
            <input
              type="number"
              name="amount"
              value={newEntry.amount === 0 ? '' : newEntry.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Transacción *</label>
            <input
              type="date"
              name="transaction_date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Documento de Soporte (Opcional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {selectedFile && (
              <button
                onClick={handleUploadDocument}
                disabled={uploadingFile}
                className="mt-2 w-full p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center"
              >
                {uploadingFile ? 'Subiendo...' : 'Subir Documento'}
                {uploadingFile ? <Upload className="h-4 w-4 ml-2 animate-pulse" /> : <Upload className="h-4 w-4 ml-2" />}
              </button>
            )}
            {newEntry.document_url && (
              <p className="text-xs text-gray-600 mt-1">Documento subido: <a href={newEntry.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver</a></p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Registrar Movimiento
          </button>
        </div>
      )}

      {/* Recent Movements */}
      <h4 className="text-md font-semibold text-gray-900 mb-3">Movimientos Recientes</h4>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {state.campaignFinances.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Info className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No hay movimientos registrados.</p>
          </div>
        ) : (
          state.campaignFinances.map((entry) => (
            <div key={entry.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  {entry.type === 'income' ? (
                    <PlusCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <MinusCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium text-gray-900">{entry.category}</span>
                </div>
                <span className={`font-bold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {entry.type === 'income' ? '+' : '-'}${entry.amount.toLocaleString('es-CO')}
                </span>
              </div>
              <p className="text-sm text-gray-700">{entry.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                <span><Calendar className="inline h-3 w-3 mr-1" />{new Date(entry.transaction_date).toLocaleDateString('es-CO')}</span>
                {entry.document_url && (
                  <span><FileText className="inline h-3 w-3 mr-1" /><a href={entry.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Documento</a></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};