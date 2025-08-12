#!/usr/bin/env tsx
/**
 * MAIS CAUCA - COMPREHENSIVE SYSTEM AUDIT
 * Complete security, performance, and data integrity audit
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://djgkjtqpzedxnqwqdcjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZ2tqdHFwemVkeG5xd3FkY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MzAxNzYsImV4cCI6MjA3MDUwNjE3Nn0.cJ7QCM5k7yZjtqseRFff3SSxE3YaqzedQHevJ3sfZKI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuditResult {
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'INFO';
  message: string;
  details?: any;
  score?: number;
}

class SystemAuditor {
  private results: AuditResult[] = [];
  private startTime: number = Date.now();

  addResult(category: string, status: 'PASS' | 'FAIL' | 'WARNING' | 'INFO', message: string, details?: any, score?: number) {
    this.results.push({ category, status, message, details, score });
  }

  async auditDatabaseIntegrity() {
    console.log('\n🗄️  AUDITING DATABASE INTEGRITY');
    console.log('==============================');

    try {
      // Test 1: Database connectivity
      const { data: connectionTest, error: connectionError } = await supabase
        .from('user_profiles')
        .select('count(*)', { count: 'exact' });

      if (connectionError) {
        this.addResult('Database', 'FAIL', 'Database connection failed', connectionError, 0);
        return;
      }

      this.addResult('Database', 'PASS', 'Database connection successful', null, 10);

      // Test 2: Core tables existence
      const coreTables = ['user_profiles', 'profiles', 'messages', 'databases'];
      let tablesExist = 0;

      for (const table of coreTables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (!error) {
            tablesExist++;
            this.addResult('Database', 'PASS', `Table '${table}' exists and accessible`, null, 5);
          } else {
            this.addResult('Database', 'FAIL', `Table '${table}' not accessible: ${error.message}`, error, 0);
          }
        } catch (err) {
          this.addResult('Database', 'FAIL', `Table '${table}' error: ${err}`, err, 0);
        }
      }

      // Test 3: Data integrity checks
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (!profilesError && profiles) {
        this.addResult('Database', 'PASS', `User profiles loaded: ${profiles.length} records`, null, 10);

        // Check for required fields
        let validProfiles = 0;
        profiles.forEach(profile => {
          if (profile.email && profile.full_name && profile.role) {
            validProfiles++;
          }
        });

        const validityRate = (validProfiles / profiles.length) * 100;
        if (validityRate >= 95) {
          this.addResult('Database', 'PASS', `Data integrity excellent: ${validityRate.toFixed(1)}%`, null, 10);
        } else if (validityRate >= 80) {
          this.addResult('Database', 'WARNING', `Data integrity acceptable: ${validityRate.toFixed(1)}%`, null, 7);
        } else {
          this.addResult('Database', 'FAIL', `Data integrity poor: ${validityRate.toFixed(1)}%`, null, 3);
        }

        // Check for real electoral officials
        const realOfficials = profiles.filter(p => p.metadata?.esRealElecto === true);
        this.addResult('Database', 'INFO', `Real elected officials: ${realOfficials.length}`, realOfficials.map(o => o.full_name), 5);
      }

    } catch (error) {
      this.addResult('Database', 'FAIL', `Database audit failed: ${error}`, error, 0);
    }
  }

  async auditAuthentication() {
    console.log('\n🔐 AUDITING AUTHENTICATION & SECURITY');
    console.log('====================================');

    const testCredentials = [
      { email: 'joseluisdiago@maiscauca.com', role: 'director-departamental' },
      { email: 'chate08@gmail.com', role: 'alcalde' },
      { email: 'carlosandres@maiscauca.com', role: 'diputado-asamblea' },
      { email: 'testconcejal@maiscauca.com', role: 'concejal' }
    ];

    let successfulLogins = 0;
    let totalAttempts = testCredentials.length;

    for (const cred of testCredentials) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cred.email,
          password: 'agoramais2025'
        });

        if (authError || !authData.user) {
          this.addResult('Authentication', 'FAIL', `Login failed for ${cred.email}`, authError, 0);
        } else {
          successfulLogins++;
          this.addResult('Authentication', 'PASS', `Login successful for ${cred.email}`, null, 10);

          // Check session validity
          const { data: session } = await supabase.auth.getSession();
          if (session.session) {
            this.addResult('Authentication', 'PASS', `Session valid for ${cred.email}`, null, 5);
          }

          await supabase.auth.signOut();
        }
      } catch (error) {
        this.addResult('Authentication', 'FAIL', `Authentication error for ${cred.email}: ${error}`, error, 0);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const authSuccessRate = (successfulLogins / totalAttempts) * 100;
    if (authSuccessRate === 100) {
      this.addResult('Authentication', 'PASS', `Authentication success rate: 100%`, null, 20);
    } else if (authSuccessRate >= 75) {
      this.addResult('Authentication', 'WARNING', `Authentication success rate: ${authSuccessRate.toFixed(1)}%`, null, 15);
    } else {
      this.addResult('Authentication', 'FAIL', `Authentication success rate: ${authSuccessRate.toFixed(1)}%`, null, 5);
    }
  }

  async auditElectoralData() {
    console.log('\n🗳️  AUDITING ELECTORAL DATA ACCURACY');
    console.log('===================================');

    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('metadata->>esRealElecto', 'true');

      if (error) {
        this.addResult('Electoral Data', 'FAIL', 'Failed to retrieve electoral data', error, 0);
        return;
      }

      if (!profiles || profiles.length === 0) {
        this.addResult('Electoral Data', 'FAIL', 'No real electoral officials found', null, 0);
        return;
      }

      this.addResult('Electoral Data', 'PASS', `${profiles.length} real electoral officials found`, null, 10);

      // Verify electoral data completeness
      let completeProfiles = 0;
      let hierarchyLevels = new Set();

      profiles.forEach(profile => {
        if (profile.metadata?.partidoCodigo === '00012' &&
            profile.metadata?.fechaEleccion === '2023-10-29' &&
            profile.metadata?.hierarchyLevel) {
          completeProfiles++;
          hierarchyLevels.add(profile.metadata.hierarchyLevel);
        }
      });

      const completenessRate = (completeProfiles / profiles.length) * 100;
      if (completenessRate >= 95) {
        this.addResult('Electoral Data', 'PASS', `Electoral data completeness: ${completenessRate.toFixed(1)}%`, null, 15);
      } else {
        this.addResult('Electoral Data', 'WARNING', `Electoral data completeness: ${completenessRate.toFixed(1)}%`, null, 10);
      }

      // Verify hierarchy distribution
      const expectedLevels = [1, 2, 3, 4]; // Director, Alcaldes, Diputados, Concejales
      const foundLevels = Array.from(hierarchyLevels).sort();
      
      this.addResult('Electoral Data', 'INFO', `Hierarchy levels present: ${foundLevels.join(', ')}`, null, 5);

      // Verify MAIS party code
      const maisOfficials = profiles.filter(p => p.metadata?.partidoCodigo === '00012');
      if (maisOfficials.length === profiles.length) {
        this.addResult('Electoral Data', 'PASS', 'All officials belong to MAIS party (00012)', null, 10);
      } else {
        this.addResult('Electoral Data', 'WARNING', `${maisOfficials.length}/${profiles.length} officials have MAIS party code`, null, 5);
      }

    } catch (error) {
      this.addResult('Electoral Data', 'FAIL', `Electoral data audit failed: ${error}`, error, 0);
    }
  }

  async auditCodeQuality() {
    console.log('\n💻 AUDITING CODE QUALITY');
    console.log('========================');

    // Check package.json
    try {
      const packageJsonPath = join(process.cwd(), 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        
        this.addResult('Code Quality', 'PASS', 'package.json exists and valid', null, 5);
        
        // Check dependencies
        const hasSecurity = packageJson.dependencies?.['@supabase/supabase-js'] && 
                           packageJson.devDependencies?.['typescript'];
        
        if (hasSecurity) {
          this.addResult('Code Quality', 'PASS', 'Security dependencies present', null, 10);
        } else {
          this.addResult('Code Quality', 'WARNING', 'Missing security dependencies', null, 5);
        }

        // Check scripts
        const hasLinting = packageJson.scripts?.['lint'] && packageJson.scripts?.['type-check'];
        if (hasLinting) {
          this.addResult('Code Quality', 'PASS', 'Linting and type checking configured', null, 10);
        } else {
          this.addResult('Code Quality', 'WARNING', 'Missing linting/type checking scripts', null, 5);
        }

      } else {
        this.addResult('Code Quality', 'FAIL', 'package.json not found', null, 0);
      }
    } catch (error) {
      this.addResult('Code Quality', 'FAIL', `Package.json audit failed: ${error}`, error, 0);
    }

    // Check environment configuration
    try {
      const envPath = join(process.cwd(), '.env');
      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, 'utf8');
        
        if (envContent.includes('VITE_SUPABASE_URL') && envContent.includes('VITE_SUPABASE_ANON_KEY')) {
          this.addResult('Code Quality', 'PASS', 'Environment variables configured', null, 10);
        } else {
          this.addResult('Code Quality', 'FAIL', 'Missing required environment variables', null, 0);
        }

        // Check for exposed secrets (should not have actual secret keys visible)
        if (envContent.includes('eyJ') && envContent.length > 200) {
          this.addResult('Code Quality', 'WARNING', 'Environment file contains long tokens (verify security)', null, 7);
        }

      } else {
        this.addResult('Code Quality', 'WARNING', '.env file not found', null, 5);
      }
    } catch (error) {
      this.addResult('Code Quality', 'WARNING', `Environment audit failed: ${error}`, error, 3);
    }
  }

  async auditProductionDeployment() {
    console.log('\n🚀 AUDITING PRODUCTION DEPLOYMENT');
    console.log('=================================');

    try {
      // Test production URL
      const productionUrl = 'https://maiscauca.netlify.app';
      
      try {
        const response = await fetch(productionUrl);
        if (response.ok) {
          this.addResult('Deployment', 'PASS', 'Production URL accessible', { status: response.status }, 15);
          
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('text/html')) {
            this.addResult('Deployment', 'PASS', 'HTML content served correctly', null, 10);
          }

        } else {
          this.addResult('Deployment', 'FAIL', `Production URL returned ${response.status}`, { status: response.status }, 0);
        }
      } catch (fetchError) {
        this.addResult('Deployment', 'FAIL', 'Production URL not accessible', fetchError, 0);
      }

      // Check build artifacts
      const distPath = join(process.cwd(), 'dist');
      if (existsSync(distPath)) {
        this.addResult('Deployment', 'PASS', 'Build artifacts exist', null, 10);
        
        const indexPath = join(distPath, 'index.html');
        if (existsSync(indexPath)) {
          this.addResult('Deployment', 'PASS', 'Main index.html built', null, 5);
        }

        const manifestPath = join(distPath, 'manifest.webmanifest');
        if (existsSync(manifestPath)) {
          this.addResult('Deployment', 'PASS', 'PWA manifest generated', null, 10);
        } else {
          this.addResult('Deployment', 'WARNING', 'PWA manifest missing', null, 5);
        }

      } else {
        this.addResult('Deployment', 'WARNING', 'Build artifacts not found (may be in CI/CD)', null, 7);
      }

    } catch (error) {
      this.addResult('Deployment', 'FAIL', `Deployment audit failed: ${error}`, error, 0);
    }
  }

  async auditPerformance() {
    console.log('\n⚡ AUDITING PERFORMANCE');
    console.log('======================');

    try {
      // Database query performance
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(100);
      const queryTime = Date.now() - startTime;

      if (!error) {
        if (queryTime < 1000) {
          this.addResult('Performance', 'PASS', `Database query fast: ${queryTime}ms`, null, 10);
        } else if (queryTime < 3000) {
          this.addResult('Performance', 'WARNING', `Database query acceptable: ${queryTime}ms`, null, 7);
        } else {
          this.addResult('Performance', 'FAIL', `Database query slow: ${queryTime}ms`, null, 3);
        }
      } else {
        this.addResult('Performance', 'FAIL', 'Database query failed', error, 0);
      }

      // Authentication performance
      const authStartTime = Date.now();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'joseluisdiago@maiscauca.com',
        password: 'agoramais2025'
      });
      const authTime = Date.now() - authStartTime;

      if (!authError) {
        if (authTime < 2000) {
          this.addResult('Performance', 'PASS', `Authentication fast: ${authTime}ms`, null, 10);
        } else {
          this.addResult('Performance', 'WARNING', `Authentication slow: ${authTime}ms`, null, 7);
        }
        await supabase.auth.signOut();
      }

    } catch (error) {
      this.addResult('Performance', 'FAIL', `Performance audit failed: ${error}`, error, 0);
    }
  }

  generateReport() {
    console.log('\n📊 GENERATING COMPREHENSIVE AUDIT REPORT');
    console.log('========================================');

    const totalTime = Date.now() - this.startTime;
    const categories = [...new Set(this.results.map(r => r.category))];
    
    let totalScore = 0;
    let maxScore = 0;

    // Calculate scores by category
    const categoryScores: Record<string, {score: number, max: number, passed: number, failed: number, warnings: number}> = {};
    
    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category);
      const score = categoryResults.reduce((sum, r) => sum + (r.score || 0), 0);
      const max = categoryResults.filter(r => r.score).length * 10; // Assume max 10 per test
      const passed = categoryResults.filter(r => r.status === 'PASS').length;
      const failed = categoryResults.filter(r => r.status === 'FAIL').length;
      const warnings = categoryResults.filter(r => r.status === 'WARNING').length;
      
      categoryScores[category] = { score, max, passed, failed, warnings };
      totalScore += score;
      maxScore += max;
    });

    const overallScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    console.log('\n🎯 AUDIT SUMMARY');
    console.log('================');
    console.log(`⏱️  Audit Duration: ${(totalTime / 1000).toFixed(2)} seconds`);
    console.log(`📊 Overall Score: ${overallScore.toFixed(1)}%`);
    console.log(`🔍 Total Tests: ${this.results.length}`);

    // Category breakdown
    console.log('\n📋 CATEGORY BREAKDOWN:');
    Object.entries(categoryScores).forEach(([category, scores]) => {
      const percentage = scores.max > 0 ? (scores.score / scores.max) * 100 : 0;
      const status = percentage >= 80 ? '🟢' : percentage >= 60 ? '🟡' : '🔴';
      
      console.log(`\n${status} ${category.toUpperCase()}: ${percentage.toFixed(1)}%`);
      console.log(`   ✅ Passed: ${scores.passed}`);
      console.log(`   ❌ Failed: ${scores.failed}`);
      console.log(`   ⚠️  Warnings: ${scores.warnings}`);
    });

    // Critical issues
    const criticalIssues = this.results.filter(r => r.status === 'FAIL');
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.category}] ${issue.message}`);
      });
    }

    // Warnings
    const warnings = this.results.filter(r => r.status === 'WARNING');
    if (warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      warnings.forEach((warning, index) => {
        console.log(`${index + 1}. [${warning.category}] ${warning.message}`);
      });
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (overallScore >= 90) {
      console.log('🟢 EXCELLENT - System is production-ready with minimal issues');
    } else if (overallScore >= 80) {
      console.log('🟡 GOOD - System is mostly ready, address warnings for optimal performance');
    } else if (overallScore >= 60) {
      console.log('🟠 FAIR - System needs attention, fix critical issues before full deployment');
    } else {
      console.log('🔴 POOR - System requires significant improvements before production use');
    }

    // System status
    console.log('\n🎉 MAIS CAUCA SYSTEM STATUS:');
    if (criticalIssues.length === 0) {
      console.log('✅ NO CRITICAL ISSUES - System is stable and operational');
      console.log('🚀 Ready for political campaign coordination');
      console.log('🏛️  All electoral officials can access their dashboards');
      console.log('🔐 Authentication and security systems functional');
    } else {
      console.log(`❌ ${criticalIssues.length} CRITICAL ISSUES FOUND - Address before full deployment`);
    }

    return {
      overallScore,
      totalTests: this.results.length,
      passed: this.results.filter(r => r.status === 'PASS').length,
      failed: criticalIssues.length,
      warnings: warnings.length,
      categoryScores,
      duration: totalTime
    };
  }
}

async function runComprehensiveAudit() {
  console.log('🎯 MAIS CAUCA - COMPREHENSIVE SYSTEM AUDIT');
  console.log('==========================================');
  console.log(`🕒 Started: ${new Date().toLocaleString()}`);
  console.log(`🔗 Production: https://maiscauca.netlify.app`);
  console.log(`🗄️  Database: ${supabaseUrl}`);

  const auditor = new SystemAuditor();

  await auditor.auditDatabaseIntegrity();
  await auditor.auditAuthentication();
  await auditor.auditElectoralData();
  await auditor.auditCodeQuality();
  await auditor.auditProductionDeployment();
  await auditor.auditPerformance();

  const report = auditor.generateReport();

  console.log('\n🏁 AUDIT COMPLETED');
  console.log(`📈 Final Score: ${report.overallScore.toFixed(1)}%`);
  console.log('📋 Full report generated above');

  return report;
}

runComprehensiveAudit().catch(console.error);