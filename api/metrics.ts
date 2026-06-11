import type { MetricSummary, CorrelationData, HourlyTrendData } from '../src/types';

// Pure helper to generate seeded/simulated live data
function getSimulatedMetrics(simulateAnomaly?: boolean): {
  metrics: MetricSummary;
  correlationData: CorrelationData[];
  renderCorrelationData: CorrelationData[];
  hourlyTrendData: HourlyTrendData[];
} {
  const anomalyMult = simulateAnomaly ? 2.5 : 1.0;
  const anomalyCpu = simulateAnomaly ? 85 : 0;
  const anomalyLoss = simulateAnomaly ? 2.1 : 0;

  // 1. Page Load Time (LUX)
  const pageLoadCurrent = +(0.7 * anomalyMult + (Math.random() * 0.15 - 0.05)).toFixed(2);
  const pageLoadMetric = {
    id: 'page-load',
    name: 'Page Load (LUX)',
    value: pageLoadCurrent,
    unit: 's',
    change: simulateAnomaly ? '+185.2%' : '-4.2%',
    isPositive: !simulateAnomaly,
    historicalData: Array.from({ length: 8 }, (_, i) => ({
      time: `T-${7 - i}m`,
      value: +(0.65 + Math.random() * 0.15 + (simulateAnomaly && i > 5 ? 1.2 : 0)).toFixed(2),
    })),
    description: 'Average time taken for pages to load completely under live user experience monitoring.',
  };

  // 2. Page Views (LUX)
  const pageViewsVal = +(2.7 + (Math.random() * 0.1 - 0.05)).toFixed(2);
  const pageViewsMetric = {
    id: 'page-views',
    name: 'Page Views (LUX)',
    value: pageViewsVal,
    unit: 'M',
    change: '+12.6%',
    isPositive: true,
    historicalData: [
      { time: 'Day 1', value: 2.2 },
      { time: 'Day 2', value: 2.4 },
      { time: 'Day 3', value: 2.3 },
      { time: 'Day 4', value: 2.5 },
      { time: 'Day 5', value: 2.6 },
      { time: 'Day 6', value: 2.5 },
      { time: 'Day 7', value: pageViewsVal },
    ],
    description: 'Total number of page views, representing aggregate active volume consumption.',
  };

  // 3. Bounce Rate (LUX)
  const bounceRateCurrent = +(40.6 * (simulateAnomaly ? 1.4 : 1.0) + (Math.random() * 3.0 - 1.5)).toFixed(1);
  const bounceRateMetric = {
    id: 'bounce-rate',
    name: 'Bounce Rate (LUX)',
    value: Math.min(100, Math.max(0, bounceRateCurrent)),
    unit: '%',
    change: simulateAnomaly ? '+32.4%' : '-1.8%',
    isPositive: !simulateAnomaly,
    historicalData: Array.from({ length: 8 }, (_, i) => ({
      time: `T-${7 - i}m`,
      value: +(42.5 + Math.random() * 2.5 + (simulateAnomaly && i > 5 ? 12.0 : 0)).toFixed(1),
    })),
    description: 'Percentage of single-page sessions without any subsequent interaction.',
  };

  // 4. Total Sessions (LUX)
  const sessionsVal = Math.round(479 + (Math.random() * 10 - 5));
  const totalSessionsMetric = {
    id: 'total-sessions',
    name: 'Sessions (LUX)',
    value: sessionsVal,
    unit: 'K',
    change: '+8.4%',
    isPositive: true,
    historicalData: Array.from({ length: 8 }, (_, i) => ({
      time: `T-${7 - i}h`,
      value: Math.round(440 + i * 5 + Math.random() * 12),
    })),
    description: 'Aggregate number of logged and verified user sessions across the system.',
  };

  // 5. Average Session Length (LUX)
  const sessionLengthCurrent = Math.round(17 / anomalyMult + (Math.random() * 2 - 1));
  const avgSessionLengthMetric = {
    id: 'session-length',
    name: 'Session Length (LUX)',
    value: Math.max(1, sessionLengthCurrent),
    unit: 'min',
    change: simulateAnomaly ? '-52.1%' : '+2.4%',
    isPositive: !simulateAnomaly,
    historicalData: Array.from({ length: 8 }, (_, i) => ({
      time: `T-${7 - i}h`,
      value: Math.round((16 + Math.random() * 2.5) / (simulateAnomaly && i > 5 ? 2.5 : 1)),
    })),
    description: 'Median continuous connection duration for authenticated system sessions.',
  };

  // 6. Page Views Per Session (LUX)
  const pvsCurrent = +(2.0 / (simulateAnomaly ? 1.3 : 1.0) + (Math.random() * 0.4 - 0.2)).toFixed(1);
  const pvsMetric = {
    id: 'pvs-per-session',
    name: 'PVs Per Session (LUX)',
    value: Math.max(1.0, pvsCurrent),
    unit: 'pvs',
    change: simulateAnomaly ? '-21.2%' : '+0.5%',
    isPositive: !simulateAnomaly,
    historicalData: Array.from({ length: 8 }, (_, i) => ({
      time: `T-${7 - i}h`,
      value: +(2.1 + Math.random() * 0.3 - (simulateAnomaly && i > 5 ? 0.5 : 0)).toFixed(1),
    })),
    description: 'Average number of pages loaded during a single transaction session.',
  };

  // Static histogram/correlation for "Load Time vs. Bounce Rate"
  // Displays the bounce rate distribution against corresponding page load times
  const correlationData: CorrelationData[] = [
    { loadTimeRange: '0.0s - 0.2s', bounceRate: 25.4, sampleCount: 1540 },
    { loadTimeRange: '0.2s - 0.4s', bounceRate: 31.2, sampleCount: 4320 },
    { loadTimeRange: '0.4s - 0.6s', bounceRate: 36.8, sampleCount: 8850 },
    { loadTimeRange: '0.6s - 0.8s', bounceRate: 40.6, sampleCount: 14500 }, // Our current ~0.7s lies here with 40.6% bounce rate
    { loadTimeRange: '0.8s - 1.0s', bounceRate: 46.5, sampleCount: 9200 },
    { loadTimeRange: '1.0s - 1.2s', bounceRate: 53.1, sampleCount: 4100 },
    { loadTimeRange: '1.2s - 1.4s', bounceRate: 61.2, sampleCount: 2050 },
    { loadTimeRange: '1.4s+', bounceRate: 72.8, sampleCount: 1220 },
  ];

  // Correlation for "Start Render vs. Bounce Rate"
  const renderCorrelationData: CorrelationData[] = [
    { loadTimeRange: '0.0s - 0.1s', bounceRate: 22.1, sampleCount: 1100 },
    { loadTimeRange: '0.1s - 0.2s', bounceRate: 28.5, sampleCount: 3800 },
    { loadTimeRange: '0.2s - 0.3s', bounceRate: 34.0, sampleCount: 7400 },
    { loadTimeRange: '0.3s - 0.4s', bounceRate: 39.1, sampleCount: 15100 },
    { loadTimeRange: '0.4s - 0.5s', bounceRate: 45.4, sampleCount: 10400 },
    { loadTimeRange: '0.5s - 0.6s', bounceRate: 52.8, sampleCount: 5200 },
    { loadTimeRange: '0.6s - 0.7s', bounceRate: 60.5, sampleCount: 2300 },
    { loadTimeRange: '0.7s+', bounceRate: 71.2, sampleCount: 1500 },
  ];

  // 24-Hour trends data
  const baseHours = Array.from({ length: 24 }, (_, i) => {
    const hour = (new Date().getHours() - (23 - i) + 24) % 24;
    const hourStr = `${hour.toString().padStart(2, '0')}:00`;

    // Traffic builds up during the day, peaking at 14:00 - 20:00
    const loadFactor = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 0.4 + 0.6; // 0.2 to 1.0
    const baseTraffic = 3.2 + loadFactor * 5.0; // Gbps
    const baseLatency = Math.round(45 + loadFactor * 40); // ms
    const baseCpu = Math.round(25 + loadFactor * 35); // CPU %
    const lossChance = Math.random() < 0.1 ? 0.05 : 0;

    return {
      time: hourStr,
      trafficLoad: +(baseTraffic).toFixed(1),
      avgResponseTime: baseLatency,
      serverCpu: baseCpu,
      packetLoss: lossChance,
    };
  });

  // Apply real-time simulation overrides or anomaly conditions to the last few entries
  if (simulateAnomaly) {
    for (let i = 20; i < 24; i++) {
      baseHours[i].trafficLoad = +(baseHours[i].trafficLoad * 2.2).toFixed(1);
      baseHours[i].avgResponseTime = Math.round(baseHours[i].avgResponseTime * 3.5);
      baseHours[i].serverCpu = Math.min(100, Math.round(baseHours[i].serverCpu * 1.8 + 20));
      baseHours[i].packetLoss = +(baseHours[i].packetLoss + 1.2 + Math.random() * 0.5).toFixed(2);
    }
  } else {
    // Add lightweight jitter to the very last timestamp for live real-time simulation feel
    baseHours[23].trafficLoad = +(baseHours[23].trafficLoad + (Math.random() * 0.6 - 0.3)).toFixed(1);
    baseHours[23].avgResponseTime = Math.round(baseHours[23].avgResponseTime + (Math.random() * 8 - 4));
    baseHours[23].serverCpu = Math.max(5, Math.min(100, Math.round(baseHours[23].serverCpu + (Math.random() * 4 - 2))));
  }

  return {
    metrics: {
      pageLoadTime: pageLoadMetric,
      pageViews: pageViewsMetric,
      bounceRate: bounceRateMetric,
      totalSessions: totalSessionsMetric,
      averageSessionLength: avgSessionLengthMetric,
      pageViewsPerSession: pvsMetric,
    },
    correlationData,
    renderCorrelationData,
    hourlyTrendData: baseHours,
  };
}

// Handler functions for server routing support
export default function handler(req: any, res: any) {
  // Allow GET
  const simulateAnomaly = req.query?.simulateAnomaly === 'true';
  const responseData = getSimulatedMetrics(simulateAnomaly);
  
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(responseData);
}
