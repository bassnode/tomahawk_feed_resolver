# encoding: utf-8
require 'date'

class Album

  TOMAHAWK_URL = "tomahawk://view/album?artist=%s&name=%s"
  attr_accessor :artist, :title, :description, :categories, :source_link, :published_on

  # @param [Nokogiri::XML::Element]
  def initialize(element)
    @name_string = element.xpath('title').text
    @description = element.xpath('description').text
    @categories = element.xpath('category').map(&:text)
    @source_link = element.xpath('link').text
    offset_date = DateTime.parse(element.xpath('pubDate').text).to_time
    @published_on = offset_date + offset_date.utc_offset

    set_artist_and_title!
  end

  # This could be smarter, but for now it works in most cases.
  def set_artist_and_title!
    decoded = @name_string.gsub(/\342\200\223/u,"-")
    splitter = case decoded
               when /(:+)/
                $1
               when /.+ \- .+/
                 '-'
               when /.+ \/ .+/
                '/'
               else # punt
                 ''
               end

    parts = decoded.split(splitter)
    @artist = parts[0].strip
    # Remove [2012] formatting from title
    @title = parts[1].strip.gsub(/\[\d+\]|\(\d+\)/, '')
    # Remove quotes from either
    [@artist, @title].map{ |el| el.gsub!('"', '') }
  end

  def tomahawk_link
    TOMAHAWK_URL % [enc(artist), enc(title)]
  end

  def to_html
    <<-HTML
      <div class="album">
        <a href="http://anonym.to/?#{source_link}" target="_blank">
          <img src="" class="cover" title="Download #{@name_string}"/>
        </a>
        <div class="bold artist">#{artist}</div>
        <div class="bold title">#{title}</div>
        <div>#{published_on.strftime('%b %d %I:%M%p %Z')}</div>
        <div class="categories">#{categories.first(3).join(' / ')}</div>
        <div class="links">
          <a href="#{tomahawk_link}">Album</a>
        </div>
      </div>
    HTML
  end

  def enc(str)
    @parser ||= URI::Parser.new
    @parser.escape(str)
  end
end
