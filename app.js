const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const songAudio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playlistButton = document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");
//index for songs
let index;

//initially loop = true
let loop = true;

const songsList = [
    {
        name: "Shape of My Heart",
        link: "music/Shape of My Heart.mp3",
        artist: "Backstreet Boys",
        image: "album-cover/Black and Blue.jpg",
    },
    {
        name: "Booty Wurk (One Cheeck At a Time)(feat. Joey Galaxy)",
        link: "music/Booty Wurk (One Cheek At a Time).mp3",
        artist: "T-Pain",
        image: "album-cover/T-Pain Presents Happy Hour The Greatest Hits.jpg",
    },
    {
        name: "Southern Hospitality",
        link: "music/Southern Hospitality (Feat. Pharrell).mp3",
        artist: "Ludacris",
        image: "album-cover/Back For The First Time.jpg",
    },
    {
        name: "Lean Back (feat. Fat Joe and Remy Ma)",
        link: "music/Lean Back.mp3",
        artist: "Terror Squad",
        image: "album-cover/True Story.jpg",
    },
    {
        name: "Rollout (My Business)",
        link: "music/Rollout (My Business).mp3",
        artist:"Ludacris",
        image: "album-cover/Word of Mouf.jpg",
    },
    {
        name: "Pretty Boy Swag",
        link: "music/Pretty Boy Swag.mp3",
        artist: "Soulja Boy Tell Em",
        image: "album-cover/The DeAndre Way.jpg",
    },
    {
        name: "Hard",
        link: "music/Hard.mp3",
        artist: "Gucci Mane",
        image: "album-cover/Atlanta Gave Me Vision.jpg",
    },
    {
        name: "Hit Me Baby One More Time",
        link: "music/Baby One More Time.mp3",
        artist: "Britney Spears",
        image: "album-cover/Baby One More Time.png",
    },
];

//events object
let events = {
    mouse: {
        click: "click",
    },
    touch: {
        click: "touchstart",
    },
};

let deviceType = " ";

//Detect touch device
const isTouchDevice = () => {
    try{
        //We try to create TouchEvent(it would fail
        //desktop and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }
    catch(e){
        deviceType = "mouse";
        return false;
    }
};

//Format time (convert ms to seconds, minutes, and add 0 id less than 10)
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
};

//set song
const setSong = (arrayIndex) => {
    //this extracts all the variable from the objects
    let { name, link, artist, image } = songsList[arrayIndex];
    songAudio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImage.src = image;
    //display duration when metadata loads
    songAudio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(songAudio.duration);
    };
};

//play song
const playAudio = () => {
    songAudio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
};

//repeat button
repeatButton.addEventListener("click", () => {
    if (repeatButton.classList.contains("active")) 
    {
        repeatButton.classList.remove("active");
        songAudio.loop = false;
        console.log("repeat off");
    }
    else
    {
        repeatButton.classList.add("active");
        songAudio.loop = true;
        console.log("repeat on");
    }
});

//next song
const nextSong = () => {
    //if loop is true continue in normal order
    if (loop)
    {
        if (index == songsList.length - 1)
        {
            //if last song is being played
            index = 0;
        }
        else
        {
            index += 1;
        }
        setSong(index);
        playAudio();
    }
    else
    {
        //find a random index and play that song
        let randIndex = Math.floor(Math.random() * songsList.length);
        console.log(randIndex);
        setSong(randIndex);
        playAudio();
    }
};

//pause songs
const pauseAudio = () => {
    songAudio.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
};

//previous song (You can't go back to a randomly played song)
const previousSong = () => {
    if (index > 0)
    {
        pauseAudio();
        index -= 1;
    }
    else
    {
        //if first song is being played
        index = songsList.length - 1; 
    }
    setSong(index);
    playAudio();
};

//next song when current song ends
songAudio.onended = () => {
    nextSong();
};

//shuffle songs
shuffleButton.addEventListener("click", () => {
    if (shuffleButton.classList.contains("active"))
    {
        shuffleButton.classList.remove("active");
        loop = true;
        console.log("shuffle off");
    }
    else
    {
        shuffleButton.classList.add("active");
        loop = false;
        console.log("shuffle on");
    }
});

//play button
playButton.addEventListener("click", playAudio);

//next button
nextButton.addEventListener("click", nextSong);

//pause button
pauseButton.addEventListener("click", pauseAudio);

//previous button
prevButton.addEventListener("click", previousSong);

//if user clicks on progress bar
isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
    //start of progressBar
    let coordStart = progressBar.getBoundingClientRect().left;
    //mouse click position
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

    //set width to progress
    currentProgress.style.width = progress * 100 + "%";
    //set time
    songAudio.currentTime = progress * songAudio.duration;

    //play
    songAudio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
});

//update progress every second
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(songAudio.currentTime);
    currentProgress.style.width = (songAudio.currentTime / songAudio.duration.toFixed(3)) * 100 + "%";
});

//update time
songAudio.addEventListener("timeupdate", () => {
    currentTimeRef.innerText = timeFormatter(songAudio.currentTime);
});

//create playlist
const initializePlaylist = () => {
    for (let i in songsList)
    {
        playlistSongs.innerHTML += `<li class='playlistSong' onclick='setSong(${i})'>
            <div class="playlist-image-container">
                <img src="${songsList[i].image}"/>
            </div>
            <div class="playlist-songs-details">
                <span id="playlist-songs-name">
                    ${songsList[i].name}
                </span>
                <span id="playlist-songs-artist-album">
                    ${songsList[i].artist}
                </span>
            </div>
        </li> `;
    }
};

//display playlist
playlistButton.addEventListener("click", () => {
    playlistContainer.classList.remove("hide");
});

//hide playlist
closeButton.addEventListener("click", () => {
    playlistContainer.classList.add("hide");
});


window.onload = () => {
    //initially first song
    index = 0;
    setSong(index);
    //create playlist
    initializePlaylist();
};