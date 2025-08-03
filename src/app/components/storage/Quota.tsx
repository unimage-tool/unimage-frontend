'use client';

import React, { useEffect, useState, useCallback } from 'react';

export interface QuotaData {
  maxQuotaBytes: number;
  usedQuotaBytes: number;
  remainingBytes: number;
  usagePercentage: number;
  maxQuotaGB: number;
  usedQuotaGB: number;
  unlimited: boolean;
  atWarningThreshold: boolean;
  atCriticalThreshold: boolean;
  exceeded: boolean;
}

export default function Quota() {
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuota = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 경로를 맞게 변경: 프론트에서 부를 때는 /api/quota/check
      const res = await fetch('/api/quota/check', { credentials: 'include' });
      if (!res.ok) throw new Error('서버 오류');
      const data = await res.json();
      setQuota(data.data as QuotaData);
    } catch (err) {
      console.log('error: ', err);
      setError('용량 정보를 불러오지 못했습니다.');
      setQuota(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuota();
    const handleFocus = () => fetchQuota();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchQuota]);

  if (loading) {
    return <div className="h-8 w-40 bg-gray-100 animate-pulse rounded"></div>;
  }
  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }
  if (!quota) {
    return <div>용량 정보가 없습니다.</div>;
  }

  const {
    maxQuotaGB,
    usedQuotaGB,
    usagePercentage,
    unlimited,
    exceeded,
  } = quota;

  return (
    <div className="w-full max-w-xs px-3 py-2 bg-white rounded-lg shadow flex items-center gap-2">
      {unlimited ? (
        <span className="text-sm font-medium text-gray-700">무제한 저장소</span>
      ) : (
        <span className="text-sm font-medium text-gray-700">
          {usedQuotaGB.toFixed(3)} GB / {maxQuotaGB} GB&nbsp;
          ·&nbsp;
          {(usagePercentage * 100).toFixed(4)}% 사용됨
        </span>
      )}
      {exceeded && (
        <span className="text-xs text-red-500 font-bold ml-2">
          저장 용량이 초과되었습니다!
        </span>
      )}
    </div>
  );
}
