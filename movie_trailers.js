"use strict"

let player = null;
const nextMovieGenerator = fetchNextMovie();

// Load the IFrame Player API code asynchronously.
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Start getting information on first movie asynchronously
const gettingFirstMovie = nextMovieGenerator.next()

// This is called when page has finished downloading the Javascript for the player API
async function onYouTubePlayerAPIReady() {
    const movie = (await gettingFirstMovie).value;
    document.getElementById("movietitle").innerText = movie.title;

    // Replace the 'ytplayer' element with an <iframe> and
    // YouTube player after the API code downloads.
    player = new YT.Player('ytplayer', {
        height: window.innerHeight - document.querySelector("body").clientHeight - 30,
        width: document.querySelector("body").clientWidth,
        videoId: movie.videoId,
        playerVars: {
            autoplay: 0,
            controls: 0,
            enablejsapi: 1,
            modestbranding: 1,
        },
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady,
        }
    });
}

// YT API callbacks
function onPlayerReady(event) {
    console.log(`Player ready`);
}

function onPlayerStateChange(event) {
    console.log(`Player state changed! ${event.data}`);
}

// HTML interactivity
function beginTrailers() {
    if (player) {
        player.playVideo();
    }
}

async function skipVideo() {
    const movie = (await nextMovieGenerator.next()).value;
    document.getElementById("movietitle").innerText = movie.title;
    player.loadVideoById({ 'videoId': movie.videoId, });
}

function resizePlayer() {
    // TODO remove hard coded values
    player.setSize(window.innerWidth - 20, window.innerHeight - document.getElementById("controls").clientHeight - 40);
}

// TMDB generator
async function* fetchNextMovie() {
    let page = 1;
    let url = ''

    while (true) {
        // Get the next page of popular movies
        url = `https://api.themoviedb.org/3/discover/movie?api_key=cd0e211752d5081a14211fe34bb3c5fa&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`;
        const response = await fetch(url);
        const body = await response.json();
        page += 1;
        
        for (let movie of body.results) {
            // Get list of videos for the movie
            const vid_response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=cd0e211752d5081a14211fe34bb3c5fa&language=en-US`);
            const vid_body = await vid_response.json();

            // Check to see if a YouTube trailer exists
            const yt_trailers = vid_body.results.filter(vid => vid.site == "YouTube" && vid.type == "Trailer");
            if (yt_trailers.length > 0) {
                yield {
                    'title': movie.title,
                    'videoId': yt_trailers[0].key,
                };
            } else {
                console.log(`No trailer found on YT for ${movie.id}`);
            }
        }
    }
}
