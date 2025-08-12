import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  MessageCircle, 
  Send, 
  Users, 
  AlertCircle,
  UserCheck,
  Building2,
  Crown,
  Filter
} from 'lucide-react';
import { 
  getTodosLosElectos,
  alcaldesElectos, 
  diputadosAsamblea, 
  concejalesElectos,
  getMunicipiosConElectos 
} from '../../data/estructura-jerarquica-completa';

interface MessageRecipient {
  id: string;
  nombre: string;
  email: string;
  role: string;
  municipio: string;
}

export const DepartmentalMessaging: React.FC = () => {
  const { state, sendMessage } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'individual' | 'por-tipo' | 'por-municipio' | 'masivo'>('individual');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<'alcalde' | 'diputado-asamblea' | 'concejal-electo' | 'todos'>('todos');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('todos');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const todosElectos = getTodosLosElectos();
  const municipiosConElectos = getMunicipiosConElectos();

  const getFilteredRecipients = (): MessageRecipient[] => {
    let recipients = todosElectos.map(electo => ({
      id: electo.id,
      nombre: electo.nombre,
      email: electo.email,
      role: electo.role,
      municipio: electo.municipio
    }));

    // Filtrar por tipo de electo
    if (selectedRole !== 'todos') {
      recipients = recipients.filter(r => r.role === selectedRole);
    }

    // Filtrar por municipio
    if (selectedMunicipio !== 'todos') {
      recipients = recipients.filter(r => r.municipio === selectedMunicipio);
    }

    return recipients;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !state.user) return;

    const recipients = getFilteredRecipients();
    const recipientIds = messageType === 'individual' 
      ? selectedRecipients 
      : recipients.map(r => r.id);

    if (recipientIds.length === 0) {
      alert('Debe seleccionar al menos un destinatario');
      return;
    }

    // Enviar mensaje a cada destinatario
    for (const recipientId of recipientIds) {
      const recipient = recipients.find(r => r.id === recipientId);
      await sendMessage({
        senderId: state.user.id,
        senderName: `José Luis Diago Franco - Director Departamental`,
        senderRole: state.user.role,
        recipientId: recipientId,
        recipientName: recipient?.nombre || 'Destinatario',
        content: newMessage,
        type: messageType === 'individual' ? 'direct' : 'broadcast',
        priority: priority,
        readBy: []
      });
    }

    setNewMessage('');
    setSelectedRecipients([]);
    alert(`Mensaje enviado a ${recipientIds.length} destinatario(s)`);
  };

  const toggleRecipient = (recipientId: string) => {
    setSelectedRecipients(prev => 
      prev.includes(recipientId) 
        ? prev.filter(id => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const filteredRecipients = getFilteredRecipients();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
        Sistema de Mensajería Departamental
      </h3>

      {/* Tipo de mensaje */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Mensaje
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { key: 'individual', label: 'Individual', icon: UserCheck },
            { key: 'por-tipo', label: 'Por Cargo', icon: Crown },
            { key: 'por-municipio', label: 'Por Municipio', icon: Building2 },
            { key: 'masivo', label: 'Masivo', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMessageType(key as any)}
              className={`p-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 ${
                messageType === key
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros de destinatarios */}
      {(messageType === 'por-tipo' || messageType === 'por-municipio') && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por cargo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cargo
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los cargos</option>
              <option value="alcalde">Alcaldes ({alcaldesElectos.length})</option>
              <option value="diputado-asamblea">Diputados ({diputadosAsamblea.length})</option>
              <option value="concejal-electo">Concejales ({concejalesElectos.length})</option>
            </select>
          </div>

          {/* Filtro por municipio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Municipio
            </label>
            <select
              value={selectedMunicipio}
              onChange={(e) => setSelectedMunicipio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los municipios</option>
              {municipiosConElectos.map(municipio => (
                <option key={municipio.nombre} value={municipio.nombre}>
                  {municipio.nombre} ({municipio.totalElectos} electos)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Lista de destinatarios para mensaje individual */}
      {messageType === 'individual' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Destinatarios ({selectedRecipients.length} seleccionados)
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredRecipients.map(recipient => (
              <div
                key={recipient.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedRecipients.includes(recipient.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleRecipient(recipient.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{recipient.nombre}</div>
                    <div className="text-sm text-gray-600">
                      {recipient.role} - {recipient.municipio}
                    </div>
                  </div>
                  {selectedRecipients.includes(recipient.id) && (
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de destinatarios */}
      {messageType !== 'individual' && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <Filter className="h-4 w-4" />
            <span className="font-medium">
              Destinatarios: {filteredRecipients.length} electos
            </span>
          </div>
          <div className="text-sm text-blue-600 mt-1">
            {selectedRole !== 'todos' && `Cargo: ${selectedRole} • `}
            {selectedMunicipio !== 'todos' && `Municipio: ${selectedMunicipio}`}
          </div>
        </div>
      )}

      {/* Prioridad del mensaje */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prioridad
        </label>
        <div className="flex gap-2">
          {[
            { key: 'low', label: 'Baja', color: 'gray' },
            { key: 'medium', label: 'Media', color: 'blue' },
            { key: 'high', label: 'Alta', color: 'red' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setPriority(key as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                priority === key
                  ? `bg-${color}-100 text-${color}-700 border-${color}-200`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } border`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Campo de mensaje */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensaje
        </label>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escriba su mensaje para los electos del departamento..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
      </div>

      {/* Botón de envío */}
      <button
        onClick={handleSendMessage}
        disabled={!newMessage.trim() || (messageType === 'individual' && selectedRecipients.length === 0)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send className="h-4 w-4" />
        Enviar Mensaje
        {messageType !== 'individual' && ` a ${filteredRecipients.length} destinatarios`}
      </button>
    </div>
  );
};