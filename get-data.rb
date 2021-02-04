require 'uri'
require 'net/http'
require 'json'
require 'fileutils'
require 'json_converter'

json_converter= JsonConverter.new

url = URI("http://api.powderlin.es/stations")
http = Net::HTTP.new(url.host, url.port)
# http.use_ssl = true

request = Net::HTTP::Get.new(url, 'Content-Type' => 'application/json')
# request["Authorization"] = 'Bearer 4e8a674315267fbce8917d88cbce865fb4596279'
# request["cache-control"] = 'no-cache'

response = http.request(request)
stations = JSON.parse(response.read_body)
File.write("station_data.json", stations) 
# puts data

csv = json_converter.generate_csv stations
File.write("station_data.csv", csv) 

# require 'csv'
# require 'json'

# CSV.open("your_csv.csv", "w") do |csv|
#   JSON.parse(File.open("station_data.json").read).each do |hash|
#     csv << hash.values
#   end
# end

# puts csv_string

# array = []

# for i in 0..data.size
#   array.push
# end

stations_geojson = 
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
        ]
      }
    }
  ]
}

  # Loop thru responses, gather logins, save to file, paginate
  # File.open("employees_#{Time.new.strftime("%Y-%m-%d")}.txt", 'a') {|f| f.write(logins.join("\n")) }