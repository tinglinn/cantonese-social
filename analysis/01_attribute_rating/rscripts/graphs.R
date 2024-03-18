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

# Attribute Data
# PLOT for EDUCATED
data$educated <- factor(data$educated, levels = unique(data$educated))

# Calculate proportions of responses by condition
agr_part <- data %>% 
  group_by(condition, educated) %>% 
  summarise(count = n()) %>%
  group_by(condition) %>%
  mutate(prop = count / sum(count)) %>%
  ungroup()

# Define a color palette
cbPalette <- c("#E69F00", "#56B4E9")  # Example colors

# Plot
ggplot(agr_part, aes(x = as.numeric(as.character(educated)), y = prop, color = condition)) +
  geom_point(position = position_dodge(width = 0.2)) +
  geom_errorbar(aes(ymin = prop - 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count)), 
                    ymax = prop + 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count))),
                width = 0.1, position = position_dodge(width = 0.2)) +
  ylab("Response proportion") +
  xlab("Educated Ratings") + 
  scale_color_manual(values = cbPalette) +
  scale_x_continuous(labels = 1:6, breaks = 0:5)


# Plot for CASUAL

data$casual <- factor(data$casual, unique(data$casual))

# Calculate proportions of responses by condition
agr_part <- data %>% 
  group_by(condition, casual) %>% 
  summarise(count = n()) %>%
  group_by(condition) %>%
  mutate(prop = count / sum(count)) %>%
  ungroup()

# Define a color palette
cbPalette <- c("#E69F00", "#56B4E9")  # Example colors

# Plot
ggplot(agr_part, aes(x = as.numeric(as.character(casual)), y = prop, color = condition)) +
  geom_point(position = position_dodge(width = 0.2)) +
  geom_errorbar(aes(ymin = prop - 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count)), 
                    ymax = prop + 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count))),
                width = 0.1, position = position_dodge(width = 0.2)) +
  ylab("Response proportion") +
  xlab("Casual Ratings") + 
  scale_color_manual(values = cbPalette) +
  scale_x_continuous(labels = 1:6, breaks = 0:5)


# Plot for FRIENDLY
data$friendly <- factor(data$friendly, levels = unique(data$friendly))

# Calculate proportions of responses by condition
agr_part <- data %>% 
  group_by(condition, friendly) %>% 
  summarise(count = n()) %>%
  group_by(condition) %>%
  mutate(prop = count / sum(count)) %>%
  ungroup()

# Define a color palette
cbPalette <- c("#E69F00", "#56B4E9")  # Example colors

# Plot
ggplot(agr_part, aes(x = as.numeric(as.character(friendly)), y = prop, color = condition)) +
  geom_point(position = position_dodge(width = 0.2)) +
  geom_errorbar(aes(ymin = prop - 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count)), 
                    ymax = prop + 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count))),
                width = 0.1, position = position_dodge(width = 0.2)) +
  ylab("Response proportion") +
  xlab("Friendly Ratings") + 
  scale_color_manual(values = cbPalette) +
  scale_x_continuous(labels = 1:6, breaks = 0:5)


# Plot for TRADITIONAL
data$traditional <- factor(data$traditional, unique(data$traditional))

# Calculate proportions of responses by condition
agr_part <- data %>% 
  group_by(condition, traditional) %>% 
  summarise(count = n()) %>%
  group_by(condition) %>%
  mutate(prop = count / sum(count)) %>%
  ungroup()

# Define a color palette
cbPalette <- c("#E69F00", "#56B4E9")  # Example colors

# Plot
ggplot(agr_part, aes(x = as.numeric(as.character(traditional)), y = prop, color = condition)) +
  geom_point(position = position_dodge(width = 0.2)) +
  geom_errorbar(aes(ymin = prop - 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count)), 
                    ymax = prop + 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count))),
                width = 0.1, position = position_dodge(width = 0.2)) +
  ylab("Response proportion") +
  xlab("Traditional Ratings") + 
  scale_color_manual(values = cbPalette) +
  scale_x_continuous(labels = 1:6, breaks = 0:5)


# Plot for DEPENDABLE
data$dependable <- factor(data$dependable, levels= 0:5)

# Calculate proportions of responses by condition
agr_part <- data %>% 
  group_by(condition, dependable) %>% 
  summarise(count = n()) %>%
  group_by(condition) %>%
  mutate(prop = count / sum(count)) %>%
  ungroup()

# Define a color palette
cbPalette <- c("#E69F00", "#56B4E9")  # Example colors

# Plot
ggplot(agr_part, aes(x = as.numeric(as.character(dependable)), y = prop, color = condition)) +
  geom_point(position = position_dodge(width = 0.2), na.rm = FALSE) +
  geom_errorbar(aes(ymin = prop - 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count)), 
                    ymax = prop + 1.96 * sqrt(prop * (1 - prop)) / sqrt(sum(count))),
                width = 0.1, position = position_dodge(width = 0.2)) +
  ylab("Response proportion") +
  xlab("Dependable Ratings") + 
  scale_color_manual(values = cbPalette) +
  scale_x_continuous(labels = c(1:6), breaks = c(0:5)) +
  geom_point(data = NULL, aes(x = 0, y = 0), color = cbPalette[1], size = 1.2) +  # First point with color from cbPalette and size 2
  geom_point(data = NULL, aes(x = 0, y = 0 - 0.005), color = cbPalette[2], size = 1.2)   # Second point with color from cbPalette and size 2
  
 
image_size <- 6
# Language Attitude Data
data %>% 
  select("workerid","likert_identity") %>% 
  group_by(workerid, likert_identity) %>% 
  unique() %>% 
  ungroup() %>% 
  group_by(likert_identity) %>% 
  summarize(count = n()) %>% 
  ggplot(aes(x = likert_identity, y = count)) +
  geom_point() +
  labs(x = "Cantonese is important to my sense of identity.", y = "Count")+
  ylim(0, 25)
ggsave("likert_identity_plot.png", width = image_size, height = image_size)

data %>% 
  select("workerid","likert_culture") %>% 
  group_by(workerid,likert_culture) %>% 
  unique() %>% 
  ungroup() %>% 
  group_by(likert_culture) %>% 
  summarize(count = n()) %>% 
  ggplot(aes(x=likert_culture, y=count)) + 
  geom_point() +
  labs(x = "Cantonese is an important part of my culture.", y = "Count")+
  ylim(0, 25)
ggsave("likert_culture_plot.png", width = image_size, height = image_size)

data %>% 
  select("workerid","likert_young") %>% 
  group_by(workerid,likert_young) %>% 
  unique() %>% 
  ungroup() %>% 
  group_by(likert_young) %>% 
  summarize(count = n()) %>% 
  ggplot(aes(x=likert_young, y=count)) + 
  geom_point() +
  labs(x = "It is important to me to pass Cantonese onto my children.", y = "Count")+
  ylim(0, 25)
ggsave("likert_young_plot.png", width = image_size, height = image_size)

data %>% 
  select("workerid","likert_proper") %>% 
  group_by(workerid,likert_proper) %>% 
  unique() %>% 
  ungroup() %>% 
  group_by(likert_proper) %>% 
  summarize(count = n()) %>% 
  ggplot(aes(x=likert_proper, y=count)) + 
  geom_point() +
  labs(x = "Around me, Cantonese is no longer being spoken properly.", y = "Count")+
  ylim(0, 25)
ggsave("likert_proper_plot.png", width = image_size, height = image_size)
