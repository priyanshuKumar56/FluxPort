-- ============================================================================
-- FluxPort Complete Database Schema for Neon PostgreSQL
-- ============================================================================
-- This script creates all tables needed for FluxPort with full workspace
-- collaboration, settings, and interceptor rules support
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS TABLE (Custom auth - not using Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. WORKSPACES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_personal BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. WORKSPACE MEMBERS TABLE (Collaboration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer', -- 'owner', 'admin', 'editor', 'viewer'
    invited_by UUID REFERENCES public.users(id),
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active', -- 'pending', 'active', 'inactive'
    UNIQUE(workspace_id, user_id)
);

-- ============================================================================
-- 4. WORKSPACE INVITATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'viewer',
    token VARCHAR(255) NOT NULL UNIQUE,
    invited_by UUID NOT NULL REFERENCES public.users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, email)
);

-- ============================================================================
-- 5. COLLECTIONS TABLE (Postman-style collections - Workspace-Scoped)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_workspace ON public.collections(workspace_id);

-- ============================================================================
-- 6. FOLDERS TABLE (Nested folders within collections)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    parent_folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_folders_collection ON public.folders(collection_id);

-- ============================================================================
-- 7. SAVED REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    url TEXT NOT NULL,
    headers JSONB DEFAULT '{}',
    params JSONB DEFAULT '{}',
    auth JSONB DEFAULT '{}',
    body TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_requests_collection ON public.saved_requests(collection_id);
CREATE INDEX IF NOT EXISTS idx_saved_requests_folder ON public.saved_requests(folder_id);

-- ============================================================================
-- 8. INTERCEPTOR RULES TABLE (Workspace-Scoped)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.interceptor_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'REDIRECT', 'REPLACE_BODY', 'INJECT_SCRIPT', 'BLOCK', 'MODIFY_HEADERS', 'DELAY', 'MOCK_RESPONSE'
    match_type VARCHAR(50) DEFAULT 'contains', -- 'contains', 'regex', 'exact'
    match_pattern TEXT NOT NULL,
    methods VARCHAR(10)[], -- NULL means all methods
    config JSONB DEFAULT '{}',
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for workspace-scoped rule queries
CREATE INDEX IF NOT EXISTS idx_interceptor_rules_workspace_active ON public.interceptor_rules(workspace_id, is_active);

-- ============================================================================
-- 9. ENVIRONMENT VARIABLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.environment_variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    is_encrypted BOOLEAN DEFAULT false,
    environment VARCHAR(50) DEFAULT 'default', -- 'default', 'production', 'staging', 'development'
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, key, environment)
);

-- ============================================================================
-- 10. API KEYS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(10) NOT NULL,
    scopes JSONB DEFAULT '["read"]',
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- 11. API LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.api_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    rule_id UUID REFERENCES public.interceptor_rules(id) ON DELETE SET NULL,
    request_url TEXT NOT NULL,
    request_method VARCHAR(10) NOT NULL,
    request_headers JSONB,
    request_body TEXT,
    response_status INTEGER,
    response_headers JSONB,
    response_body TEXT,
    latency_ms INTEGER,
    client_ip INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 12. WORKSPACE SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, key)
);

-- ============================================================================
-- 13. ACTIVITY LOGS TABLE (Audit trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'invite', etc.
    entity_type VARCHAR(100) NOT NULL, -- 'workspace', 'collection', 'rule', etc.
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_token ON public.workspace_invitations(token);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_workspace ON public.workspace_invitations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_collections_workspace ON public.collections(workspace_id);
CREATE INDEX IF NOT EXISTS idx_folders_collection ON public.folders(collection_id);
CREATE INDEX IF NOT EXISTS idx_saved_requests_collection ON public.saved_requests(collection_id);
CREATE INDEX IF NOT EXISTS idx_saved_requests_folder ON public.saved_requests(folder_id);
CREATE INDEX IF NOT EXISTS idx_interceptor_rules_workspace ON public.interceptor_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_interceptor_rules_active ON public.interceptor_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_env_vars_workspace ON public.environment_variables(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_workspace ON public.api_keys(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_workspace ON public.api_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_timestamp ON public.api_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace ON public.activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_requests_updated_at BEFORE UPDATE ON public.saved_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interceptor_rules_updated_at BEFORE UPDATE ON public.interceptor_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_env_vars_updated_at BEFORE UPDATE ON public.environment_variables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create personal workspace on user creation
CREATE OR REPLACE FUNCTION create_personal_workspace()
RETURNS TRIGGER AS $$
DECLARE
    new_workspace_id UUID;
BEGIN
    INSERT INTO public.workspaces (name, slug, owner_id, is_personal, description)
    VALUES (
        COALESCE(NEW.full_name || '''s Workspace', 'My Workspace'),
        'ws-' || lower(substring(md5(random()::text), 1, 8)),
        NEW.id,
        true,
        'Personal workspace for ' || COALESCE(NEW.full_name, NEW.email)
    )
    RETURNING id INTO new_workspace_id;
    
    -- Add user as owner of their personal workspace
    INSERT INTO public.workspace_members (workspace_id, user_id, role, joined_at)
    VALUES (new_workspace_id, NEW.id, 'owner', NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_personal_workspace();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.activity_logs (workspace_id, user_id, action, entity_type, entity_id, metadata)
        VALUES (
            NEW.workspace_id,
            NEW.created_by,
            'create',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object('new_data', row_to_json(NEW))
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.activity_logs (workspace_id, user_id, action, entity_type, entity_id, metadata)
        VALUES (
            NEW.workspace_id,
            NEW.created_by,
            'update',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object('old_data', row_to_json(OLD), 'new_data', row_to_json(NEW))
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.activity_logs (workspace_id, user_id, action, entity_type, entity_id, metadata)
        VALUES (
            OLD.workspace_id,
            NULL,
            'delete',
            TG_TABLE_NAME,
            OLD.id,
            jsonb_build_object('old_data', row_to_json(OLD))
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Activity log triggers for important tables
CREATE TRIGGER log_collections_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_interceptor_rules_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.interceptor_rules
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_environment_variables_activity
    AFTER INSERT OR UPDATE OR DELETE ON public.environment_variables
    FOR EACH ROW EXECUTE FUNCTION log_activity();

-- ============================================================================
-- VIEWS FOR CONVENIENCE
-- ============================================================================

-- View: Workspace members with user details
CREATE OR REPLACE VIEW public.v_workspace_members AS
SELECT 
    wm.id,
    wm.workspace_id,
    wm.user_id,
    wm.role,
    wm.status,
    wm.joined_at,
    u.email,
    u.full_name,
    u.avatar_url
FROM public.workspace_members wm
JOIN public.users u ON wm.user_id = u.id;

-- View: User's accessible workspaces
CREATE OR REPLACE VIEW public.v_user_workspaces AS
SELECT 
    w.*,
    wm.role as member_role,
    wm.user_id
FROM public.workspaces w
JOIN public.workspace_members wm ON w.id = wm.workspace_id;

-- ============================================================================
-- INITIAL DATA (Optional - for testing)
-- ============================================================================

-- Create a demo user (password: 'demo123' - hashed with bcrypt)
-- INSERT INTO public.users (email, password_hash, full_name)
-- VALUES ('demo@fluxport.dev', '$2a$10$YourHashedPasswordHere', 'Demo User');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
