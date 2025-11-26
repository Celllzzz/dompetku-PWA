import { useRegisterSW } from 'virtual:pwa-register/react'

function PWABadge() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const close = () => { setOfflineReady(false); setNeedRefresh(false); }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {(offlineReady || needRefresh) && (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="mb-2 text-sm">
            {offlineReady ? <span>App siap offline!</span> : <span>Update tersedia!</span>}
          </div>
          {needRefresh && <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2" onClick={() => updateServiceWorker(true)}>Reload</button>}
          <button className="bg-gray-200 px-3 py-1 rounded text-xs" onClick={close}>Close</button>
        </div>
      )}
    </div>
  )
}
export default PWABadge