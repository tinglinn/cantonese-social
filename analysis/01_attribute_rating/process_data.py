import pandas as pd
import ast
import json
from trials import trial_objects

df = pd.read_csv('data/cantonese_lazy_accent-merged.csv')

pd.set_option('display.max_columns', None)

# extract values for specific keys from dictionary
def extract_value(d, key):
    if not pd.isna(d):
        return ast.literal_eval(d).get(key, None)
    return None

# select for only attribute rating trials
critical_trials = df.loc[(df['trial_index'] >= 4) & (df['trial_index'] <= 63)]
# print(critical_trials.head(4))

# create new columns for each attribute
keys = ['local', 'casual', 'educated', 'friendly', 'dependable', 'traditional']
critical_trials.loc[:, keys] = critical_trials['response'].apply(lambda x: pd.Series({key: extract_value(x, key) for key in keys}))
# print(critical_trials.head(4))

# combine rows (of audio stimulus and response data)
critical_trials.loc[:, 'stimulus'] = critical_trials['stimulus'].ffill()
critical_trials = critical_trials.dropna(subset=['response'])
# print(critical_trials.head(4))

# # exclude failed attention checks!
failed_1 = critical_trials.loc[(critical_trials['stimulus'] == 'audio/attention_check_1.mp3') & (critical_trials['response'] != "{'local': 0, 'casual': 0, 'educated': 0, 'friendly': 0, 'dependable': 0, 'traditional': 0}")]
failed_1_ids = failed_1['workerid']

failed_4 = critical_trials.loc[(critical_trials['stimulus'] == 'audio/attention_check_4.mp3') & (critical_trials['response'] != "{'local': 3, 'casual': 3, 'educated': 3, 'friendly': 3, 'dependable': 3, 'traditional': 3}")]
failed_4_ids = failed_4['workerid']

failed_6 = critical_trials.loc[(critical_trials['stimulus'] == 'audio/attention_check_6.mp3') & (critical_trials['response'] != "{'local': 5, 'casual': 5, 'educated': 5, 'friendly': 5, 'dependable': 5, 'traditional': 5}")]
failed_6_ids = failed_6['workerid']

concatenated_values = pd.concat([failed_1_ids, failed_4_ids, failed_6_ids])
value_counts = concatenated_values.value_counts()
failed_attention_checks = value_counts[value_counts >= 1].index
# print(failed_more_than_1_attention_checks)

passed_attention_critical_trials = critical_trials[~critical_trials['workerid'].isin(failed_attention_checks)]
# print(passed_attention_critical_trials.head(3))

# create new columns for condition and for clip content!
stimulus_to_condition = {obj['stimulus']: obj['condition'] for obj in trial_objects}
stimulus_to_clip = {obj['stimulus']: obj['clip'][:obj['clip'].rfind('_')] for obj in trial_objects}
passed_attention_critical_trials.loc[:, 'condition'] = passed_attention_critical_trials['stimulus'].map(stimulus_to_condition)
passed_attention_critical_trials.loc[:, 'clip'] = passed_attention_critical_trials['stimulus'].map(stimulus_to_clip)
passed_attention_critical_trials = passed_attention_critical_trials.dropna(subset=['condition'])
# print(passed_attention_critical_trials.head(3))


# create new column for language attitude(s)!
langatt_df = df.loc[(df['trial_index'] == 67) & (~df['workerid'].isin(failed_attention_checks))]
for workerid in langatt_df['workerid'].unique():
    response = langatt_df[langatt_df['workerid'] == workerid]['response'].iloc[0]
    response_dict = ast.literal_eval(response)
    
    for key in response_dict.keys():
        passed_attention_critical_trials.loc[df['workerid'] == workerid, key] = response_dict[key]

# create new columns for demographic data
demo_df = df.loc[(df['trial_index'] == 64) & (~df['workerid'].isin(failed_attention_checks))]
for workerid in demo_df['workerid'].unique():
    response = demo_df[demo_df['workerid'] == workerid]['response'].iloc[0]
    response_dict = ast.literal_eval(response)
    
    for key in response_dict.keys():
        value = response_dict[key]
        if value == "Guangzhou" or value == "Guangzhou " or value == "广州":
            value = "广州"
        elif value == "Hong Kong" or value == "hong kong " or value == "香港":
            value = "香港"
        
        passed_attention_critical_trials.loc[df['workerid'] == workerid, key] = value

attribute_rating_data = passed_attention_critical_trials.to_csv('./analysis/01_attribute_rating/attribute_rating_data.csv')