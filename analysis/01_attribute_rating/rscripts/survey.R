# This helper function is meant to allow for the extraction of the JSPsych survey results, which embed themselves as a dictionary in the "response" column of the trial that includes the survey.
# This code is maintained by Brandon Papineau (branpap@stanford.edu) and Yin Lin Tan (yltan@stanford.edu), adapted from code originally written by Yin Lin


#INSTRUCTIONS: call the function, and place the dataframe as the first argument. 
# The second argument is the unique identifier such as 'workerid' that the function uses to match survey information to the correct worker
# The final argument is the name of the column that contains the data to be extracted. Unless you change it, this should be "response"


extract_demographics <- function(df,identifier,response) {
  
  newDF <- df %>% 
    filter(df$trial_type == "survey")
  newDF <- newDF[c(identifier,response)]
  
  colnames(newDF)[1] = "workerid" # rename column
  
  # remove curly braces from "response" column
  newDF$response<-gsub("\\{","",newDF$response)
  newDF$response<-gsub("\\}","",newDF$response)
  
  # remove single quotes from "response" column
  newDF$response<-gsub("None","'None'",newDF$response)
  
  # Remove square brackets from data
  newDF$response<-gsub("\\[","",newDF$response)
  newDF$response<-gsub("\\]","",newDF$response)
  
  # create new data frame
  questionnaire <- data.frame()
  
  # splitting the response column
  for (i in 1:nrow(newDF)) {
    response_split <- strsplit(newDF$response[i], ("',"))
    for (j in 1:length(response_split[[1]])) {
      questionnaire <- rbind(questionnaire, 
                             data.frame(workerid = newDF$workerid[i], 
                                        response = response_split[[1]][j]))
    }
  }
  
  # remove leading spaces in the "response" column
  questionnaire$response <- trimws(questionnaire$response)
  
  # split data in "response" column into two based on colon
  questionnaire <- separate(questionnaire, response, into = c("factor", "value"), sep =": ")
  
  # remove single quotes from newly created dataframe column
  questionnaire$factor<-gsub("'","",questionnaire$factor)
  questionnaire$value<-gsub("'","",questionnaire$value)
  
  # pivot data to long format
  questionnaire <- pivot_wider(questionnaire,names_from = factor,values_from = value)
  
  # merge the new internal dataset to the existing one
  returnDF <- merge(df,questionnaire,by="workerid")
  
  return(returnDF)
}


extract_likert <- function(df,identifier,response) {
  
  newDF <- df %>% 
    filter(df$trial_type == "survey-likert")
  newDF <- newDF[c(identifier,response)]
  
  colnames(newDF)[1] = "workerid" # rename column
  
  # remove curly braces from "response" column
  newDF$response<-gsub("\\{","",newDF$response)
  newDF$response<-gsub("\\}","",newDF$response)
  
  # remove single quotes from "response" column
  newDF$response<-gsub("None","'None'",newDF$response)
  
  # Remove square brackets from data
  newDF$response<-gsub("\\[","",newDF$response)
  newDF$response<-gsub("\\]","",newDF$response)
  
  # create new data frame
  questionnaire <- data.frame()
  
  # splitting the response column
  for (i in 1:nrow(newDF)) {
    response_split <- strsplit(newDF$response[i], (","))
    for (j in 1:length(response_split[[1]])) {
      questionnaire <- rbind(questionnaire, 
                             data.frame(workerid = newDF$workerid[i], 
                                        response = response_split[[1]][j]))
    }
  }
  
  # remove leading spaces in the "response" column
  questionnaire$response <- trimws(questionnaire$response)
  
  # split data in "response" column into two based on colon
  questionnaire <- separate(questionnaire, response, into = c("factor", "value"), sep =": ")
  
  # remove single quotes from newly created dataframe column
  questionnaire$factor<-gsub("'","",questionnaire$factor)
  questionnaire$value<-gsub("'","",questionnaire$value)
  
  # pivot data to long format
  questionnaire <- pivot_wider(questionnaire,names_from = factor,values_from = value)
  
  # merge the new internal dataset to the existing one
  returnDF <- merge(df,questionnaire,by="workerid")
  
  return(returnDF)
}



