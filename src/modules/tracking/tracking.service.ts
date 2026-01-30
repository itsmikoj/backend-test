import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabaseClient";
import { TrackingEvent, Metrics } from "../../models/trackingModels";

export class TrackingService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  async trackEvent(event: TrackingEvent) {
    const { data, error } = await this.supabase
      .from("events")
      .insert({
        app_id: event.app_id,
        user_id: event.user_id,
        session_id: event.session_id,
        event_name: event.event_name,
        event_data: event.event_data,
        revenue: event.revenue,
        currency: event.currency,
        timestamp: event.timestamp,
        device_info: event.device_info,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async batchTrackEvents(events: TrackingEvent[]) {
    const { data, error } = await this.supabase
      .from("events")
      .insert(
        events.map(event => ({
          app_id: event.app_id,
          user_id: event.user_id,
          session_id: event.session_id,
          event_name: event.event_name,
          event_data: event.event_data,
          revenue: event.revenue,
          currency: event.currency,
          timestamp: event.timestamp,
          device_info: event.device_info,
        }))
      )
      .select();

    if (error) throw error;
    return data;
  }

  async getMetrics(
    appId: string,
    startDate: string,
    endDate: string,
    includeTrends: boolean = false
  ): Promise<Metrics> {
    let query = this.supabase
      .from("events")
      .select("*")
      .eq("app_id", appId)
      .gte("timestamp", startDate)
      .lte("timestamp", endDate);

    const { data: events, error } = await query;
    if (error) throw error;

    const installs = events?.filter(e => e.event_name === 'app_install') || [];
    const reinstalls = events?.filter(e => e.event_name === 'app_reinstall') || [];
    const uninstalls = events?.filter(e => e.event_name === 'app_uninstall') || [];

    const subscriptionStarted = events?.filter(e => e.event_name === 'subscription_started') || [];
    const subscriptionCancelled = events?.filter(e => e.event_name === 'subscription_cancelled') || [];
    const subscriptionTrial = events?.filter(e => e.event_name === 'subscription_trial') || [];

    const activeSubsQuery = await this.supabase
      .from("events")
      .select("user_id, event_name, timestamp")
      .eq("app_id", appId)
      .in("event_name", ['subscription_started', 'subscription_cancelled'])
      .order("timestamp", { ascending: false });

    const userSubs = new Map<string, string>();
    activeSubsQuery.data?.forEach(e => {
      if (!userSubs.has(e.user_id)) {
        userSubs.set(e.user_id, e.event_name);
      }
    });
    const activeSubs = Array.from(userSubs.values()).filter(s => s === 'subscription_started').length;

    const revenueEvents = events?.filter(e => e.revenue && e.revenue > 0) || [];
    const totalRevenue = revenueEvents.reduce((sum, e) => sum + (e.revenue || 0), 0);

    const revenueByCurrency: Record<string, number> = {};
    revenueEvents.forEach(e => {
      const curr = e.currency || 'USD';
      revenueByCurrency[curr] = (revenueByCurrency[curr] || 0) + (e.revenue || 0);
    });

    const uniqueUsers = new Set(events?.map(e => e.user_id).filter(Boolean)).size;
    const averageRevenuePerUser = uniqueUsers > 0 ? totalRevenue / uniqueUsers : 0;

    const eventCounts: Record<string, number> = {};
    events?.forEach(e => {
      eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
    });
    const topEvents = Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([event_name, count]) => ({ event_name, count }));

    const totalInstalls = installs.length + reinstalls.length;
    const totalUninstalls = uninstalls.length;
    const retentionRate = totalInstalls > 0 ? ((totalInstalls - totalUninstalls) / totalInstalls) * 100 : 0;
    const churnRate = totalInstalls > 0 ? (totalUninstalls / totalInstalls) * 100 : 0;

    let dailyTrends;
    if (includeTrends) {
      const trendData: Record<string, {
        installs: number;
        revenue: number;
        users: Set<string>
      }> = {};

      events?.forEach(e => {
        const date = e.timestamp.split('T')[0];
        if (!trendData[date]) {
          trendData[date] = { installs: 0, revenue: 0, users: new Set() };
        }

        if (e.event_name === 'app_install' || e.event_name === 'app_reinstall') {
          trendData[date].installs++;
        }
        if (e.revenue && e.revenue > 0) {
          trendData[date].revenue += e.revenue;
        }
        if (e.user_id) {
          trendData[date].users.add(e.user_id);
        }
      });

      dailyTrends = Object.entries(trendData)
        .map(([date, data]) => ({
          date,
          installs: data.installs,
          revenue: data.revenue,
          active_users: data.users.size,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    return {
      period: {
        start_date: startDate,
        end_date: endDate,
      },
      installs: {
        total: totalInstalls,
        new_installs: installs.length,
        reinstalls: reinstalls.length,
      },
      uninstalls: {
        total: totalUninstalls,
      },
      subscriptions: {
        active: activeSubs,
        new: subscriptionStarted.length,
        cancelled: subscriptionCancelled.length,
        trial: subscriptionTrial.length,
      },
      revenue: {
        total: totalRevenue,
        by_currency: revenueByCurrency,
        average_per_user: averageRevenuePerUser,
      },
      events: {
        total: events?.length || 0,
        unique_users: uniqueUsers,
        top_events: topEvents,
      },
      retention: {
        rate: retentionRate,
        churn_rate: churnRate,
      },
      daily_trends: dailyTrends,
    };
  }
}
