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

data <- read.csv("../attribute_rating_data.csv")
data = data %>% 
  mutate(cCondition = as.numeric(as.factor(condition)) - mean(as.numeric(as.factor(condition))))
head(data)


## EDUCATED
data$educated <- factor(data$educated, levels =  c(0:5), ordered = TRUE)
m.educated.logit = brm(educated ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
              data=data,
              family=cumulative(),
              cores=4)
summary(m.logit)

# adjacent category model
m.educated.acat = brm(educated ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
             data=data,
             family=acat(),
             save_all_pars=TRUE,
             cores=4)
summary(m.educated.acat)

loo(m.logit,m.acat)

m.educated.null = brm(educated ~ (1 + cCondition | clip) + (1 + cCondition | workerid),
                      data=data,
                      family=acat(),
                      save_all_pars=TRUE,
                      cores=4)
bayesfactor.educated <- bayes_factor(m.educated.acat, m.educated.null)
print(bayesfactor.educated)


## CASUAL
data$casual <- factor(data$casual, levels = c(0:5), ordered = TRUE)
m.casual.acat = brm(casual ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
                      data=data,
                      family=acat(),
                      save_all_pars=TRUE,
                      cores=4)
summary(m.casual.acat)

m.casual.null = brm(casual ~ (1 + cCondition | clip) + (1 + cCondition | workerid),
                    data=data,
                    family=acat(),
                    save_all_pars=TRUE,
                    cores=4)
bayesfactor.casual <- bayes_factor(m.casual.acat, m.casual.null)
print(bayesfactor.casual)


## TRADITIONAL
data$traditional <- factor(data$traditional, levels = c(0:5), ordered = TRUE)
m.traditional.acat = brm(traditional ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
                    data=data,
                    family=acat(),
                    save_all_pars=TRUE,
                    cores=4)
summary(m.traditional.acat)

m.traditional.null = brm(traditional ~ (1 + cCondition | clip) + (1 + cCondition | workerid),
                         data=data,
                         family=acat(),
                         save_all_pars=TRUE,
                         cores=4)
summary(m.traditional.acat)
bayesfactor.traditional <- bayes_factor(m.traditional.acat, m.traditional.null)
print(bayesfactor.traditional)


## FRIENDLY
data$friendly <- factor(data$friendly, levels = c(0:5), ordered = TRUE)
m.friendly.acat = brm(friendly ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
                         data=data,
                         family=acat(),
                         save_all_pars=TRUE,
                         cores=4)
summary(m.friendly.acat)

m.friendly.null = brm(friendly ~ (1 + cCondition | clip) + (1 + cCondition | workerid),
                         data=data,
                         family=acat(),
                         save_all_pars=TRUE,
                         cores=4)
bayesfactor.friendly <- bayes_factor(m.friendly.acat, m.friendly.null)
print(bayesfactor.friendly)


## DEPENDABLE
data$dependable <- factor(data$dependable, levels = c(0:5), ordered = TRUE)
m.dependable.acat = brm(dependable ~ cCondition + (1 + cCondition | clip) + (1 + cCondition | workerid),
                      data=data,
                      family=acat(),
                      save_all_pars=TRUE,
                      cores=4)
summary(m.dependable.acat)

m.dependable.null = brm(dependable ~ (1 + cCondition | clip) + (1 + cCondition | workerid),
                      data=data,
                      family=acat(),
                      save_all_pars=TRUE,
                      cores=4)
bayesfactor.dependable <- bayes_factor(m.dependable.acat, m.dependable.null)
print(bayesfactor.dependable)