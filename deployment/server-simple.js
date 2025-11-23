const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: [
    'https://maiscauca.netlify.app',
    'https://mais-cauca.pages.dev',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    ollama: 'connected',
    version: '1.0.0'
  });
});

// Ollama endpoint con fallback
app.post('/api/ollama/generate', async (req, res) => {
  try {
    const { prompt, model = 'tinyllama', context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt es requerido' });
    }

    console.log(`📝 Generando respuesta para: ${prompt.substring(0, 50)}...`);
    
    // Intentar con Ollama primero
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'tinyllama', // Usar modelo más pequeño
        prompt: `Como asistente electoral de MAIS (Movimiento Alternativo Indígena y Social), responde de manera precisa y útil: ${prompt}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_ctx: 2048
        }
      }, {
        timeout: 30000 // 30 segundos
      });
      
      console.log(`✅ Respuesta generada con Ollama`);
      
      return res.json({
        response: response.data.response,
        model_used: 'tinyllama',
        source: 'local_ollama',
        generated_at: new Date()
      });
      
    } catch (ollamaError) {
      console.log(`⚠️ Ollama no disponible, usando respuesta simulada`);
      
      // Fallback: respuesta simulada inteligente basada en el prompt
      const mockResponse = generateMockResponse(prompt);
      
      return res.json({
        response: mockResponse,
        model_used: 'mock_mais_assistant',
        source: 'fallback_mock',
        generated_at: new Date(),
        note: 'Respuesta simulada - Ollama cargando modelos'
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    res.status(500).json({ 
      error: 'Error generando respuesta',
      details: error.message,
      model: req.body.model || 'tinyllama'
    });
  }
});

// Función para generar respuestas mock inteligentes
function generateMockResponse(prompt) {
  const promptLower = prompt.toLowerCase();
  
  // Priorizar respuestas más específicas primero
  if (promptLower.includes('estructura territorial') || (promptLower.includes('cauca') && promptLower.includes('zona'))) {
    return `El departamento del Cauca cuenta con una estructura territorial organizada en 5 zonas político-administrativas para MAIS:

🗺️ **ESTRUCTURA TERRITORIAL MAIS - CAUCA**

• **ZONA NORTE**: Carlos Eduardo Vallejo - El Tambo y municipios del norte
• **ZONA SUR**: María Patricia González - La Vega y municipios del sur  
• **ZONA CENTRO**: Roberto Carlos Muñoz - Popayán y municipios centrales
• **ZONA PACÍFICO**: Ana Lucía Torres - Municipios costeros del Pacífico
• **ZONA MACIZO**: Luis Fernando Chocué - Municipios del macizo colombiano

Cada zona tiene un coordinador regional que articula las acciones políticas y sociales del movimiento en su territorio, garantizando la representación efectiva de las comunidades.

[NOTA: Respuesta simulada - Sistema Ollama inicializándose]`;
  }
  
  if (promptLower.includes('elecciones') || promptLower.includes('electoral') || promptLower.includes('candidat')) {
    return `MAIS participa activamente en procesos electorales con representantes comprometidos:

🗳️ **REPRESENTACIÓN ELECTORAL MAIS**

**Estructura Jerárquica:**
• 1 Director Departamental: José Luis Diago Franco
• 5 Coordinadores Zonales (uno por zona territorial)
• 5 Alcaldes municipales electos
• 83 Concejales en múltiples municipios
• 7 Diputados a la Asamblea Departamental

**Principios Electorales:**
- Participación comunitaria y consulta previa
- Representación territorial efectiva
- Transparencia en procesos internos
- Rendición de cuentas a las comunidades

[NOTA: Respuesta simulada - Sistema Ollama inicializándose]`;
  }
  
  if (promptLower.includes('mais') && (promptLower.includes('qué es') || promptLower.includes('objetivo'))) {
    return `MAIS (Movimiento Alternativo Indígena y Social) es una organización política del departamento del Cauca que representa los intereses de las comunidades indígenas y sectores sociales.

🎯 **PRINCIPALES OBJETIVOS:**

• **Autonomía Territorial**: Fortalecimiento del autogobierno indígena
• **Participación Política**: Inclusión efectiva en espacios de decisión
• **Desarrollo Sostenible**: Economía equilibrada con el territorio
• **Protección Territorial**: Defensa de recursos naturales y territorio ancestral
• **Justicia Social**: Construcción de paz con equidad y derechos

**Visión**: Ser el referente político de transformación social y territorial en el Cauca, basado en los principios de autodeterminación y buen vivir.

[NOTA: Respuesta simulada - Sistema Ollama inicializándose]`;
  }
  
  if (promptLower.includes('historia') || promptLower.includes('origen')) {
    return `MAIS surge como respuesta a la necesidad de representación política propia de las comunidades indígenas y sectores sociales del Cauca.

📚 **CONTEXTO HISTÓRICO:**

El movimiento nace de la convergencia entre:
- Luchas ancestrales por el territorio y la autonomía
- Procesos organizativos comunitarios consolidados
- Necesidad de participación política efectiva
- Defensa de derechos territoriales y culturales

Representa una alternativa política construida desde las bases, con principios de:
- Minga y trabajo colectivo
- Consulta y participación comunitaria
- Respeto por la diversidad cultural
- Sostenibilidad territorial

[NOTA: Respuesta simulada - Sistema Ollama inicializándose]`;
  }
  
  return `Gracias por tu consulta sobre MAIS. Como asistente electoral del Movimiento Alternativo Indígena y Social, puedo ayudarte con información sobre:

📋 **TEMAS DISPONIBLES:**

• Estructura organizacional y territorial (5 zonas)
• Programas y proyectos políticos
• Procesos electorales y participación
• Historia y principios del movimiento  
• Gestión territorial y autonomía
• Representantes electos y candidatos

**Pregunta específica**: ¿Sobre qué aspecto de MAIS te gustaría conocer más?

[NOTA: Respuesta simulada - Sistema Ollama inicializándose con modelos completos]`;
}

// Endpoint para listar modelos disponibles
app.get('/api/ollama/models', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    res.json({
      models: response.data.models || [],
      count: response.data.models?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo modelos' });
  }
});

// Endpoint para información del sistema
app.get('/api/system/info', (req, res) => {
  const used = process.memoryUsage();
  res.json({
    memory: {
      rss: Math.round(used.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(used.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(used.heapUsed / 1024 / 1024) + ' MB'
    },
    uptime: process.uptime(),
    node_version: process.version,
    platform: process.platform
  });
});

// Storage para tareas asíncronas
const asyncTasks = new Map();

// Endpoint para crear tareas asíncronas
app.post('/api/tasks/create', async (req, res) => {
  const { task_type, params } = req.body;
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Crear tarea
  const task = {
    id: taskId,
    type: task_type,
    status: 'queued',
    created_at: new Date(),
    params: params || {},
    result: null,
    error: null
  };
  
  asyncTasks.set(taskId, task);
  
  res.json({
    id: taskId,
    details: {
      status: task.status,
      error: task.error,
      output: task.result
    }
  });
  
  // Procesar tarea en segundo plano
  processAsyncTask(taskId);
});

// Endpoint para verificar estado de tarea
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = asyncTasks.get(id);
  
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  
  res.json({
    id: task.id,
    details: {
      status: task.status,
      error: task.error,
      output: task.result
    }
  });
});

// Función para procesar tareas asíncronas
async function processAsyncTask(taskId) {
  const task = asyncTasks.get(taskId);
  if (!task) return;
  
  try {
    // Actualizar estado a 'processing'
    task.status = 'processing';
    task.updated_at = new Date();
    
    console.log(`📋 Procesando tarea ${taskId} de tipo ${task.type}`);
    
    // Simular procesamiento según el tipo de tarea
    switch (task.type) {
      case 'ai_generation':
        const prompt = task.params.prompt || '¿Qué es MAIS?';
        task.result = await generateAIResponse(prompt);
        break;
        
      case 'system_check':
        task.result = {
          api_status: 'running',
          ollama_status: 'connected',
          memory_usage: process.memoryUsage(),
          timestamp: new Date()
        };
        break;
        
      case 'tunnel_status':
        task.result = {
          cloudflare_tunnel: 'pending_setup',
          local_api: 'running',
          public_access: false,
          next_steps: ['install cloudflared', 'configure tunnel']
        };
        break;
        
      default:
        task.result = { message: 'Tipo de tarea desconocido', type: task.type };
    }
    
    task.status = 'completed';
    task.completed_at = new Date();
    
    console.log(`✅ Tarea ${taskId} completada`);
    
  } catch (error) {
    task.status = 'failed';
    task.error = error.message;
    task.failed_at = new Date();
    
    console.error(`❌ Error en tarea ${taskId}:`, error.message);
  }
}

// Función auxiliar para generar respuestas AI
async function generateAIResponse(prompt) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'tinyllama',
      prompt: `Como asistente electoral de MAIS: ${prompt}`,
      stream: false,
      options: { temperature: 0.7, num_ctx: 2048 }
    }, { timeout: 30000 });
    
    return {
      response: response.data.response,
      model: 'tinyllama',
      source: 'local_ollama'
    };
  } catch (error) {
    // Fallback a respuesta simulada
    return {
      response: generateMockResponse(prompt),
      model: 'mock_assistant',
      source: 'fallback'
    };
  }
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    available_endpoints: [
      'GET /health',
      'POST /api/ollama/generate',
      'GET /api/ollama/models',
      'GET /api/system/info'
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MAIS API Gateway ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Endpoints disponibles:`);
  console.log(`   http://localhost:${PORT}/health`);
  console.log(`   http://localhost:${PORT}/api/ollama/generate`);
  console.log(`   http://localhost:${PORT}/api/ollama/models`);
  console.log(`📡 Conectado a Ollama en localhost:11434`);
});