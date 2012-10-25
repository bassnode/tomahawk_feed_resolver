Tomahawk Feed Resolver
======================
Uses Tomahawk and Last.FM to play songs from newsfeeds.

Why?
----
If like me, you get tired of scrolling through your feed reader and using some external tool to listen to
each new album release, you'll dig this.  It allows you to view all the albums on one page along with their artwork and tracklisting.
With a single click you can start listening.  Another click to read the original article, download, buy, etc.

Requirements
------------
* [Tomahawk Player](http://www.tomahawk-player.org/)
* [Ruby 1.9.3](http://www.ruby-lang.org)

HowTo
------
    git clone https://github.com/bassnode/tomahawk_feed_resolver.git
    bundle install
    rake
    # opens a browser with the results
    # Edit `feeds.yml` to customize which music blogs to use.
    # Optionally, pass the number of days to look back (default is 2)
    rake DAYS=7

Details
-------
This script reads the RSS feeds listed in `feeds.yml` and pulls down the last 2 days worth of items/albums.
It generates an HTML page containing Tomahawk links to either the whole album or a single track from it (if available).
If you're not familiar with Tomahawk, read their website for how it works.  In short, you tell it what you want to listen to
and it finds that song searching both your local music collection as well as a myriad of web-based sources (Soundcloud, Youtube, etc.).

Screenshot
----------
![Screenshot](https://raw.github.com/bassnode/tomahawk_feed_resolver/master/assets/img/screen.png "Screenshot")
