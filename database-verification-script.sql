-- =============================================================================
-- MAIS CAUCA - DATABASE VERIFICATION AND INTEGRITY CHECK SCRIPT
-- Comprehensive verification of all electoral data and system integrity
-- =============================================================================

-- =============================================================================
-- DATA INTEGRITY CHECKS
-- =============================================================================

DO $$
DECLARE
    check_result RECORD;
    total_officials INTEGER;
    expected_officials INTEGER := 96; -- Expected total from electoral data
    error_count INTEGER := 0;
    warning_count INTEGER := 0;
BEGIN
    RAISE NOTICE '🔍 STARTING MAIS CAUCA DATABASE VERIFICATION...';
    RAISE NOTICE '================================================';
    
    -- =============================================================================
    -- 1. COUNT VERIFICATION
    -- =============================================================================
    
    SELECT COUNT(*) INTO total_officials 
    FROM public.user_profiles 
    WHERE (metadata->>'esRealElecto')::boolean = true;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 OFFICIAL COUNT VERIFICATION:';
    RAISE NOTICE '   Expected Officials: %', expected_officials;
    RAISE NOTICE '   Actual Officials: %', total_officials;
    
    IF total_officials < expected_officials THEN
        RAISE NOTICE '⚠️  WARNING: Missing % officials', (expected_officials - total_officials);
        warning_count := warning_count + 1;
    ELSIF total_officials > expected_officials THEN
        RAISE NOTICE '⚠️  WARNING: % extra officials found', (total_officials - expected_officials);
        warning_count := warning_count + 1;
    ELSE
        RAISE NOTICE '✅ Official count matches expected number';
    END IF;
    
    -- =============================================================================
    -- 2. ROLE DISTRIBUTION VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '🏛️ ROLE DISTRIBUTION VERIFICATION:';
    
    FOR check_result IN 
        SELECT 
            role,
            COUNT(*) as actual_count,
            CASE role
                WHEN 'director-departamental' THEN 1
                WHEN 'alcalde' THEN 5
                WHEN 'diputado-asamblea' THEN 7
                WHEN 'concejal' THEN 83
                WHEN 'jal-local' THEN 1
                ELSE 0
            END as expected_count
        FROM public.user_profiles 
        WHERE (metadata->>'esRealElecto')::boolean = true
        GROUP BY role
        ORDER BY 
            CASE role
                WHEN 'director-departamental' THEN 1
                WHEN 'alcalde' THEN 2
                WHEN 'diputado-asamblea' THEN 3
                WHEN 'concejal' THEN 4
                WHEN 'jal-local' THEN 5
                ELSE 6
            END
    LOOP
        IF check_result.actual_count = check_result.expected_count THEN
            RAISE NOTICE '   ✅ %: % (correct)', 
                UPPER(REPLACE(check_result.role::text, '-', ' ')), check_result.actual_count;
        ELSE
            RAISE NOTICE '   ❌ %: % (expected %)', 
                UPPER(REPLACE(check_result.role::text, '-', ' ')), 
                check_result.actual_count, check_result.expected_count;
            error_count := error_count + 1;
        END IF;
    END LOOP;
    
    -- =============================================================================
    -- 3. REQUIRED FIELDS VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '📝 REQUIRED FIELDS VERIFICATION:';
    
    -- Check for missing emails
    SELECT COUNT(*) INTO total_officials
    FROM public.user_profiles 
    WHERE (metadata->>'esRealElecto')::boolean = true 
      AND (email IS NULL OR email = '');
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ❌ % officials missing email addresses', total_officials;
        error_count := error_count + 1;
    ELSE
        RAISE NOTICE '   ✅ All officials have email addresses';
    END IF;
    
    -- Check for missing phone numbers
    SELECT COUNT(*) INTO total_officials
    FROM public.user_profiles 
    WHERE (metadata->>'esRealElecto')::boolean = true 
      AND (phone IS NULL OR phone = '');
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ⚠️  % officials missing phone numbers', total_officials;
        warning_count := warning_count + 1;
    ELSE
        RAISE NOTICE '   ✅ All officials have phone numbers';
    END IF;
    
    -- Check for missing full names
    SELECT COUNT(*) INTO total_officials
    FROM public.user_profiles 
    WHERE (metadata->>'esRealElecto')::boolean = true 
      AND (full_name IS NULL OR full_name = '');
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ❌ % officials missing full names', total_officials;
        error_count := error_count + 1;
    ELSE
        RAISE NOTICE '   ✅ All officials have full names';
    END IF;
    
    -- =============================================================================
    -- 4. GENDER DISTRIBUTION VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '👥 GENDER DISTRIBUTION VERIFICATION:';
    
    FOR check_result IN 
        SELECT 
            gender,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM public.user_profiles 
        WHERE (metadata->>'esRealElecto')::boolean = true
          AND gender IS NOT NULL
        GROUP BY gender
        ORDER BY count DESC
    LOOP
        RAISE NOTICE '   %: % (%% of total)', 
            CASE check_result.gender 
                WHEN 'M' THEN 'Male' 
                WHEN 'F' THEN 'Female' 
                ELSE 'Other' 
            END,
            check_result.count,
            check_result.percentage;
    END LOOP;
    
    -- =============================================================================
    -- 5. MUNICIPALITY COVERAGE VERIFICATION  
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '🏘️ MUNICIPALITY COVERAGE VERIFICATION:';
    
    FOR check_result IN 
        SELECT 
            metadata->>'municipio' as municipality,
            COUNT(*) as officials_count
        FROM public.user_profiles 
        WHERE (metadata->>'esRealElecto')::boolean = true
          AND metadata->>'municipio' IS NOT NULL
        GROUP BY metadata->>'municipio'
        ORDER BY COUNT(*) DESC
        LIMIT 10
    LOOP
        RAISE NOTICE '   %: % officials', check_result.municipality, check_result.officials_count;
    END LOOP;
    
    -- Count total municipalities with representation
    SELECT COUNT(DISTINCT metadata->>'municipio') INTO total_officials
    FROM public.user_profiles 
    WHERE (metadata->>'esRealElecto')::boolean = true
      AND metadata->>'municipio' IS NOT NULL;
    
    RAISE NOTICE '   📍 Total municipalities with MAIS representation: %', total_officials;
    
    -- =============================================================================
    -- 6. ORGANIZATIONAL STRUCTURE SYNC VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '🏗️ ORGANIZATIONAL STRUCTURE SYNC VERIFICATION:';
    
    -- Check if all user_profiles have corresponding organizational_structure records
    SELECT COUNT(*) INTO total_officials
    FROM public.user_profiles up
    LEFT JOIN public.organizational_structure os ON up.id = os.profile_id
    WHERE (up.metadata->>'esRealElecto')::boolean = true
      AND os.id IS NULL;
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ❌ % officials missing from organizational structure', total_officials;
        error_count := error_count + 1;
    ELSE
        RAISE NOTICE '   ✅ All officials properly synced with organizational structure';
    END IF;
    
    -- Check hierarchy relationships
    SELECT COUNT(*) INTO total_officials
    FROM public.hierarchy_relationships;
    
    RAISE NOTICE '   🔗 Total hierarchy relationships: %', total_officials;
    
    -- =============================================================================
    -- 7. PERFORMANCE METRICS VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '📈 PERFORMANCE METRICS VERIFICATION:';
    
    SELECT COUNT(*) INTO total_officials
    FROM public.performance_metrics pm
    JOIN public.organizational_structure os ON pm.organization_member_id = os.id
    WHERE os.is_elected = true;
    
    RAISE NOTICE '   📊 Officials with performance metrics: %', total_officials;
    
    -- =============================================================================
    -- 8. EMAIL UNIQUENESS VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '📧 EMAIL UNIQUENESS VERIFICATION:';
    
    SELECT COUNT(*) INTO total_officials
    FROM (
        SELECT email, COUNT(*) 
        FROM public.user_profiles 
        WHERE (metadata->>'esRealElecto')::boolean = true
          AND email IS NOT NULL
        GROUP BY email 
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ❌ % duplicate email addresses found', total_officials;
        error_count := error_count + 1;
        
        -- Show duplicate emails
        FOR check_result IN 
            SELECT email, COUNT(*) as duplicate_count
            FROM public.user_profiles 
            WHERE (metadata->>'esRealElecto')::boolean = true
              AND email IS NOT NULL
            GROUP BY email 
            HAVING COUNT(*) > 1
            LIMIT 5
        LOOP
            RAISE NOTICE '     - %: % occurrences', check_result.email, check_result.duplicate_count;
        END LOOP;
    ELSE
        RAISE NOTICE '   ✅ All email addresses are unique';
    END IF;
    
    -- =============================================================================
    -- 9. DOCUMENT NUMBER VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '🆔 DOCUMENT NUMBER VERIFICATION:';
    
    SELECT COUNT(*) INTO total_officials
    FROM public.user_profiles 
    WHERE (metadata->>'esRealElecto')::boolean = true 
      AND (document_number IS NULL OR document_number = '');
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ⚠️  % officials missing document numbers', total_officials;
        warning_count := warning_count + 1;
    ELSE
        RAISE NOTICE '   ✅ All officials have document numbers';
    END IF;
    
    -- Check for duplicate document numbers
    SELECT COUNT(*) INTO total_officials
    FROM (
        SELECT document_number, COUNT(*) 
        FROM public.user_profiles 
        WHERE (metadata->>'esRealElecto')::boolean = true
          AND document_number IS NOT NULL
          AND document_number != ''
        GROUP BY document_number 
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ❌ % duplicate document numbers found', total_officials;
        error_count := error_count + 1;
    ELSE
        RAISE NOTICE '   ✅ All document numbers are unique';
    END IF;
    
    -- =============================================================================
    -- 10. LEGACY PROFILES TABLE SYNC VERIFICATION
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '🔄 LEGACY PROFILES SYNC VERIFICATION:';
    
    SELECT COUNT(*) INTO total_officials
    FROM public.user_profiles up
    LEFT JOIN public.profiles p ON up.user_id = p.id
    WHERE (up.metadata->>'esRealElecto')::boolean = true
      AND p.id IS NULL;
    
    IF total_officials > 0 THEN
        RAISE NOTICE '   ❌ % officials missing from legacy profiles table', total_officials;
        error_count := error_count + 1;
    ELSE
        RAISE NOTICE '   ✅ All officials synced with legacy profiles table';
    END IF;
    
    -- =============================================================================
    -- FINAL VERIFICATION SUMMARY
    -- =============================================================================
    
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE '🎯 VERIFICATION SUMMARY:';
    RAISE NOTICE '================================================';
    
    IF error_count = 0 AND warning_count = 0 THEN
        RAISE NOTICE '✅ DATABASE VERIFICATION PASSED COMPLETELY!';
        RAISE NOTICE '   All data integrity checks passed successfully.';
        RAISE NOTICE '   The MAIS Cauca political command center database';
        RAISE NOTICE '   is fully operational and ready for production use.';
    ELSIF error_count = 0 THEN
        RAISE NOTICE '⚠️  DATABASE VERIFICATION PASSED WITH WARNINGS';
        RAISE NOTICE '   Errors: %', error_count;
        RAISE NOTICE '   Warnings: %', warning_count;
        RAISE NOTICE '   The system is operational but some non-critical';
        RAISE NOTICE '   data quality issues should be addressed.';
    ELSE
        RAISE NOTICE '❌ DATABASE VERIFICATION FAILED';
        RAISE NOTICE '   Errors: %', error_count;
        RAISE NOTICE '   Warnings: %', warning_count;
        RAISE NOTICE '   Critical issues must be resolved before';
        RAISE NOTICE '   the system can be considered production-ready.';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 FINAL STATISTICS:';
    
    SELECT COUNT(*) INTO total_officials FROM public.user_profiles WHERE (metadata->>'esRealElecto')::boolean = true;
    RAISE NOTICE '   Total Elected Officials: %', total_officials;
    
    SELECT COUNT(DISTINCT metadata->>'municipio') INTO total_officials FROM public.user_profiles WHERE (metadata->>'esRealElecto')::boolean = true;
    RAISE NOTICE '   Municipalities Represented: %', total_officials;
    
    SELECT COUNT(*) INTO total_officials FROM public.organizational_structure WHERE is_elected = true;
    RAISE NOTICE '   Organizational Records: %', total_officials;
    
    SELECT COUNT(*) INTO total_officials FROM public.hierarchy_relationships;
    RAISE NOTICE '   Hierarchy Relationships: %', total_officials;
    
    SELECT COUNT(*) INTO total_officials FROM public.performance_metrics;
    RAISE NOTICE '   Performance Records: %', total_officials;
    
    RAISE NOTICE '================================================';
    RAISE NOTICE '🚀 MAIS CAUCA DATABASE VERIFICATION COMPLETED!';
    RAISE NOTICE '================================================';
    
END $$;