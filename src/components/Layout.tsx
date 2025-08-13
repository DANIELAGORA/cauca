import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';
import { logError } from '../utils/logger';
import { 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Search,
  Settings,
  MessageCircle,
  RefreshCw,
  Download,
  Home,
  BarChart3,
  Users,
  Calendar,
  Database,
  Megaphone,
  Bot,
  Share2,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MobileBottomNav } from './MobileBottomNav';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { PrivacyPolicy } from './PrivacyPolicy';
import { FloatingPWAButton } from './FloatingPWAButton';

// Configuración de IA
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, logout, loginWithRole } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // PWA Installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleMobileNavigation = (section: string) => {
    setActiveSection(section);
    // Aquí puedes agregar lógica adicional para cambiar la vista
    // Por ejemplo, emitir eventos o cambiar el estado global
  };

  const roleNames: Record<string, string> = {
    'comite-ejecutivo-nacional': 'Comité Ejecutivo Nacional',
    'lider-regional': 'Líder Regional',
    'comite-departamental': 'Comité Departamental',
    'candidato': 'Candidato',
    'influenciador': 'Influenciador Digital',
    'lider': 'Líder Comunitario',
    'ciudadano-base': 'Votante/Simpatizante'
  };

  const allRoles: UserRole[] = [
    'comite-ejecutivo-nacional',
    'lider-regional', 
    'comite-departamental',
    'candidato',
    'influenciador',
    'lider',
    'ciudadano-base'
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', onClick: () => setSidebarOpen(false) },
    { icon: BarChart3, label: 'Analytics', onClick: () => alert('📊 Módulo de Analytics activado') },
    { icon: Users, label: 'Gestión de Usuarios', onClick: () => alert('👥 Gestión de usuarios activada') },
    { icon: Calendar, label: 'Calendario', onClick: () => alert('📅 Calendario de eventos activado') },
    { icon: Database, label: 'Base de Datos', onClick: () => alert('🗃️ Base de datos activada') },
    { icon: Megaphone, label: 'Campañas', onClick: () => alert('📢 Módulo de campañas activado') },
    { icon: Settings, label: 'Configuración', onClick: () => alert('⚙️ Configuración del sistema activada') }
  ];

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      await loginWithRole(newRole, state.user?.name || 'Usuario Demo', 'Región Demo', 'Departamento Demo');
      setShowRoleSelector(false);
    } catch (error) {
      logError('Error cambiando rol:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`🔍 Buscando: "${searchQuery}"\n\nResultados encontrados:\n• Campaña Digital 2024\n• Métricas de Participación\n• Usuario María González\n• Evento: Foro Ciudadano`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleAIChat = async () => {
    if (!currentMessage.trim() || !genAI) return;

    const userMessage = currentMessage;
    setCurrentMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Eres el asistente oficial del partido político MAIS (Movimiento Alternativo Indígena y Social) de Colombia. 

CONTEXTO DEL PARTIDO MAIS:
- Movimiento político alternativo de Colombia
- Enfoque en la participación ciudadana y la justicia social
- Representación de comunidades indígenas y grupos sociales alternativos
- Propuestas de cambio social, económico y político
- Valores: inclusión, sostenibilidad, transparencia, participación democrática

INSTRUCCIONES:
- Responde SOLO sobre temas relacionados con MAIS y política colombiana
- Mantén un tono profesional pero cercano
- Incluye propuestas concretas del partido cuando sea relevante
- Si preguntan algo no relacionado con MAIS, redirige amablemente al contexto político

PREGUNTA DEL USUARIO: ${userMessage}

Responde de manera informativa y útil sobre MAIS y sus propuestas políticas.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      logError('Error en chat IA:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hay un problema técnico. Como representante de MAIS, te invito a visitar nuestras redes sociales oficiales para más información sobre nuestras propuestas políticas.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'comite-ejecutivo-nacional': return 'from-red-600 to-red-700';
      case 'lider-regional': return 'from-yellow-500 to-yellow-600';
      case 'comite-departamental': return 'from-green-600 to-green-700';
      case 'candidato': return 'from-red-500 to-yellow-500';
      case 'influenciador': return 'from-purple-500 to-pink-500';
      case 'lider': return 'from-green-500 to-yellow-500';
      case 'ciudadano-base': return 'from-yellow-500 to-green-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="relative">
                  <img src="/mais-logo.svg" alt="MAIS Logo" className="h-10 w-10 mr-3 rounded-lg shadow-md" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">
                    MAIS
                  </h1>
                  <p className="text-sm font-medium text-gray-600">Centro de Mando Digital</p>
                </div>
                <div className="ml-3 flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                    🚀 LIVE
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    AI
                  </span>
                  {showInstallPrompt && (
                    <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-medium animate-bounce">
                      📱 PWA
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar campaña, usuario, métricas..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:shadow-lg text-sm transition-all duration-300 placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Search Mobile */}
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Search className="h-5 w-5" />
                <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>

              {/* Messages */}
              <button 
                onClick={() => setShowAIChat(!showAIChat)}
                className="relative p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
                title="Chat IA MAIS"
              >
                <MessageCircle className="h-5 w-5" />
                {state.messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce font-bold shadow-lg">
                    {state.messages.length > 9 ? '9+' : state.messages.length}
                  </span>
                )}
                <div className="absolute inset-0 rounded-xl bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>

              {/* Notifications */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
                title="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-bold shadow-lg">
                    {notifications}
                  </span>
                )}
                <div className="absolute inset-0 rounded-xl bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>

              {/* PWA Install */}
              <button 
                onClick={handleInstallPWA}
                className="relative p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
                title="Instalar Aplicación MAIS"
              >
                <Download className="h-5 w-5" />
                <div className="absolute inset-0 rounded-xl bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {showInstallPrompt && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>

              {/* Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
                  title="Cambiar Rol"
                >
                  <RefreshCw className="h-5 w-5" />
                  <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </button>

                {/* Role Selector Dropdown */}
                {showRoleSelector && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">🔄 Cambiar Rol de Usuario</h3>
                      <div className="space-y-2">
                        {allRoles.map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                              state.user?.role === role
                                ? `bg-gradient-to-r ${getRoleColor(role)} text-white shadow-lg`
                                : 'hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-medium ${state.user?.role === role ? 'text-white' : 'text-gray-900'}`}>
                                  {roleNames[role]}
                                </div>
                                <div className={`text-sm ${state.user?.role === role ? 'text-white opacity-90' : 'text-gray-500'}`}>
                                  {role}
                                </div>
                              </div>
                              {state.user?.role === role && (
                                <span className="text-white font-bold">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => setShowRoleSelector(false)}
                          className="w-full p-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex items-center space-x-3 ml-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{state.user?.name}</p>
                  <p className="text-xs font-medium bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
                    {roleNames[state.user?.role || '']}
                  </p>
                </div>
                
                <div className="relative group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(state.user?.role || '')} rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white group-hover:scale-105 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">
                      {state.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-105 group"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                  <div className="absolute inset-0 rounded-xl bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 z-40">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-4 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">🔔 Notificaciones</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm font-medium text-yellow-800">Nueva campaña creada</p>
                <p className="text-xs text-yellow-600">Hace 2 minutos</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-800">Métrica actualizada</p>
                <p className="text-xs text-blue-600">Hace 5 minutos</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-medium text-green-800">Usuario registrado</p>
                <p className="text-xs text-green-600">Hace 10 minutos</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full p-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-96 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">🤖 Asistente IA MAIS</h3>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">¡Hola! Soy el asistente IA del partido MAIS.</p>
                  <p className="text-gray-500 text-sm">Pregúntame sobre nuestras propuestas políticas, programas y visión de país.</p>
                </div>
              )}
              
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">Escribiendo...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                  placeholder="Pregunta sobre las propuestas de MAIS..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  onClick={handleAIChat}
                  disabled={!currentMessage.trim() || isTyping}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <img src="/mais-logo.svg" alt="MAIS" className="h-10 w-10 mr-3 rounded-lg" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">
                  MAIS
                </h2>
              </div>
              
              <nav className="mt-8 px-4">
                <div className="space-y-1">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="group flex items-center px-4 py-3 text-base font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.label}
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center px-4 py-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(state.user?.role || '')} rounded-lg flex items-center justify-center mr-3`}>
                      <span className="text-white font-bold">
                        {state.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{state.user?.name}</p>
                      <p className="text-xs text-gray-500">{roleNames[state.user?.role || '']}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 px-4 space-y-2">
                    <button
                      onClick={handleInstallPWA}
                      className="group flex items-center px-4 py-2 text-sm font-medium text-green-600 rounded-lg hover:text-green-900 hover:bg-green-100 w-full text-left transition-colors"
                    >
                      <Smartphone className="mr-3 h-5 w-5" />
                      📱 Instalar App
                    </button>
                    
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        setShowAIChat(true);
                      }}
                      className="group flex items-center px-4 py-2 text-sm font-medium text-blue-600 rounded-lg hover:text-blue-900 hover:bg-blue-100 w-full text-left transition-colors"
                    >
                      <Bot className="mr-3 h-5 w-5" />
                      🤖 Chat IA MAIS
                    </button>
                    
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        alert('❤️ ¡Comparte MAIS en redes sociales y ayúdanos a llegar a más colombianos!');
                      }}
                      className="group flex items-center px-4 py-2 text-sm font-medium text-pink-600 rounded-lg hover:text-pink-900 hover:bg-pink-100 w-full text-left transition-colors"
                    >
                      <Share2 className="mr-3 h-5 w-5" />
                      ❤️ Compartir
                    </button>
                    
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        setShowPrivacyPolicy(true);
                      }}
                      className="group flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      <ExternalLink className="mr-3 h-5 w-5" />
                      🔒 Privacidad
                    </button>
                    
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        logout();
                      }}
                      className="group flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:text-red-900 hover:bg-red-100 w-full text-left transition-colors"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16 pb-20 md:pb-0">
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        onNavigate={handleMobileNavigation}
        activeSection={activeSection}
      />

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <PWAInstallPrompt 
          onClose={() => setShowInstallPrompt(false)}
          onInstall={handleInstallPWA}
        />
      )}

      {/* Privacy Link */}
      <button
        onClick={() => setShowPrivacyPolicy(true)}
        className="fixed bottom-4 left-4 text-xs text-gray-500 hover:text-gray-700 bg-white bg-opacity-80 px-2 py-1 rounded hidden md:block z-30"
      >
        Privacidad
      </button>

      {/* Developer Credit */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white bg-opacity-80 px-2 py-1 rounded hidden md:block z-30">
        by Daniel Lopez "DSimnivaciones"
      </div>

      {/* Floating PWA Install Button */}
      <FloatingPWAButton />
    </div>
  );
};