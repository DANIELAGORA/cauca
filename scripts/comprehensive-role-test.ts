#!/usr/bin/env tsx
// SCRIPT EJECUTABLE PARA TESTING COMPLETO DE ROLES
// Ejecución: npm run test:roles-comprehensive

import { config } from 'dotenv';
config(); // Cargar variables de entorno

import RoleTestingSuite from '../src/test/RoleTestingSuite';
import { logInfo, logError } from '../src/utils/logger';

console.log('🎯 MAIS CAUCA - COMPREHENSIVE ROLE TESTING SUITE');
console.log('==============================================');
console.log('📅 Fecha:', new Date().toLocaleString('es-CO'));
console.log('🌐 Entorno: Producción - https://maiscauca.netlify.app');
console.log('🗄️  Base de datos: Supabase PostgreSQL');
console.log('');

async function runComprehensiveRoleTests() {
  try {
    console.log('🚀 INICIANDO SUITE COMPLETA DE TESTING...');
    console.log('');
    
    const testSuite = new RoleTestingSuite();
    const report = await testSuite.runComprehensiveTests();
    
    // MOSTRAR RESULTADOS
    console.log('📊 REPORTE FINAL DE TESTING');
    console.log('==========================');
    console.log(`✅ Tests exitosos: ${report.passedTests}`);
    console.log(`❌ Tests fallidos: ${report.failedTests}`);
    console.log(`📈 Tasa de éxito: ${((report.passedTests / report.totalTests) * 100).toFixed(1)}%`);
    console.log(`⏱️  Tiempo total: ${(report.executionTime / 1000).toFixed(2)}s`);
    console.log('');
    
    // DETALLES POR TEST
    console.log('📋 DETALLE POR TEST:');
    console.log('-------------------');
    report.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      const time = `(${result.executionTime}ms)`;
      console.log(`${status} ${result.testName} ${time}`);
      
      if (!result.passed && result.error) {
        console.log(`   📝 Error: ${result.error}`);
      }
      
      if (result.details) {
        console.log(`   📊 Detalles:`, JSON.stringify(result.details, null, 2).slice(0, 200) + '...');
      }
      console.log('');
    });
    
    // ISSUES CRÍTICOS
    if (report.criticalIssues.length > 0) {
      console.log('🚨 ISSUES CRÍTICOS IDENTIFICADOS:');
      console.log('-------------------------------');
      report.criticalIssues.forEach(issue => {
        console.log(`⚠️  ${issue}`);
      });
      console.log('');
    }
    
    // SUGERENCIAS
    if (report.suggestions.length > 0) {
      console.log('💡 SUGERENCIAS:');
      console.log('---------------');
      report.suggestions.forEach(suggestion => {
        console.log(`💡 ${suggestion}`);
      });
      console.log('');
    }
    
    // ESTADO FINAL
    console.log('🏁 ESTADO FINAL:');
    console.log('---------------');
    if (report.overallPassed) {
      console.log('✅ TODOS LOS TESTS PASARON - Sistema operativo');
      console.log('🚀 El sistema de roles está listo para producción');
      console.log('');
      console.log('📋 ACCIONES RECOMENDADAS:');
      console.log('- Sistema funcionando correctamente ✅');
      console.log('- Continuar con implementación de estructura zonal');
      console.log('- Monitorear usuarios reales para asegurar funcionalidad');
    } else {
      console.log('❌ ALGUNOS TESTS FALLARON - Acción requerida');
      console.log('⚠️  El sistema necesita correcciones antes de uso completo');
      console.log('');
      console.log('🔧 ACCIONES CRÍTICAS:');
      report.criticalIssues.forEach(issue => {
        console.log(`- ${issue}`);
      });
      console.log('');
      console.log('💡 PRÓXIMOS PASOS:');
      report.suggestions.forEach(suggestion => {
        console.log(`- ${suggestion}`);
      });
    }
    
    console.log('');
    console.log('📞 CONTACTO TÉCNICO:');
    console.log('- Para soporte: Verificar logs de Supabase');
    console.log('- Para desarrollo: Revisar GitHub Issues');
    console.log('');
    console.log('🏁 TESTING COMPLETADO');
    
    // Exit code basado en resultados
    process.exit(report.overallPassed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ ERROR CRÍTICO EN TESTING SUITE:');
    console.error(error);
    
    console.log('');
    console.log('🚨 SISTEMA NO VERIFICADO');
    console.log('⚠️  No se pudo completar la verificación del sistema de roles');
    console.log('');
    console.log('🔧 ACCIONES INMEDIATAS:');
    console.log('- Verificar conectividad a Supabase');
    console.log('- Confirmar variables de entorno');
    console.log('- Revisar permisos de base de datos');
    
    process.exit(2);
  }
}

// Ejecutar testing
runComprehensiveRoleTests();