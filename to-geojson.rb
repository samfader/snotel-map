require 'csv'
require 'json'
require 'pp'

i = 0
features = []
start_line = []
end_line = []

## Loop through each row of the data
CSV.foreach("data/station_data.csv") do |row|
	## Get the lat and lon and convert to float
	lat = row[1].to_f
	lon = row[2].to_f

	## Get the week day, month, and day of the month
	ele = row[0]
	name = row[3]
	triplet = row[4]

	## If the first row, then there is only start of the line 
	# if (i <= 1 )
	# 	start_line = [lon,lat]
	# else
	# 	end_line = [lon,lat]

		## Add the new geoJSON data to the features array
		features << {type:'Feature', properties: {ele: ele, name: name, triplet: triplet }, geometry: {type:'Point', coordinates: [lon, lat] } }

	# 	## The end of the line is not the start of the next line
	# 	start_line = end_line
	# end
	# i += 1
end


## Add it to the entire geoJSON set
geoJSON = {type: 'FeatureCollection', features: features}

## Write to JS file for web visualization
File.open("data/final.js","w") do |f|
  		f.write(geoJSON.to_json)
end

## Write to geoJSON for TileMill
File.open("data/stations.geoJSON","w") do |f|
  		f.write(geoJSON.to_json)
end