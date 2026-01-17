import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// export class GoogleSheetService {

// // ✅ Use Apps Script WebApp URL (Deployment URL)
//   private apiUrl = 'https://script.google.com/macros/s/1BRVyKpvOykGnO_heH7eHi6dRn6chlHpquRlXH1NlPTE/exec';

//   constructor(private http: HttpClient) {}

//   post<T>(action: string, payload: any = {}) {

//     // ✅ IMPORTANT: send as text/plain (prevents CORS preflight)
//     const headers = new HttpHeaders({
//       'Content-Type': 'text/plain;charset=utf-8'
//     });

//     const body = JSON.stringify({ action, ...payload });

//     return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
//       map(res => res.data as T)
//     );
//   }
// }

// export class GoogleSheetService {
//   // ✅ Must be Apps Script Web App URL
//   private apiUrl = 'https://script.google.com/macros/s/AKfycbzywWwWQcGAiWmk0mH6e8OCQxtHXrfC57F_Fh9PTO0t5POgDK1T1s-mR7mKb8yX6J5rZw/exec';

//   constructor(private http: HttpClient) {}

//   post<T>(action: string, payload: any = {}) {
//     // ✅ Important header to avoid OPTIONS preflight
//     const headers = new HttpHeaders({
//       'Content-Type': 'text/plain;charset=utf-8',
//     });

//     const body = JSON.stringify({ action, ...payload });

//     return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
//       map((res) => res.data as T)
//     );
//   }
// }

export class GoogleSheetService {
  // ✅ Must be Apps Script Web App URL
  private apiUrl =
    'https://script.google.com/macros/s/AKfycbzywWwWQcGAiWmk0mH6e8OCQxtHXrfC57F_Fh9PTO0t5POgDK1T1s-mR7mKb8yX6J5rZw/exec';

  // ✅ In-memory cache (fastest)
  private memoryCache = new Map<string, { updatedAt: number; data: any }>();

  // ✅ localStorage config
  private CACHE_PREFIX = 'PCA_CACHE_';
  private CACHE_AGE_MS = 1000 * 60 * 10; // 10 minutes cache

  // ✅ Actions that should be cached
  private CACHEABLE_ACTIONS = new Set(['getTeams', 'getPlayers', 'getMatches']);

  // ✅ Actions that should clear cache after success (Admin CRUD)
  private MUTATION_ACTIONS = new Set([
    // Teams
    'addTeam',
    'updateTeam',
    'deleteTeam',
    // Players
    'addPlayer',
    'updatePlayer',
    'deletePlayer',
    // Matches
    'addMatch',
    'updateMatch',
    'deleteMatch',
  ]);

  constructor(private http: HttpClient) {}

  // ✅ MAIN METHOD
  post<T>(action: string, payload: any = {}): Observable<T> {
    // ✅ if it is cached read action
    if (this.CACHEABLE_ACTIONS.has(action)) {
      const key = this.makeCacheKey(action, payload);

      // 1) Memory cache
      const memory = this.getFromMemory<T>(key);
      if (memory !== null) {
        return of(memory);
      }

      // 2) LocalStorage cache
      const local = this.getFromLocalStorage<T>(key);
      if (local !== null) {
        // push into memory cache
        this.memoryCache.set(key, { updatedAt: Date.now(), data: local });
        return of(local);
      }

      // 3) API call and store result
      return this.callApi<T>(action, payload).pipe(
        tap((data) => {
          this.setToMemory(key, data);
          this.setToLocalStorage(key, data);
        })
      );
    }

    // ✅ mutation actions should ALWAYS call API
    // and clear cache after success
    if (this.MUTATION_ACTIONS.has(action)) {
      return this.callApi<T>(action, payload).pipe(
        tap(() => {
          // clear tournament caches so new data comes fresh
          this.clearTournamentCache();
        })
      );
    }

    // ✅ default: no caching
    return this.callApi<T>(action, payload);
  }

  // ---------------------------
  // API Caller (real HTTP post)
  // ---------------------------
  private callApi<T>(action: string, payload: any = {}): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain;charset=utf-8', // ✅ prevents preflight CORS OPTIONS
    });

    const body = JSON.stringify({ action, ...payload });

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((res) => (res?.data ?? null) as T)
    );
  }

  // ---------------------------
  // Cache Helpers
  // ---------------------------
  private makeCacheKey(action: string, payload: any): string {
    // For read actions, payload usually empty.
    // But if in future you add filters, this still works.
    return `${action}:${JSON.stringify(payload ?? {})}`;
  }

  private isExpired(updatedAt: number): boolean {
    return Date.now() - updatedAt > this.CACHE_AGE_MS;
  }

  private getFromMemory<T>(key: string): T | null {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    if (this.isExpired(cached.updatedAt)) {
      this.memoryCache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  private setToMemory(key: string, data: any) {
    this.memoryCache.set(key, { updatedAt: Date.now(), data });
  }

  private getFromLocalStorage<T>(key: string): T | null {
    const raw = localStorage.getItem(this.CACHE_PREFIX + key);
    if (!raw) return null;

    try {
      const obj = JSON.parse(raw);
      if (!obj?.updatedAt || this.isExpired(obj.updatedAt)) {
        localStorage.removeItem(this.CACHE_PREFIX + key);
        return null;
      }
      return obj.data as T;
    } catch {
      localStorage.removeItem(this.CACHE_PREFIX + key);
      return null;
    }
  }

  private setToLocalStorage(key: string, data: any) {
    localStorage.setItem(
      this.CACHE_PREFIX + key,
      JSON.stringify({ updatedAt: Date.now(), data })
    );
  }

  // ✅ Clear only tournament caches
  private clearTournamentCache() {
    // clear memory
    this.memoryCache.clear();

    // clear localstorage keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(this.CACHE_PREFIX)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}