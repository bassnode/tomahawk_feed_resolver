ARTWORK_URL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=c1468b5d4e01bbb9afda80d93069f311&format=json";

// Load the image cover art in from Last.FM
function getArtwork(element){
  var artist = $('.artist', element).text();
  var title = $('.title', element).text();
  var url = ARTWORK_URL + "&&artist=" + encodeURIComponent(artist) + "&album=" + encodeURIComponent(title) + "&callback=?";

  $.getJSON(url, null, function(data){
    if(data.album) {
      var img = data.album.image[1]['#text'];
      $('img.cover', element).attr('src', img);

      // Add the first track name if we can
      if(data.album.tracks.track) {
        var firstTrack = data.album.tracks.track[0];
        var href = "tomahawk://search/?artist=" +
                    encodeURIComponent(firstTrack.artist.name) +
                    "&title=" +
                    encodeURIComponent(firstTrack.name);
        var a = $('<a/>', {href: href}).text('Single');
        a.appendTo($('.links', element));
      }
    }
  });
}

$(document).ready(function(){
  $.each($('#albums .album'), function(){
    getArtwork(this);
  });
});
