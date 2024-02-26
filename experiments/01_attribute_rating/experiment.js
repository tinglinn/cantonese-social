let timeline = [];

// preload audio
const preload_array = trial_objects; // defined in trial
const preload_trial = {
    type: jsPsychPreload,
    audio: preload_array  
};

// irb
const irb = {
    type: jsPsychHtmlButtonResponse,
    stimulus: ``,
    choices: ['继续']
};
timeline.push(irb);

// instructions
const intro1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>本研究的调查对象为以粤语为母语的广州人。您可以将此链接分享给其他符合条件的人，但请不要多次参与本研究，您只会获得一次报酬。</p>
            <p>本实验不超过 20 分钟，完成后您将获得20元人民币，会以支付宝转账的形式交付。</p>
            <p>请点击 "继续"。</p>`,
    choices: ['继续'],
};
timeline.push(intro1);

const intro2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>请确保您在安静的房间中用电脑完成本实验。在实验过程中，您应使用耳机或耳麦。</p>
            <p>在本实验中，您将聆听简短的音频片段，每段音频中录有一位志愿者朗读的一个短语或句子。</p>
            <p>"听完每段音频后，您需要回答一些判断题。</p>`,
    choices: ['继续'],
};
timeline.push(intro2);

var likert_scale = [
    "强烈不同意",
    "不同意",
    "较为不同意",
    "较为同意",
    "同意",
    "强烈同意"
];

// create array of stimuli and randomize stimuli
let tv_array = create_tv_array(trial_objects);
let stimuli = shuffle_array(tv_array);

// create array of attributes and randomize attribute order per participant 
let raw_attributes = [
    { prompt: "这位朗读者受教育程度很高。", name: 'educated', labels: likert_scale, required: true },
    { prompt: "这位朗读者很友好。", name: 'friendly', labels: likert_scale, required: true },
    { prompt: "这位朗读者很随意。", name: 'casual', labels: likert_scale, required: true },
    { prompt: "这位朗读者很有涵养。", name: 'proper', labels: likert_scale, required: true },
    { prompt: "这位朗读者很可靠。", name: 'dependable', labels: likert_scale, required: true },
    { prompt: "这位朗读者是广州本地人。", name: 'local', labels: likert_scale, required: true }
];
let attributes = shuffle_array(raw_attributes); // shuffle array is from utils.js

// trial objects
const trials = {
    timeline: [
        {
            type: jsPsychAudioKeyboardResponse,
            choices: ['NO_KEYS'],
            stimulus: jsPsych.timelineVariable('stimulus'),
            response_allowed_while_playing: false,
            trial_ends_after_audio: true,
            prompt: `请注意聆听接下来的音频`,
        },
        {
            type: jsPsychSurveyLikert,
            preamble: function () {
                new_audio_path = "<audio controls src=" + '"' + jsPsych.timelineVariable('stimulus') + '"' + ">";
                return `<p>按播放键再次聆听音频。</p>
              <p>${new_audio_path}</p>
              <p>您有多同意以下的说法:</p>`
            },
            questions: function () {
                return attributes
            },
            on_finish: function (data) {
                jsPsych.setProgressBar(data.trial_index / 93)
            },
            data: jsPsych.timelineVariable('data')
        },
    ],
    timeline_variables: stimuli,
};
timeline.push(trials);

// demographic survey
const demographic_survey = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'html',
                prompt: `<p style="color: #000000">请回答下列问题:</p>`,
            },
            {
                type: 'multi-choice',
                prompt: "您的性别是什么?",
                name: 'gender',
                options: ['男', '女', '非二元性别', '我不希望回答这个问题'],
                required: false,
            },
            {
                type: 'text',
                prompt: "您今年几岁?",
                name: 'age',
                required: true,
            },
            {
                type: 'multi-choice',
                prompt: "您的最高学历是什么?",
                name: 'education',
                options: ['未完成小学', '小学', '初中', '高中或中专', '大专', '本科', '硕士', '博士', '我不希望回答这个问题'],
                required: false,
            }
        ]
    ],
    button_label_finish: '继续',
};
timeline.push(demographic_survey);

// language background survey


// language attitude survey
var likert_scale = [
    "强烈不同意",
    "不同意",
    "中性",
    "同意",
    "强烈同意"
];

const language_attitude_survey = {
    type: jsPsychSurveyLikert,
    preamble: `您有多同意以下的观点？`,
    questions: [
        { prompt: "粤语是广州文化重要的一部分。", name: 'likert_culture', labels: likert_scale_singlish, required: true },
        { prompt: "把粤语传承给广州的年轻一代非常重要", name: 'likert_young', labels: likert_scale_singlish, required: true },
        { prompt: "在广州，粤语已经不再被规范使用", name: 'likert_proper', labels: likert_scale_singlish, required: true },
        { prompt: "粤语对我的身份认同感很重要。", name: 'likert_identity', labels: likert_scale_singlish, required: true },
    ],
    randomize_question_order: true,
};
timeline.push(language_attitude_survey);

// free response


// payment information
const payment = {
    type: jsPsychSurveyText,
    questions: [
        {
            prompt: `
            <p>请提供您的支付宝账号，以便我们给您转账。.</p>
            `,
            name: 'payment'
        }
    ]
};
timeline.push(payment);