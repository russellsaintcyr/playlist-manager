# takeUntilDestroyed Implementation Guide

## Overview

The `takeUntilDestroyed` operator is an Angular 16+ feature that automatically unsubscribes from observables when a component is destroyed. It's cleaner and safer than manual `OnDestroy` management.

## Current Status: Memory Leak Risk ⚠️

Most of your components have **unmanaged subscriptions** - they don't implement `OnDestroy` and don't unsubscribe! This means:
- ❌ Memory leaks if users navigate away frequently
- ❌ Observable listeners might keep running after component destruction
- ❌ Potential issues with slow requests finishing after component is gone

## Components That Need `takeUntilDestroyed`

### **HIGH PRIORITY** (Many subscriptions, no cleanup)

1. **`playlist.component.ts`** - 8 subscriptions
   - `getPlaylist()`
   - `getURL()` (called multiple times)
   - `controlPlayback()`
   - `createPlaylist()`
   - `addToPlaylist()`

2. **`now-playing.component.ts`** - 4 subscriptions
   - `getCurrentlyPlaying()`
   - `playNextPrevious()`
   - `controlPlayback()`
   - Already has `OnDestroy` but uses `setTimeout` instead of proper unsubscribe

3. **`playlists.component.ts`** - 3 subscriptions
   - `getPlaylists()`
   - `getURL()`
   - `getPlaylist()`

4. **`navbar.component.ts`** - 3 subscriptions
   - `playNextPrevious()`
   - `controlPlayback()` (pause)

### **MEDIUM PRIORITY** (Fewer subscriptions, but still important)

5. **`artist.component.ts`** - 2 subscriptions
   - `getArtist()`
   - `getArtistAlbums()`

6. **`album.component.ts`** - 1 subscription
   - `getAlbum()`

7. **`dashboard.component.ts`** - 2 subscriptions
   - `searchMusic()`
   - `getArtist()`

## How to Implement `takeUntilDestroyed`

### **Pattern 1: Single Subscriptions (Simplest)**

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-artist',
  template: '...'
})
export class ArtistComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getArtist(this.artistID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        // handle response
      });
  }
}
```

### **Pattern 2: Multiple Subscriptions (Better)**

```typescript
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-playlist',
  template: '...'
})
export class PlaylistComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.spotifyService.getPlaylist(this.selectedPlaylist, 0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.tracks = res.items;
      });
  }

  loadOffset(url: string) {
    this.spotifyService.getURL(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.tracks = res.items;
      });
  }

  playRating(rating: number, action: string) {
    this.spotifyService.controlPlayback({uris: arrTracks}, 'play')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        // handle response
      });
  }
}
```

### **Pattern 3: With Error Handling**

```typescript
this.spotifyService.getArtist(artistID)
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe({
    next: (res) => {
      this.artist = res;
    },
    error: (err) => {
      console.error('Error loading artist:', err);
      this.alertService.error(err._body);
    }
  });
```

## Implementation Priority & Steps

### **Step 1: Quick Wins** (No cleanup currently)
Start with components that have no cleanup at all:
- `album.component.ts` (1 subscription)
- `dashboard.component.ts` (2 subscriptions)
- `artist.component.ts` (2 subscriptions)

### **Step 2: Medium Complexity**
- `playlists.component.ts` (3 subscriptions)
- `navbar.component.ts` (3 subscriptions)

### **Step 3: Complex Refactors**
- `playlist.component.ts` (8 subscriptions + AfterViewChecked)
- `now-playing.component.ts` (already has OnDestroy, needs refactor)

## Migration Template

For each component, follow this pattern:

```typescript
// Before
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class MyComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.service.getData().subscribe(res => {
      // handle
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

// After
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        // handle
      });
  }
}
```

## Recommended Implementation Order

```bash
1. album.component.ts      # 1 subscription - easiest
2. dashboard.component.ts  # 2 subscriptions
3. artist.component.ts     # 2 subscriptions
4. navbar.component.ts     # 3 subscriptions
5. playlists.component.ts  # 3 subscriptions
6. playlist.component.ts   # 8 subscriptions - most complex
7. now-playing.component.ts # Already has OnDestroy - refactor
```

## Benefits After Implementation

✅ **Memory leak prevention** - No more lingering subscriptions  
✅ **Cleaner code** - No need for OnDestroy interface  
✅ **Safer** - Automatic cleanup, less error-prone  
✅ **Modern Angular** - Aligns with Angular 17 best practices  
✅ **Smaller bundle** - Less boilerplate code  

## Testing After Implementation

After implementing `takeUntilDestroyed`:

```bash
# Build
npm run build:gh-pages

# Test navigation
npm run devstart
# Then navigate between routes several times to ensure no memory issues
```

## Summary

Your app currently has **22+ unmanaged subscriptions** across 7 components. Implementing `takeUntilDestroyed` would:
- Eliminate memory leaks
- Reduce ~50 lines of boilerplate code
- Make code more maintainable and modern

Would you like me to implement this refactoring for you? I can start with the simpler components first (album, dashboard, artist).
