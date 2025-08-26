"use client";

import React, { useState } from 'react';

export default function TestAPIPage() {
  const [surname, setSurname] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const testAPI = async () => {
    if (!surname.trim()) {
      setError('请输入姓氏');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🧪 开始测试API...');
      console.log('📝 姓氏:', surname);
      console.log('🔗 请求URL:', '/api/generate');
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          surname: surname.trim(),
          sources: ['shijing'],
          size: 3,
          charCount: 2
        })
      });

      console.log('📡 响应状态:', response.status);
      console.log('📡 响应头:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API响应成功:', data);
      
      setResult(data);
      
      if (data.ok && data.data && data.data.length > 0) {
        console.log('🎉 名字生成成功!');
        console.log('📊 统计信息:', data.stats);
        console.log('🏷️ 生成的名字:', data.data);
      } else {
        console.log('❌ 名字生成失败:', data);
      }
      
    } catch (err: any) {
      console.error('❌ API测试失败:', err);
      setError(err.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 API测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试名字生成API</h2>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="输入姓氏（如：王、李、张）"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={testAPI}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试API'}
            </button>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-4">
              ❌ 错误: {error}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">API响应结果</h2>
            
            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">状态信息</h3>
                <p><strong>成功:</strong> {result.ok ? '✅ 是' : '❌ 否'}</p>
                {result.error && <p><strong>错误:</strong> {result.error}</p>}
              </div>

              {result.stats && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">统计信息</h3>
                  <p><strong>总候选数:</strong> {result.stats.totalCandidates}</p>
                  <p><strong>选择数量:</strong> {result.stats.selectedCount}</p>
                  <p><strong>唯一数量:</strong> {result.stats.uniqueCount}</p>
                  <p><strong>使用数据源:</strong> {result.stats.sourcesUsed?.join(', ')}</p>
                  <p><strong>消息:</strong> {result.stats.message}</p>
                </div>
              )}

              {result.data && result.data.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">生成的名字 ({result.data.length}个)</h3>
                  <div className="grid gap-3">
                    {result.data.map((card: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <h4 className="font-semibold text-lg">{card.name}</h4>
                        <p className="text-gray-600 text-sm">出处: 《{card.source.title}》</p>
                        <p className="text-gray-600 text-sm">作者: {card.source.author || '佚名'}</p>
                        <p className="text-gray-600 text-sm">朝代: {card.source.dynasty || '未知'}</p>
                        <p className="text-gray-600 text-sm">来源: {card.source.sourceSet}</p>
                        <p className="text-gray-800 mt-2">{card.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                查看完整JSON响应
              </summary>
              <pre className="mt-2 bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
