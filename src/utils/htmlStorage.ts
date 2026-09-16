import { UploadedHtmlMeta } from '../types';

const DB_NAME = 'AILiteracy_HTML_Storage';
const DB_VERSION = 1;
const STORE_NAME = 'html_files';

const STORAGE_KEYS = {
  META: 'ai_literacy_uploaded_html_meta',
  HTML_PREFIX: 'ai_literacy_uploaded_html_',
};

/**
 * Open or upgrade the IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'sessionId' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Format bytes to readable size (e.g., 25.4 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get all uploaded HTML metadata map from localStorage
 */
export function getAllUploadedHtmlMetas(): Record<number, UploadedHtmlMeta> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.META);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to read uploaded HTML meta:', e);
    return {};
  }
}

/**
 * Get uploaded HTML metadata for a specific session
 */
export function getUploadedHtmlMeta(sessionId: number): UploadedHtmlMeta | null {
  const all = getAllUploadedHtmlMetas();
  return all[sessionId] || null;
}

/**
 * Save uploaded HTML file content to IndexedDB and fallback to localStorage
 */
export async function saveUploadedHtml(
  sessionId: number,
  file: File
): Promise<{ meta: UploadedHtmlMeta; runnerUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const content = reader.result as string;
        const now = new Date();
        const formattedDate = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. ${String(
          now.getHours()
        ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const meta: UploadedHtmlMeta = {
          sessionId,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          fileSizeBytes: file.size,
          uploadedAt: formattedDate,
        };

        // 1. Try to save into IndexedDB
        try {
          const db = await openDatabase();
          await new Promise<void>((resDb, rejDb) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put({
              sessionId,
              fileName: file.name,
              content,
              uploadedAt: formattedDate,
            });
            req.onsuccess = () => resDb();
            req.onerror = () => rejDb(req.error);
          });
        } catch (dbErr) {
          console.warn('IndexedDB write failed, relying on localStorage fallback:', dbErr);
        }

        // 2. Save in localStorage (if size <= 3.5MB to stay well under quota)
        try {
          if (content.length < 3500000) {
            localStorage.setItem(`${STORAGE_KEYS.HTML_PREFIX}${sessionId}`, content);
          }
        } catch (lsErr) {
          console.warn('LocalStorage html content storage warning (might exceed quota):', lsErr);
        }

        // 3. Save metadata record
        const allMeta = getAllUploadedHtmlMetas();
        allMeta[sessionId] = meta;
        localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(allMeta));

        const runnerUrl = `./session-runner.html?session=${sessionId}&t=${Date.now()}`;
        resolve({ meta, runnerUrl });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(reader.error || new Error('파일을 읽는 중 오류가 발생했습니다.'));
    };

    reader.readAsText(file, 'utf-8');
  });
}

/**
 * Retrieve uploaded HTML string for a session from IndexedDB or localStorage
 */
export async function getUploadedHtml(sessionId: number): Promise<string | null> {
  // 1. Try IndexedDB
  try {
    const db = await openDatabase();
    const result = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(sessionId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    if (result && typeof result.content === 'string') {
      return result.content;
    }
  } catch (e) {
    console.warn('IndexedDB read failed:', e);
  }

  // 2. Fallback to localStorage
  try {
    const fallback = localStorage.getItem(`${STORAGE_KEYS.HTML_PREFIX}${sessionId}`);
    if (fallback) return fallback;
  } catch (e) {
    console.error('LocalStorage read failed:', e);
  }

  return null;
}

/**
 * Delete uploaded HTML file for a session and restore standard state
 */
export async function deleteUploadedHtml(sessionId: number): Promise<void> {
  // 1. Remove from IndexedDB
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(sessionId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB delete failed:', e);
  }

  // 2. Remove from localStorage
  try {
    localStorage.removeItem(`${STORAGE_KEYS.HTML_PREFIX}${sessionId}`);
    const allMeta = getAllUploadedHtmlMetas();
    delete allMeta[sessionId];
    localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(allMeta));
  } catch (e) {
    console.error('Failed to clean up localStorage html data:', e);
  }
}
