# Install and load necessary packages
install.packages("ordinal")
install.packages("lme4")
install.packages("effects")
install.packages("ggeffects")
library(ordinal)
library(lme4)
library(dplyr)
library(tidyverse)
library(brms)
library(ggplot2)
library(ggeffects)
library(effects)

# Assuming your data frame is named 'data' and it contains the variables 'local', 'condition', 'clip', 'workerid', and 'pronunciation_category'
data <- read.csv("../attribute_rating_data.csv")
head(data)
raw_data <- read.csv('../../../data/cantonese_lazy_accent-merged.csv')
head(raw_data)
# Centering the binary predictor 'condition'
data = data %>% 
  mutate(cCondition = as.numeric(as.factor(condition)) - mean(as.numeric(as.factor(condition))))
head(data)

# Fit the ordinal mixed-effects regression model for LOCAL
data$local <- factor(data$local, levels = unique(data$local))
m.local <- clmm(local ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid), data = data)

summary(m.local)


# Fit the ordinal mixed-effects regression model for CASUAL
data$casual <- factor(data$casual, levels = unique(data$casual))
m.casual <- clmm(casual ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid), data = data)
summary(m.casual)


# Fit the ordinal mixed-effects regression model for FRIENDLY
data$friendly <- factor(data$friendly, levels = unique(data$friendly))
m.friendly <- clmm(friendly ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid), data = data)

summary(m.friendly)


# Fit the ordinal mixed-effects regression model for TRADITIONAL
data$traditional <- factor(data$traditional, levels = unique(data$traditional))
m.traditional <- clmm(traditional ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid), data = data)

summary(m.traditional)


# Fit the ordinal mixed-effects regression model for EDUCATED
data$educated <- factor(data$educated, levels = unique(data$educated))
m.educated <- clmm(educated ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid), data = data)

summary(m.educated)


# Fit the ordinal mixed-effects regression model for DEPENDABLE
data$dependable <- factor(data$dependable, levels = unique(data$dependable))
m.dependable <- clmm(dependable ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid), data = data)

summary(m.dependable)



# BAYESIAN ANALYSIS
# cumulative link model
data$casual <- factor(data$casual, ordered=TRUE)
m.logit = brm(casual ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
              data=data,
              family=cumulative(),
              cores=4)
summary(m.logit)

# adjacent category model
m.acat = brm(casual ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
             data=data,
             family=acat(),
             cores=4)
summary(m.acat)
# marginal_effects(m.acat)

# In the context of model selection, an LOOIC difference greater than twice its corresponding standard error can be interpreted as suggesting that the model with the lower LOOIC value fits the data substantially better, at least when the number of observations is large enough
loo(m.logit,m.acat)


