rm(list = ls())

setwd("~/SpiderOak Hive/ADIP/D3/d3_scatterplot")

library(tidyverse)
library(wordcloud)
library(tm)
library(dplyr)
library(xtable)

data <- read.csv("egresos.csv")

names(data)

data <- data %>%
  spread(libertad, total)

write.csv(data, "egresos_spread.csv")

data <- read.csv("egresos_spread.csv")
names(data)
