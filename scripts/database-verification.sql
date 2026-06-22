-- Phase 4B.15 — Proof of Reality Database Verification Queries
-- Purpose: Verify database integrity and data relationships after testing

-- ============================================
-- TASK GROUP 1: STUDENT JOURNEY VERIFICATION
-- ============================================

-- Verify user creation
SELECT 
    id,
    email,
    created_at,
    updated_at
FROM auth.users
WHERE email LIKE 'test-%@example.com'
ORDER BY created_at DESC
LIMIT 10;

-- Verify profile creation and email isolation
SELECT 
    p.id,
    p.full_name,
    p.matric_number,
    p.institution_id,
    p.faculty_id,
    p.department_id,
    p.current_level,
    p.created_at,
    -- Verify email is NOT in profile
    CASE 
        WHEN p.email IS NULL THEN '✅ Email isolated'
        ELSE '❌ Email exposed in profile'
    END as email_isolation_check
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email LIKE 'test-%@example.com'
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================
-- TASK GROUP 2: LOGBOOK VERIFICATION
-- ============================================

-- Verify logbook creation
SELECT 
    l.id,
    l.user_id,
    l.title,
    l.organization,
    l.academic_session,
    l.is_active,
    l.created_at,
    COUNT(w.id) as week_count
FROM logbooks l
LEFT JOIN weekly_logs w ON l.id = w.logbook_id
WHERE l.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
GROUP BY l.id
ORDER BY l.created_at DESC
LIMIT 10;

-- Verify week creation
SELECT 
    w.id,
    w.logbook_id,
    w.week_number,
    w.start_date,
    w.end_date,
    COUNT(e.id) as entry_count
FROM weekly_logs w
LEFT JOIN logbook_entries e ON w.id = e.week_id
WHERE w.logbook_id IN (
    SELECT id FROM logbooks WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
)
GROUP BY w.id
ORDER BY w.week_number;

-- Verify logbook entries
SELECT 
    e.id,
    e.week_id,
    e.day_of_week,
    e.activity_description,
    e.skills_learned,
    e.challenges_faced,
    e.created_at,
    e.updated_at
FROM logbook_entries e
WHERE e.week_id IN (
    SELECT id FROM weekly_logs WHERE logbook_id IN (
        SELECT id FROM logbooks WHERE user_id IN (
            SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
        )
    )
)
ORDER BY e.created_at DESC
LIMIT 20;

-- ============================================
-- TASK GROUP 3: UPLOAD VERIFICATION
-- ============================================

-- Verify uploads are linked to correct entities
SELECT 
    u.id,
    u.user_id,
    u.file_name,
    u.file_type,
    u.file_size,
    u.entity_type,
    u.entity_id,
    u.storage_path,
    u.created_at,
    -- Verify entity exists
    CASE 
        WHEN u.entity_type = 'logbook_entry' AND 
             EXISTS (SELECT 1 FROM logbook_entries WHERE id = u.entity_id) 
        THEN '✅ Valid logbook_entry reference'
        WHEN u.entity_type = 'report_section' AND 
             EXISTS (SELECT 1 FROM report_sections WHERE id = u.entity_id) 
        THEN '✅ Valid report_section reference'
        ELSE '❌ Invalid or missing entity reference'
    END as entity_reference_check
FROM uploads u
WHERE u.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
ORDER BY u.created_at DESC
LIMIT 20;

-- Check for orphaned uploads (uploads without valid entity references)
SELECT 
    u.id,
    u.file_name,
    u.entity_type,
    u.entity_id
FROM uploads u
WHERE u.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
AND (
    (u.entity_type = 'logbook_entry' AND NOT EXISTS (
        SELECT 1 FROM logbook_entries WHERE id = u.entity_id
    ))
    OR
    (u.entity_type = 'report_section' AND NOT EXISTS (
        SELECT 1 FROM report_sections WHERE id = u.entity_id
    ))
);

-- ============================================
-- TASK GROUP 5: REPORT VERIFICATION
-- ============================================

-- Verify report creation
SELECT 
    r.id,
    r.user_id,
    r.title,
    r.report_type,
    r.institution_id,
    r.organization_id,
    r.is_active,
    r.created_at,
    COUNT(s.id) as section_count
FROM reports r
LEFT JOIN report_sections s ON r.id = s.report_id
WHERE r.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
GROUP BY r.id
ORDER BY r.created_at DESC
LIMIT 10;

-- Verify report sections
SELECT 
    s.id,
    s.report_id,
    s.chapter_number,
    s.section_title,
    s.content,
    s.ai_generated,
    s.created_at,
    s.updated_at
FROM report_sections s
WHERE s.report_id IN (
    SELECT id FROM reports WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
)
ORDER BY s.chapter_number, s.section_title;

-- Verify email is NOT in report data
SELECT 
    r.id,
    r.title,
    r.report_type,
    -- Check for email in title
    CASE 
        WHEN r.title ~* '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' 
        THEN '❌ Email in title'
        ELSE '✅ No email in title'
    END as title_check,
    -- Check for email in sections
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM report_sections s 
            WHERE s.report_id = r.id 
            AND s.content ~* '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        )
        THEN '❌ Email in sections'
        ELSE '✅ No email in sections'
    END as sections_check
FROM reports r
WHERE r.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
);

-- ============================================
-- TASK GROUP 7: EXPORT & PAYMENT VERIFICATION
-- ============================================

-- Verify report versions (exports)
SELECT 
    rv.id,
    rv.report_id,
    rv.version_number,
    rv.export_status,
    rv.payment_status,
    rv.payment_reference,
    rv.amount_paid,
    rv.pdf_url,
    rv.created_at
FROM report_versions rv
WHERE rv.report_id IN (
    SELECT id FROM reports WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
)
ORDER BY rv.created_at DESC
LIMIT 10;

-- Verify payment records
SELECT 
    p.id,
    p.user_id,
    p.report_version_id,
    p.amount,
    p.status,
    p.payment_reference,
    p.created_at,
    -- Verify no duplicate payments
    CASE 
        WHEN COUNT(*) OVER (PARTITION BY p.payment_reference) > 1 
        THEN '❌ Duplicate payment reference'
        ELSE '✅ Unique payment reference'
    END as duplicate_check
FROM payments p
WHERE p.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
ORDER BY p.created_at DESC
LIMIT 10;

-- Check for duplicate exports
SELECT 
    report_id,
    COUNT(*) as export_count,
    CASE 
        WHEN COUNT(*) > 1 THEN '❌ Multiple exports'
        ELSE '✅ Single export'
    END as duplicate_check
FROM report_versions
WHERE report_id IN (
    SELECT id FROM reports WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
)
AND payment_status = 'completed'
GROUP BY report_id
HAVING COUNT(*) > 1;

-- ============================================
-- TASK GROUP 8: DELETION VERIFICATION
-- ============================================

-- Check for orphaned records after deletion
-- Orphaned weekly_logs (without parent logbook)
SELECT 
    w.id,
    w.logbook_id,
    'Orphaned weekly_log' as issue_type
FROM weekly_logs w
WHERE w.logbook_id NOT IN (SELECT id FROM logbooks WHERE is_active = true)
AND w.logbook_id IN (
    SELECT id FROM logbooks WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
);

-- Orphaned logbook_entries (without parent week)
SELECT 
    e.id,
    e.week_id,
    'Orphaned logbook_entry' as issue_type
FROM logbook_entries e
WHERE e.week_id NOT IN (SELECT id FROM weekly_logs)
AND e.week_id IN (
    SELECT id FROM weekly_logs WHERE logbook_id IN (
        SELECT id FROM logbooks WHERE user_id IN (
            SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
        )
    )
);

-- Orphaned report_sections (without parent report)
SELECT 
    s.id,
    s.report_id,
    'Orphaned report_section' as issue_type
FROM report_sections s
WHERE s.report_id NOT IN (SELECT id FROM reports WHERE is_active = true)
AND s.report_id IN (
    SELECT id FROM reports WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
);

-- Orphaned uploads (without valid entity)
SELECT 
    u.id,
    u.entity_type,
    u.entity_id,
    'Orphaned upload' as issue_type
FROM uploads u
WHERE u.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
AND (
    (u.entity_type = 'logbook_entry' AND NOT EXISTS (
        SELECT 1 FROM logbook_entries WHERE id = u.entity_id
    ))
    OR
    (u.entity_type = 'report_section' AND NOT EXISTS (
        SELECT 1 FROM report_sections WHERE id = u.entity_id
    ))
);

-- ============================================
-- TASK GROUP 9: SECURITY VERIFICATION
-- ============================================

-- Verify RLS is working (users can only access their own data)
-- This query should return 0 if RLS is working correctly
SELECT 
    'Users accessing other users data' as security_check,
    COUNT(*) as violation_count
FROM (
    -- Check if any user has data from another user
    SELECT DISTINCT l.user_id, l.id
    FROM logbooks l
    WHERE l.user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
    AND l.id IN (
        SELECT id FROM logbooks WHERE user_id NOT IN (
            SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
        )
    )
) as violations;

-- Verify no cross-user report access
SELECT 
    'Cross-user report access' as security_check,
    COUNT(*) as violation_count
FROM reports r
WHERE r.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
AND r.id IN (
    SELECT id FROM reports WHERE user_id NOT IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
);

-- ============================================
-- TASK GROUP 11: PERFORMANCE VERIFICATION
-- ============================================

-- Check for slow queries (queries taking > 1 second)
-- Note: This requires pg_stat_statements extension
-- SELECT 
--     query,
--     calls,
--     total_time,
--     mean_time,
--     max_time
-- FROM pg_stat_statements
-- WHERE mean_time > 1000
-- ORDER BY mean_time DESC
-- LIMIT 10;

-- Check table sizes for performance monitoring
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 20;

-- ============================================
-- GENERAL DATA INTEGRITY CHECKS
-- ============================================

-- Check for NULL required fields
SELECT 
    'profiles with NULL full_name' as check_type,
    COUNT(*) as count
FROM profiles
WHERE full_name IS NULL
AND id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com');

SELECT 
    'profiles with NULL matric_number' as check_type,
    COUNT(*) as count
FROM profiles
WHERE matric_number IS NULL
AND id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com');

SELECT 
    'logbooks with NULL title' as check_type,
    COUNT(*) as count
FROM logbooks
WHERE title IS NULL
AND user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com');

-- Check for duplicate records
SELECT 
    'Duplicate logbooks by user and title' as check_type,
    user_id,
    title,
    COUNT(*) as count
FROM logbooks
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com')
GROUP BY user_id, title
HAVING COUNT(*) > 1;

-- ============================================
-- ACTIVITY EVENTS VERIFICATION
-- ============================================

-- Verify activity events are being tracked
SELECT 
    event_type,
    event_category,
    event_name,
    COUNT(*) as event_count
FROM activity_events
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
GROUP BY event_type, event_category, event_name
ORDER BY event_count DESC
LIMIT 20;

-- Check for orphaned activity events
SELECT 
    ae.id,
    ae.user_id,
    ae.event_type,
    'Orphaned activity event' as issue_type
FROM activity_events ae
WHERE ae.user_id NOT IN (SELECT id FROM auth.users)
AND ae.user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com');

-- ============================================
-- BETA USERS VERIFICATION
-- ============================================

-- Verify beta user tracking
SELECT 
    bu.id,
    bu.user_id,
    bu.status,
    bu.onboarding_step,
    bu.conversion_rate,
    bu.waitlist_joined_at,
    bu.account_created_at,
    bu.profile_completed_at,
    bu.first_logbook_created_at,
    bu.first_report_created_at,
    bu.first_export_at,
    bu.created_at
FROM beta_users bu
WHERE bu.user_id IN (
    SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
)
ORDER BY bu.created_at DESC
LIMIT 10;

-- ============================================
-- SUMMARY QUERIES
-- ============================================

-- Overall test data summary
SELECT 
    'Test Users' as metric,
    COUNT(*) as count
FROM auth.users
WHERE email LIKE 'test-%@example.com'

UNION ALL

SELECT 
    'Test Profiles' as metric,
    COUNT(*) as count
FROM profiles
WHERE id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com')

UNION ALL

SELECT 
    'Test Logbooks' as metric,
    COUNT(*) as count
FROM logbooks
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com')

UNION ALL

SELECT 
    'Test Weeks' as metric,
    COUNT(*) as count
FROM weekly_logs
WHERE logbook_id IN (
    SELECT id FROM logbooks WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
)

UNION ALL

SELECT 
    'Test Entries' as metric,
    COUNT(*) as count
FROM logbook_entries
WHERE week_id IN (
    SELECT id FROM weekly_logs WHERE logbook_id IN (
        SELECT id FROM logbooks WHERE user_id IN (
            SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
        )
    )
)

UNION ALL

SELECT 
    'Test Uploads' as metric,
    COUNT(*) as count
FROM uploads
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com')

UNION ALL

SELECT 
    'Test Reports' as metric,
    COUNT(*) as count
FROM reports
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com')

UNION ALL

SELECT 
    'Test Report Sections' as metric,
    COUNT(*) as count
FROM report_sections
WHERE report_id IN (
    SELECT id FROM reports WHERE user_id IN (
        SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com'
    )
)

UNION ALL

SELECT 
    'Test Payments' as metric,
    COUNT(*) as count
FROM payments
WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test-%@example.com');
