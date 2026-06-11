export interface NetworkMetric {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  change: string;
  isPositive: boolean;
  historicalData: { time: string; value: number }[];
  description: string;
}

export interface MetricSummary {
  pageLoadTime: NetworkMetric;
  pageViews: NetworkMetric;
  bounceRate: NetworkMetric;
  totalSessions: NetworkMetric;
  averageSessionLength: NetworkMetric;
  pageViewsPerSession: NetworkMetric;
}

export interface CorrelationData {
  loadTimeRange: string;
  bounceRate: number;
  sampleCount: number;
}

export interface HourlyTrendData {
  time: string;
  trafficLoad: number; // in Gbps or transactions/sec
  avgResponseTime: number; // in ms
  serverCpu: number; // in %
  packetLoss: number; // in %
}

export interface PredictionRequest {
  metricsSummary: {
    pageLoadTime: number;
    pageViews: number;
    bounceRate: number;
    totalSessions: number;
    averageSessionLength: number;
    pageViewsPerSession: number;
  };
  recentLogs: string[];
}

export interface PredictionResponse {
  insights: string;
  status: 'optimal' | 'warning' | 'critical';
  confidence: number;
  recommendedActions: string[];
  analyzedAt: string;
}
