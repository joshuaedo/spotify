Welcome to this Spotify clone, developed using NextJs, ReactJs, Tailwind CSS, Recoil, Atom, Middleware, Next-Auth, Framer Motion, and Spotify-Web-Node. This app fetches data directly from the Spotify API and requires users to log in with their Spotify accounts via Next-Auth and Middleware.

## Access to Created Playlists
This app pulls data from users' already created playlists on the real Spotify. This means that users can access and play songs from their existing playlists via the clone app.

## Using the App
To use the app, click on the link and log in with your Spotify account. Ensure that you have a premium Spotify account and that you keep a separate session of your account open on any device. Play a song on that device and ensure that the tab remains open. You can then go back to the clone app and play any song from one of your playlists or play songs directly from the search page.

## How the App works
After logging into the app, a fresh access token is generated which refreshes every hour. This access token is used to make API calls to get information about the user. The player can then be used to implement controls for Spotify using Spotify Connect. However, this app is not recognized by the Spotify server as an active device and that in turn means that the user will need to have Spotify open and in active session in order to work. So songs are actually played from the Spotify page, not from the app. 
A workaround this would be to create a new player utilizing The Spotify Web Playback SDK. However, it is a client-only Javascript Library and integrating it into this Next.Js app has been futile.

## Troubleshooting 
In the event that you experience any bugs like prolonged lag, non-rendering of playlists or the inability to use the search function, follow these steps sequentially until whichever one works for you, and if it doesn't feel free to raise an issue:

1. Refresh your browser

1. Clear your cache

1. Log-Out from the clone app and Log-In 

1. Navigate [here](https://www.spotify.com/account/apps/) and Revoke access to "Spotify" with this description - "A clone of spotify for educational purposes". Then try logging out and in again

1. If you're on a premium account, confirm that your card wasn't declined the last time Spotify tried to charge you

## Future Development
For future development, we plan to integrate the Spotify Web Playback SDK into the Player component, add a Genius or Musixmatch API into the Lyrics component, create a homepage, add the ability to create playlists, and refactor the code even more.

## Contributing
We welcome contributions from anyone who wants to improve this project! Here are the steps to get started:

1. Fork the project repository by clicking the "Fork" button on the project's GitHub page. This will create a copy of the project in your own GitHub account.

1. Clone your fork of the project to your local machine using git clone.

1. Make your changes and commit them to your local repository.

1. Push your changes to your fork on GitHub using git push.

1. Create a pull request by clicking the "New pull request" button on the original project's GitHub page. This will notify us that you have changes you'd like us to consider.

1. Wait for feedback. We may suggest changes, ask for more information, or merge your changes into the project.

