# encoding: utf-8
require 'date'

class Album

  TOMAHAWK_URL = "tomahawk://view/album?artist=%s&name=%s"
  YOUTUBE_URL = "https://www.youtube.com/results?search_query=%s-%s"

  attr_accessor :artist, :title, :description, :categories, :source_link, :published_on

  # @param [Nokogiri::XML::Element]
  def initialize(element)
    @name_string = element.xpath('title').text
    @description = element.xpath('description').text
    @source_link = element.xpath('link').text
    @categories = element.xpath('category').map(&:text)
    offset_date = DateTime.parse(element.xpath('pubDate').text).to_time
    @published_on = offset_date + offset_date.utc_offset

    set_artist_and_title!
    filter_categories!
  end

  # Remove the artist and album name from @categories
  def filter_categories!
    fluff = ['ep', 'single', 'album', 'archive', artist, title].map(&:downcase)
    categories.reject!{ |cat| fluff.include? cat.downcase }
  end

  # This could be smarter, but for now it works in most cases.
  def set_artist_and_title!
    # Replace &#8211; char with something we can match on below
    decoded = @name_string.gsub(/\342\200\223/u,"^^")
    splitter = case decoded
               when /\^\^/
                 '^^'
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

  def youtube_link
    YOUTUBE_URL % [enc(artist), enc(title)]
  end

  def to_html(index=0)
    <<-HTML
      <div class="album span3" data-colindex="#{index}">
        <a href="#{source_link}" target="_blank">
          <img src="http://placehold.it/131x131" class="cover" title="Original link to #{@name_string}"/>
        </a>
        <div class="bold artist">#{artist}</div>
        <div class="bold title">#{title}</div>
        <div>#{published_on.strftime('%b %d %I:%M%p %Z')}</div>
        <div class="categories">#{categories.first(3).join(' / ')}</div>
        <div class="links">
          <i class="icon-headphones"></i>
          <a href="#{tomahawk_link}">Album</a>
          <a href="#{youtube_link}" target="_blank">YouTube</a>
        </div>
      </div>
    HTML
  end

  def enc(str)
    URI.encode_www_form_component(str)
  end

  # @param [Array<Album>] the Albums to display
  # @return [String] the complete HTML
  def self.to_html(albums)
    html = ''
    columns = 4

    albums.sort_by(&:published_on).reverse.each_slice(columns) do |group|
      html << '<div class="row-fluid">'
      group.each_with_index do |album, index|
        html << album.to_html(index)
      end

      html << '</div>'
    end
    html
  end

end
