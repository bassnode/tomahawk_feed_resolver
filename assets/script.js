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
        var ol = $('<ol>');

        $.each(data.album.tracks.track, function(id, track){
          var href = "tomahawk://search/?artist=" +
                      encodeURIComponent(artist) +
                      "&title=" +
                      encodeURIComponent(track.name);
          var a = $('<a/>', {href: href}).text(track.name);
          $('<li>').html(a).appendTo(ol);
        });

        var mouseOver = $('<a/>', {href: 'javascript:;', class: 'tracklist'}).text('Tracks')
        var olContent = $('<div>').append(ol.clone()).remove().html();
        mouseOver.popover({
                            title: data.album.name,
                            html: true,
                            content: olContent,
                            trigger: 'hover',
                            delay: { hide: 1500 }
        });

        $('.links', element).append(mouseOver);
      }
    }
  });
}

$(document).ready(function(){
  $.each($('#albums .album'), function(){
    getArtwork(this);
  });
});
