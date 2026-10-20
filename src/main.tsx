import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// 설치형 PWA 서비스워커(public/sw.js). 개발 서버에서는 모듈 캐시 꼬임을 막으려고 배포 빌드에서만 등록한다.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        const worker = registration.active;
        if (!worker) return;
        // 첫 방문처럼 SW가 제어하기 전에 받은 같은 출처 자산(workerStart 0)을 SW에 알려
        // 오프라인용으로 캐시하게 한다. SW를 거친 요청은 SW가 이미 캐시한다.
        worker.postMessage({ type: 'CACHE_URLS', urls: [location.href] });
        new PerformanceObserver((list) => {
          const urls = list.getEntries()
            .filter((entry) => (entry as PerformanceResourceTiming).workerStart === 0)
            .map((entry) => entry.name);
          if (urls.length) worker.postMessage({ type: 'CACHE_URLS', urls });
        }).observe({ type: 'resource', buffered: true });
      })
      .catch((error: unknown) => {
        console.warn('서비스워커 등록 실패:', error);
      });
  });
}
