import { mockAuthService, useAuth as useMockAuth } from './mockAuth';

// Mock Supabase compatibility client
export const supabase = {
  auth: mockAuthService
};

export const useAuth = useMockAuth;
