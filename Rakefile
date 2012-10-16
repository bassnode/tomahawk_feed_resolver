# encoding: utf-8
require 'nokogiri'
require 'open-uri'
require 'date'
require 'yaml'
require 'webrick'
require './album'

def start_webserver!(filename)
  root = File.expand_path '.'
  port = 9999
  server = WEBrick::HTTPServer.new :Port => port, :DocumentRoot => root
  trap('INT') { server.shutdown }

  fork{ `sleep 1; open http://localhost:#{port}/#{filename}` }
  server.start
end

task :default => [:run]

task :run, :days do |task, args|
  sources = YAML.load_file('feeds.yml')['feeds']
  albums = []
  days = args[:days] || 2
  filename = "#{Date.today.to_s}.html"

  sources.each do |src|
    puts "Pulling #{days} days from #{src}"

    feed = Nokogiri::XML(open(src))
    feed.xpath('//item').each do |album|
      pub_date =  Date.parse(album.xpath('pubDate').text)
      if pub_date >= Date.today - days.to_i
        albums << Album.new(album)
      end
    end
  end


  File.open(filename, "w+") do |f|
    f.puts %Q{
    <!DOCTYPE html>
    <html>
    <head>
      <title>Choons</title>

      <link href="assets/styles.css" media="screen" rel="stylesheet" type="text/css" />
      <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
      <script src="assets/script.js" type="text/javascript"></script>
    </head>
    <body>

      <div id="albums">
      #{albums.sort_by(&:published_on).reverse.map(&:to_html).join}
      </div>

    </body>
    </html>
    }
  end

  puts "Wrote #{albums.size} albums to #{filename}"
  start_webserver! filename
end
