
// Usage limits
const MAX_DAILY_CHAR_LIMIT = 1000;
const MAX_DAILY_REQUESTS = 10;

// Get current date in YYYY-MM-DD format for key creation
const getCurrentDateKey = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Get metrics with proper date rotation and user prefix
const getTTSUsageMetrics = (userPrefix = '') => {
  const dateKey = getCurrentDateKey();
  const storageKey = `${userPrefix}elevenlabs_usage_${dateKey}`;
  
  let metrics = {
    dailyCharCount: 0,
    dailyRequestCount: 0
  };
  
  const savedMetrics = localStorage.getItem(storageKey);
  if (savedMetrics) {
    try {
      metrics = JSON.parse(savedMetrics);
    } catch (e) {
      console.error("Failed to parse saved metrics, using defaults");
    }
  }
  
  return metrics;
};

// Update metrics and save to localStorage
const updateTTSUsageMetrics = (charCount: number, userPrefix = '') => {
  const dateKey = getCurrentDateKey();
  const storageKey = `${userPrefix}elevenlabs_usage_${dateKey}`;
  
  const metrics = getTTSUsageMetrics(userPrefix);
  
  metrics.dailyCharCount += charCount;
  metrics.dailyRequestCount += 1;
  
  localStorage.setItem(storageKey, JSON.stringify(metrics));
  
  return metrics;
};

// Reset usage metrics
const resetUsageMetrics = (userPrefix = '') => {
  const dateKey = getCurrentDateKey();
  const storageKey = `${userPrefix}elevenlabs_usage_${dateKey}`;
  
  const metrics = {
    dailyCharCount: 0,
    dailyRequestCount: 0
  };
  
  localStorage.setItem(storageKey, JSON.stringify(metrics));
};

// Check if usage limits are exceeded
const isUsageLimitExceeded = (userPrefix = ''): boolean => {
  const metrics = getTTSUsageMetrics(userPrefix);
  return (
    metrics.dailyCharCount >= MAX_DAILY_CHAR_LIMIT || 
    metrics.dailyRequestCount >= MAX_DAILY_REQUESTS
  );
};

// Get usage limits
const getUsageLimits = () => {
  return {
    MAX_DAILY_CHAR_LIMIT,
    MAX_DAILY_REQUESTS
  };
};

export {
  getTTSUsageMetrics,
  updateTTSUsageMetrics,
  resetUsageMetrics,
  isUsageLimitExceeded,
  getUsageLimits
};
