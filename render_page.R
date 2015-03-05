render_page <- function(clean = FALSE) {
  library(rmarkdown)
  dir.create('output/data', showWarnings = FALSE)
  dir.create('output/js', showWarnings = FALSE)
  dir.create('output/css', showWarnings = FALSE)
  file.copy('views', 'output', recursive = TRUE)
  file.copy('js', 'output', recursive = TRUE)
  file.copy('css', 'output', recursive = TRUE)
  file.copy('includes/robots.txt', 'output', recursive = TRUE)
  source("scripts/make_map.R")
  render('index.Rmd', output_dir='output')
}