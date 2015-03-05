library(historicalmaps)

cnty <- subset(swe_counties, from <= 1900 & tom >= 1900)
unlink("output/data/map.geo.json")
spat_to_json(cnty, "output/data/map")