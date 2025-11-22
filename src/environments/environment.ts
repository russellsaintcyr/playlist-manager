// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  spotifyClientId: 'e8629f625be5446a8434f03c0063ac27', // Dev client ID
  clarityProjectId: 'u7mugszk1b',
  firebase: {
    apiKey: 'AIzaSyD6lU0hqm583ADjx3kv5GMpv9ZHMhG-cP0',
    authDomain: 'my-spotify-app-607f3.firebaseapp.com',
    projectId: 'my-spotify-app-607f3',
    storageBucket: 'my-spotify-app-607f3.firebasestorage.app',
    messagingSenderId: '193980452671',
    appId: '1:193980452671:web:a9f91eef4173c8b7254d8a'
  }
};
