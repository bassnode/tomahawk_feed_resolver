# encoding: utf-8
require 'nokogiri'
require 'open-uri'
require 'time'
require 'yaml'
require 'webrick'
require './album'

def start_webserver!(filename)
  root = File.expand_path '.'
  port = 9999
  server = WEBrick::HTTPServer.new :Port => port, :DocumentRoot => root

  pid = fork{ `sleep 1; open http://localhost:#{port}/#{filename}` }

  trap('INT') do
    server.shutdown
    Process.detach(pid)
  end

  server.start
end

task :default => [:run]

file 'feeds.yml' => 'feeds.yml.example' do
  cp 'feeds.yml.example', 'feeds.yml'
end

desc <<-EOM
  Pulls 2 days of listings from everything in feeds.yml Set DAYS env. variable to lengthen date range.
EOM
task :run => 'feeds.yml' do |t|
  sources = YAML.load_file('feeds.yml')['feeds']
  albums = []
  days = ENV['DAYS'] || 2
  today = Time.now
  filename = "#{today.strftime('%Y-%m-%d')}.html"

  tg = ThreadGroup.new
  mutex = Mutex.new

  sources.each do |src|
    t = Thread.new do
      puts "Pulling #{src}\n"
      feed = Nokogiri::XML(open(src))

      feed.xpath('//item').each do |album|
        pub_date =  Time.parse(album.xpath('pubDate').text)

        if pub_date >= today - days.to_i * 86400
          mutex.synchronize do
            albums << Album.new(album)
          end
        end
      end
    end

    tg.add(t)
  end

  tg.list.each(&:join)

  File.open(filename, "w+") do |f|
    f.puts %Q{
    <!DOCTYPE html>
    <html>
    <head>
      <title>Choons</title>

      <link href="assets/css/bootstrap.min.css" rel="stylesheet">
      <link href="assets/css/styles.css" media="screen" rel="stylesheet">
    </head>
    <body>

      <div id="albums" class="container-fluid">
      #{Album.to_html(albums)}
      </div>

      <script src="assets/js/jquery.js"></script>
      <script src="assets/js/bootstrap.min.js"></script>
      <script src="assets/js/script.js" type="text/javascript"></script>
    </body>
    </html>
    }
  end

  puts "Wrote #{albums.size} albums to #{filename}"
  start_webserver! filename
end
