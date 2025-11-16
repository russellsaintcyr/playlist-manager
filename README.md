# Playlist Manager

This project started in 2017 to help me resolve a musical challenge. Each year I create a playlist of songs that I discover and like. At year end, that playlist includes 200-300 songs. I wanted a way to select my favorite 40 songs, partly a tribute to American Top 40 and Kasey Kasem. Spotify offers no way to rate tracks, and it was frustrating manually adding songs to a new Top 40 Candidates playlist. I wanted an easier and fun solution. So I created a browser-based webapp which accesses the Spotify API and allows users to play, rate, and organize tracks as they listen.

![Now Playing](now_playing.png)
![Now Playing](2021.png)

## Architecture
* Angular 18 frontend
* GitHub Pages deployment with GitHub Actions CI/CD
* OAuth integration with Spotify API
* Bootstrap for UI components
* Modern TypeScript with Angular best practices
* Modular component-based architecture

## Features
* Rate individual tracks with thumbs up, down, or neutral
* Create and manage playlists
* Playback controls
* Monitoring of "Now Playing" with large cover art
* Album and artist information
* Artist search 
* Local storage for ratings and preferences

## Recent Updates
* Upgraded from Angular 10 to Angular 18, with control flow syntax, standalone components and no modules
* Modernized dependency injection with `inject()`
* Implemented `takeUntilDestroyed` for memory leak prevention
* Configured GitHub Pages for new Angular build system (dist/browser)
* Updated to TypeScript 5.5 with strict mode
* Replaced TSLint with ESLint
* Prettier code formatting

## Planned Features
* Angular 20 and signals
* Additional music services (Apple Music, YouTube Music, etc.)
* Firebase for authentication and user preference storage
* Enhanced playlist management tools
* Copying playlists between music services
* Advanced music analytics
* React Native version for iOS and Android
* Progressive Web App (PWA) support

## Music Links
* <a href="https://open.spotify.com/playlist/0pqyzLEpqtt1AzHB0RGdvQ?si=f9c91a68de8240f3" target="_blank">My Top 40 of 2024</a>
* <a href="https://open.spotify.com/playlist/7xQIQYZZJ6Eu4SFbO0x64A?si=af413d9149b5480a" target="_blank">My Top 40 of 2023</a>
* <a href="https://open.spotify.com/playlist/6aOFbZYZTUO1qzsp5JS9v4?si=4f6f8f8c3ef5454a" target="_blank">My Top 40 of 2022</a>
* <a href="https://open.spotify.com/playlist/2o3Wbf3FYAyrApvzMfmz4d?si=380c5750bb414f4a" target="_blank">My Top 40 of 2021</a>
* <a href="https://open.spotify.com/playlist/0HIkuOQI4B0IIvj9fi65WP?si=9d7429d911a14663" target="_blank">My Top 40 of 2020</a>
* <a href="https://open.spotify.com/playlist/7FCJyM9RVxYYRYOlSffNrF?si=1551c5fd1ab14c81" target="_blank">My Top 40 of 2019</a>
* <a href="https://open.spotify.com/playlist/51wSFAsnu0LS7Z53Gy9L03?si=a8d26f54c17e444a" target="_blank">My Top 40 of 2018</a>
* <a href="https://open.spotify.com/playlist/2QNzk2n6iahh5kit6fQ2NM?si=b4ddad7a56f8483d" target="_blank">My Top 40 of 2017</a>
