install.packages("ordinal")
install.packages("lme4")
install.packages("effects")
install.packages("ggeffects")
library(tidyverse)
library(brms)
library(ggplot2)
library(ggeffects)
library(effects)

data <- read.csv("../attribute_rating_data.csv")
data = data %>% 
  mutate(cCondition = as.numeric(as.factor(condition)) - mean(as.numeric(as.factor(condition))))
head(data)
counts <- table(data$origin)
print(counts)

## CASUAL
data$casual <- factor(data$casual, levels = c(0:5), ordered = TRUE)
data_split <- split(data, data$origin)
f.casual <- brmsformula(casual ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid))
unique(data$casual)

# function to fit Bayesian ordinal regression model for each group
fit_model_to_group <- function(df) {
  brm(casual ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),  # Use the formula from your existing model
      data = df,
      family = acat(),
      save_all_pars = TRUE,
      cores = 4)
}

# Apply the model to each group in data_split
models.casual <- lapply(data_split, fit_model_to_group)

# display the summary of each model
for (i in seq_along(models.casual)) {
  cat("Origin:", names(models.casual)[i], "\n")
  print(summary(models.casual[[i]]))
}


## TRADITIONAL
data$traditional <- factor(data$traditional, levels = c(0:5), ordered = TRUE)
data_split <- split(data, data$origin)
f.traditional <- brmsformula(traditional ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid))
unique(data$traditional)
# function to fit Bayesian ordinal regression model for each group
fit_traditional_model <- function(df) {
  brm(f.traditional, data = df, family = acat(), save_all_pars = TRUE, cores = 4)
}

# fit separate models for each group
ms.traditional <- lapply(data_split, fit_traditional_model)

# display the summary of each model
for (i in seq_along(ms.traditional)) {
  cat("Origin:", names(ms.traditional)[i], "\n")
  print(summary(ms.traditional[[i]]))
}


## EDUCATED
data$educated <- factor(data$educated, levels = c(0:5), ordered = TRUE)
data_split <- split(data, data$origin)
f.educated <- brmsformula(educated ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid))
unique(data$educated)
# function to fit Bayesian ordinal regression model for each group
fit_educated_model <- function(df) {
  brm(f.educated, data = df, family = acat(), save_all_pars = TRUE, cores = 4)
}

# fit separate models for each group
ms.educated <- lapply(data_split, fit_educated_model)

# display the summary of each model
for (i in seq_along(ms.educated)) {
  cat("Origin:", names(ms.educated)[i], "\n")
  print(summary(ms.educated[[i]]))
}


## FRIENDLY
data$friendly <- factor(data$friendly, levels = c(0:5), ordered = TRUE)
data_split <- split(data, data$origin)
f.friendly <- brmsformula(friendly ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid))

# function to fit Bayesian ordinal regression model for each group
fit_friendly_model <- function(df) {
  brm(f.friendly, data = df, family = acat(), save_all_pars = TRUE, cores = 4)
}

# fit separate models for each group
ms.friendly <- lapply(data_split, fit_friendly_model)

# display the summary of each model
for (i in seq_along(ms.friendly)) {
  cat("Origin:", names(ms.friendly)[i], "\n")
  print(summary(ms.friendly[[i]]))
}


## DEPENDABLE
data$dependable <- factor(data$dependable, levels = c(0:5), ordered = TRUE)
data_split <- split(data, data$origin)
f.dependable <- brmsformula(dependable ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid))

# function to fit Bayesian ordinal regression model for each group
fit_dependable_model <- function(df) {
  brm(f.dependable, data = df, family = acat(), save_all_pars = TRUE, cores = 4)
}

# fit separate models for each group
ms.dependable <- lapply(data_split, fit_dependable_model)

# display the summary of each model
for (i in seq_along(ms.dependable)) {
  cat("Origin:", names(ms.dependable)[i], "\n")
  print(summary(ms.dependable[[i]]))
}