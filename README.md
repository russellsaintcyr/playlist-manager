# Playlist Manager

This project was started in 2017 to help me resolve a musical challenge. Each year I create a Spotify playlist of songs that I discover and like. At year end, I typically have added 200-300 songs. I wanted a way to select my favorite 40 songs, partly a tribute to American Top 40 and Kasey Kasem. Spotify offers no way to rate tracks, and it was frustrating manually adding songs to a new playlist. I wanted an easier and fun solution. So I created a browser-based webapp which accesses the Spotify API and allows users to play, rate, and organize tracks as they listen.

![Now Playing](now_playing.png)
![Now Playing](2021.png)

## Architecture
* Angular 17 frontend
* Node.js and Express backend
* GitHub Pages deployment with GitHub Actions CI/CD
* OAuth integration with Spotify API
* Bootstrap for UI components
* Modern TypeScript with RxJS subscription management
* Modular component-based architecture

## Features
* Rate individual tracks
* Create and manage playlists
* Playback controls
* Album and artist information
* Progress tracking
* Auto-loading of complete playlists
* Local storage for ratings and preferences

## Recent Updates (v17)
* Upgraded from Angular 10 to Angular 17
* Modernized dependency injection with `inject()`
* Implemented `takeUntilDestroyed` for memory leak prevention
* Configured GitHub Pages deployment
* Updated to TypeScript 5.2 with strict mode
* Migrated to Angular's modern control flow syntax
* ESLint configuration (replaced TSLint)
* Prettier code formatting

## Planned Features
* Support for additional music services (Apple Music, YouTube Music, etc.)
* Database integration for user accounts and preferences
* Enhanced playlist management tools
* Collaborative playlist features
* Advanced analytics and insights
* Mobile app version
* Progressive Web App (PWA) support

## Links
* My Top 40 of 2020: https://open.spotify.com/playlist/0HIkuOQI4B0IIvj9fi65WP?si=9d7429d911a14663
* My Top 40 of 2019: https://open.spotify.com/playlist/7FCJyM9RVxYYRYOlSffNrF?si=1551c5fd1ab14c81
* My Top 40 of 2018: https://open.spotify.com/playlist/51wSFAsnu0LS7Z53Gy9L03?si=a8d26f54c17e444a
* My Top 40 of 2017: https://open.spotify.com/playlist/2QNzk2n6iahh5kit6fQ2NM?si=b4ddad7a56f8483d