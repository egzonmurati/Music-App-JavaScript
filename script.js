function _(query) {
	return document.querySelector(query);
}
function _all(query){
	return document.querySelectorAll(query);
}
//all songs is in array
let songList = [
  {
		thumbnail:"artist_1.jpg",
		audio:"bensound-betterdays.mp3",
		songname:"Better Days",
		artistname:"Michael Smith"
	},
	{
		thumbnail:"artist_2.jpg",
		audio:"bensound-dubstep.mp3",
		songname:"Dubstep",
		artistname:"Samuel Doe",
	},
	{
		thumbnail:"artist_3.jpg",
		audio:"bensound-sunny.mp3",
		songname:"Sunny",
		artistname:"Michael Smith",
	},
	{
		thumbnail:"3.jpg",
		audio:"moon.mp3",
		songname:" Moon",
		artistname:"Midnight North",
	},
	
	{
		thumbnail:"dua.jpg",
		audio:"Dua Lipa - Don't Start Now.mp3",
		songname:"Don't Start Now",
		artistname:"Dua Lipa",
	},
	{
		thumbnail:"5.jpg",
		audio:"Ava Max - Sweet but Psycho.mp3",
		songname:"Sweet but Psycho",
		artistname:"Ava Max",
	}
	
];


let currentSongIndex = 0;

// all children of bottom-music are in player
let player = _(".bottom-music");

let main = {
    audio:_(".bottom-music .right audio"),
	thumbnail:_(".bottom-music .right img"),
	seekbar:_(".bottom-music .right .seekbar input"),
	songname:_(".bottom-music .right .details h2"),
	artistname:_(".bottom-music .right .details p"),
	prevControl:_(".bottom-music .right .controls .prev-control"),
	mutedControl:_(".bottom-music .right .seekbar-volume .muted-or-onmuted"),
	playPauseControl:_(".bottom-music .right .controls .play-pause-control"),
	nextControl:_(".bottom-music .right .controls .next-control")
};

// all song in songList add to list in dropdown-menu
_(".bottom-music .dropdown-menu .list").innerHTML = (songList.map(function(song,songIndex) {
	return `
		<div class="item" songIndex="${songIndex}">
			<div class="thumbnail">
				<img src="${song.thumbnail}">
			</div>
			<div class="details">
				<h2>${song.songname}</h2>
				<p>${song.artistname}</p>
				 <div class="dropdown-divider"></div>
			</div>

		</div>
	`;
}).join(""));
 // put all item from list to songListItems
let songListItems = _all(".bottom-music .dropdown-menu .list .item");

for(let i=0;i<songListItems.length;i++){
	songListItems[i].addEventListener("click",function(){
	// get current index for which song click from .dropdown-menu .list
    currentSongIndex = parseInt(songListItems[i].getAttribute("songIndex"));
    // call function for start songs which index songs click
    loadSong(currentSongIndex);
	});
};
 
function loadSong(songIndex){
	// add which song click to let song
	let song = songList[songIndex];
	main.thumbnail.setAttribute("src",song.thumbnail);
	main.songname.innerText = song.songname;
	main.artistname.innerText = song.artistname;
	main.audio.setAttribute("src",song.audio);	
	main.seekbar.setAttribute("value",0);
	main.seekbar.setAttribute("min",0);
	main.seekbar.setAttribute("max",0);
	main.audio.addEventListener("canplay",function(){
		main.audio.play();
   	if(!main.audio.paused){
			main.playPauseControl.classList.remove("paused");
		}
		main.seekbar.setAttribute("max",parseInt(main.audio.duration));
		// when this song end start next song auto
		main.audio.onended = function(){
			main.nextControl.click();
		}
	})

};
 // set second for song value to currentTime
setInterval(function(){
	main.seekbar.value = parseInt(main.audio.currentTime);
},1000);

// when cick prevControl song go back --
main.prevControl.addEventListener("click",function(){
	currentSongIndex--;
	if(currentSongIndex < 0){
		currentSongIndex = songList.length + currentSongIndex;	
	}
	loadSong(currentSongIndex);
});

// when cick prevControl song go next ++
main.nextControl.addEventListener("click",function(){
	currentSongIndex = (currentSongIndex+1) % songList.length;
	
   loadSong(currentSongIndex);
});

// when click button play remove paused button or when click paused remove play button
main.playPauseControl.addEventListener("click",function(){
	if(main.audio.paused){
		main.playPauseControl.classList.remove("paused");
		main.audio.play();
	} else {
		main.playPauseControl.classList.add("paused");
		main.audio.pause();
	}
});
// when click in value of seekbar go song to when click
main.seekbar.addEventListener("change",function(){
	main.audio.currentTime = main.seekbar.value;
});

// change volume using volume range slider
volumeslider = document.getElementById("volumeslider");
volumeslider.addEventListener("change",setvolume,false);

function setvolume(){
	main.audio.volume = volumeslider.value / 100;
}

// muted or onmuted volume when click font awesome
let off = document.querySelector(".fa-volume-off");
let on = document.querySelector(".fa-volume-up");
main.mutedControl.addEventListener("click",function(){
	if(main.audio.muted){
		main.audio.muted = false;
	    off.style.display = "none";
		on.style.display =  "inline-block";	
	} else {
		main.audio.muted = true;
	    off.style.display = "inline-block";
		on.style.display = "none";
	}
});

loadSong(currentSongIndex);

