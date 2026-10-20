import { supabase } from './supabaseClient';
import { getUserProfile } from './localStorage'; // Fallback if auth is slow

// Fire-and-forget analytics tracker
export function trackEvent(eventName: string, metadata: Record<string, any> = {}) {
  try {
    // We use setTimeout to ensure this never blocks the main UI thread
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('app_events').insert({
        user_id: user?.id || null,
        event_name: eventName,
        metadata: metadata
      });
    }, 0);
  } catch (error) {
    // Silent fail - analytics should never break the app
    console.error('Analytics error:', error);
  }
}

// Track page views automatically
export function trackPageView(pageName: string) {
  trackEvent('page_view', { page: pageName });
}