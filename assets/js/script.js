
function apiURL(method, keyValuePairs) {
  var url = "http://ws.audioscrobbler.com/2.0/";
  var apiKey = "c1468b5d4e01bbb9afda80d93069f311";

  if(method == 'album') {
    var method = "album.getinfo";
  } else {
    var method = "artist.getinfo";
  }

  return url + '?format=json&callback=?&api_key=' + apiKey + '&' + queryString(keyValuePairs) + '&method=' + method;
}

function queryString(params) {
  var output = [];
  $.each(params, function(key, value){
    if(params.hasOwnProperty(key)) {
      output.push( key + '=' + encodeURIComponent(value) );
    }
  });

  return output.join('&');
}

// Try to just get an artist image
function setArtistCover(artist, element) {
  $.getJSON(apiURL('artist', {artist: artist}), function(data){
    if(data.artist) {
      var img = data.artist.image[2]['#text'];
      setCover(element, img);
    }
  });
}

function setCover(element, img) {
  $('img.cover', element).attr('src', img);
}

// Load the image cover art in from Last.FM
function getArtwork(element) {
  var artist = $('.artist', element).text();
  var title = $('.title', element).text();
  var params = { artist: artist, album: title };

  $.getJSON(apiURL('album', params), function(data){
    if(data.album) {
      var img = data.album.image[2]['#text'];
      // Sometimes Last.fm returns empty strings for images...wtf?
      img == '' ? setArtistCover(artist, element) : setCover(element, img);

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
                            placement: function(){ return $(element).data('colindex') < 3 ? 'right' : 'left'; },
                            delay: { hide: 1500 }
        });

        $('.links', element).append(mouseOver);
      }
    } else {
      // The album query returned nothing, so try artist
      setArtistCover(artist, element);
    }
  });
}

$(document).ready(function(){
  $.each($('#albums .album'), function(){
    getArtwork(this);
  });
});
