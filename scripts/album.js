var updatePlayerBarSong = function() {
  $('.song-name').text(currentSongFromAlbum.title)
  $('.artist-name').text(currentAlbum.artist)
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
   $('.main-controls .play-pause').html(playerBarPauseButton);
}

var onHover = function(event) {
   var songNumberCell = $(this).find('.song-item-number');
   var songNumber = parseInt(songNumberCell.attr('data-song-number'));

   if (songNumber !== currentlyPlayingSongNumber) {
     songNumberCell.html(playButtonTemplate);
   }
};

var offHover = function(event) {
  var songNumberCell = $(this).find('.song-item-number');
  var songNumber = parseInt(songNumberCell.attr('data-song-number'));

  if (songNumber !== currentlyPlayingSongNumber) {
    songNumberCell.html(songNumber);
  }
};

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum)
  var previousSongNumber = currentlyPlayingSongNumber;
  if(currentlyPlayingSongNumber < currentAlbum.songs.length) {
    setSong(currentlyPlayingSongNumber + 1);
  } else {
    setSong(1);
  }
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(previousSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(previousSongNumber);
  currentSoundFile.play();
  updatePlayerBarSong();
}

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

   currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
     formats: ['mp3'],
     preload: true
   });
   setVolume(currentVolume);
}

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
}

var getSongNumberCell = function(songNumber) {
  return $('.song-item-number[data-song-number="' + songNumber + '"]');
}

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum)
  var previousSongNumber = currentlyPlayingSongNumber;
  if(currentSongIndex > 0) {
    setSong(currentlyPlayingSongNumber - 1);
  } else {
    setSong(currentAlbum.slongs.length);
  }
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber)
  var $lastSongNumberCell = getSongNumberCell(previousSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(previousSongNumber);
  currentSoundFile.play();
  updatePlayerBarSong();
}

var trackIndex = function(album, song) {
   return album.songs.indexOf(song);
};

 var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    var $row = $(template);
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');

     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();


     for (var i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
       $albumSongList.append($newRow);
     }
 };


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var clickHandler = function() {
	var songNumber = parseInt($(this).attr('data-song-number'));

	if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
    updatePlayerBarSong();
	}
	if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
    setSong(songNumber);
    currentSoundFile.play()
	} else if (currentlyPlayingSongNumber === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
    if(currentSoundFile.isPaused()) {
      currentSoundFile.play();
      $('.main-controls .play-pause').html(playerBarPauseButton);
      $(this).html(pauseButtonTemplate);
    } else {
      currentSoundFile.pause();
      $('.main-controls .play-pause').html(playerBarPlayButton);
      $(this).html(playButtonTemplate);
    }
	}
};

var togglePlayFromPlayerBar = function() {
  if(!currentSoundFile || currentSoundFile.isPaused()) {
    // in case current sound file was not previously set
    setSong(currentlyPlayingSongNumber);
    // song is selected but paused
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    $playBarPlayPause.html(playerBarPauseButton);
    currentSoundFile.play();
  } else {
    // song is playing
    currentSoundFile.pause();
    $playBarPlayPause.html(playerBarPlayButton);
    getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
  }
}

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playBarPlayPause = $('.main-controls .play-pause')

$(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);
   $playBarPlayPause.click(togglePlayFromPlayerBar);
 });
