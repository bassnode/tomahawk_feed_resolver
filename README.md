Tomahawk Feed Resolver
======================
Uses Tomahawk and Last.FM to play songs from newsfeeds.

Requirements
------------
[Tomahawk Player](http://www.tomahawk-player.org/)
Ruby 1.9.3

HowTo
------
    git clone https://github.com/bassnode/tomahawk_feed_resolver.git
    bundle install
    rake
    # opens a browser with the results
    # Edit `feeds.yml` to customize which music blogs to use.

Details
-------
This script reads the RSS feeds listed in `feeds.yml` and pulls down the last 2 days worth of items/albums.
It generates an HTML page containing Tomahawk links to either the whole album or a single track from it (if available).
If you're not familiar with Tomahawk, read their website for how it works.  In short, you tell it what you want to listen to
and it finds that song searching both your local music collection as well as a myriad of web-based sources (Soundcloud, Youtube, etc.).
