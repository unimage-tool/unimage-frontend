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
    atWarningThreshold,
    atCriticalThreshold,
    exceeded,
  } = quota;

  return (
    <div className="w-full max-w-xs p-3 bg-white rounded-lg shadow flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <span>
          <strong>용량</strong>
        </span>
        <span>
          {unlimited
            ? '무제한'
            : (
              <>
                {usedQuotaGB.toFixed(3)} GB / {maxQuotaGB} GB
              </>
            )
          }
        </span>
      </div>
      {!unlimited && (
        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all
              ${exceeded
                ? 'bg-red-500'
                : atCriticalThreshold
                  ? 'bg-orange-500'
                  : atWarningThreshold
                    ? 'bg-yellow-400'
                    : 'bg-blue-500'}
            `}
            style={{ width: `${Math.min(usagePercentage * 100, 100)}%` }}
          ></div>
        </div>
      )}
      <div className="text-xs text-gray-500 text-right">
        {unlimited
          ? '무제한 저장소'
          : `${(usagePercentage * 100).toFixed(4)}% 사용됨`}
      </div>
      {exceeded && (
        <div className="text-xs text-red-500 font-bold mt-1">
          저장 용량이 초과되었습니다!
        </div>
      )}
    </div>
  );
}
