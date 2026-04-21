import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'prepcode-api-key'
const ONBOARDED_KEY = 'prepcode-api-key-onboarded'

interface ApiKeyContextValue {
  apiKey: string | null
  hasKey: boolean
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  saveKey: (key: string, persist: boolean) => void
  clearKey: () => void
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null)

// Read from either storage. sessionStorage wins if both are set (shouldn't
// happen because saveKey clears both first, but this is the safer tie-break).
function loadKey(): string | null {
  return sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY)
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(() => loadKey())
  const [isModalOpen, setIsModalOpen] = useState(false)

  // First-visit onboarding: if the user has never seen the modal AND has no
  // key, open it once. The onboarded flag is set when they interact with it
  // (save or dismiss), so we never re-pester on subsequent visits.
  useEffect(() => {
    const onboarded = localStorage.getItem(ONBOARDED_KEY)
    if (!onboarded && !apiKey) {
      setIsModalOpen(true)
    }
    // Only runs once — mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openModal = useCallback(() => setIsModalOpen(true), [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    localStorage.setItem(ONBOARDED_KEY, 'true')
  }, [])

  const saveKey = useCallback((key: string, persist: boolean) => {
    // Clear from both stores first so we never end up with stale copies in
    // the other one after the user switches persistence preference.
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    ;(persist ? localStorage : sessionStorage).setItem(STORAGE_KEY, key)
    localStorage.setItem(ONBOARDED_KEY, 'true')
    setApiKey(key)
    setIsModalOpen(false)
  }, [])

  const clearKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    setApiKey(null)
  }, [])

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        hasKey: !!apiKey,
        isModalOpen,
        openModal,
        closeModal,
        saveKey,
        clearKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext)
  if (!ctx) throw new Error('useApiKey must be used inside ApiKeyProvider')
  return ctx
}

// Small helper for hooks that make API calls — spreads into fetch headers.
export function authHeaders(apiKey: string | null): Record<string, string> {
  return apiKey ? { 'x-api-key': apiKey } : {}
}
