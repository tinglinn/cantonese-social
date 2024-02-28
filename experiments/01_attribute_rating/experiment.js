const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    on_finish: function () {
        //jsPsych.data.displayData('csv');
        window.location = "https://tinglinn.github.io/cantonese-social/experiments/01_attribute_rating/thanks.html";
        proliferate.submit({ "trials": jsPsych.data.get().values() });
    }
});

let timeline = [];

// preload audio
let all_objects = trial_objects.concat(filler_objects, attention_check_objects)
const preload_array = all_objects; // defined in trial
const preload_trial = {
    type: jsPsychPreload,
    audio: preload_array  
};

// irb
const irb = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>IRB</p>`,
    choices: ['继续']
};
timeline.push(irb);

// instructions
const intro1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
            <p>本研究的调查对象为母语为粤语的的广州人。您可以将此链接分享给其他符合条件的人，但请不要多次参与本研究，您只会获得一次酬劳。</p>
            <p>本实验不超过 20 分钟，完成后您将获得20元人民币酬劳，会以支付宝转账的形式支付。</p>
            <p>请点击 "继续"。</p>`,
    choices: ['继续'],
};
timeline.push(intro1);

const intro2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
            <p>请确保您在安静的房间中用电脑完成本实验。</p>
            <p>在本实验中，您将聆听简短的音频片段，每段音频都是一名志愿者朗读的一个语段。</p>
            <p>听完每段音频后，您需要回答一些判断题。</p>`,
    choices: ['继续'],
};
timeline.push(intro2);

var likert_scale = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
];

// create array of critical trials, add attention check and filler trials, then shuffle
let critical_trials_array = selectCriticalTrials(trial_objects, 5);
let trials_array = critical_trials_array.concat(attention_check_objects, filler_objects);
let stimuli = shuffleArray(trials_array);

// create array of attributes and randomize attribute order per participant 
let raw_attributes = [
    { prompt: "这位朗读者受教育程度很高。", name: 'educated', labels: likert_scale, required: true },
    { prompt: "这位朗读者很友好。", name: 'friendly', labels: likert_scale, required: true },
    { prompt: "这位朗读者很随意。", name: 'casual', labels: likert_scale, required: true },
    { prompt: "这位朗读者很传统。", name: 'traditional', labels: likert_scale, required: true },
    { prompt: "这位朗读者很可靠。", name: 'dependable', labels: likert_scale, required: true },
    { prompt: "这位朗读者是广州本地人。", name: 'local', labels: likert_scale, required: true }
];
let attributes = shuffleArray(raw_attributes); // shuffle array is from utils.js

// trial objects
const trials = {
    timeline: [
        {
            type: jsPsychAudioKeyboardResponse,
            choices: ['NO_KEYS'],
            stimulus: jsPsych.timelineVariable('stimulus'),
            response_allowed_while_playing: false,
            trial_ends_after_audio: true,
            prompt: `请注意聆听音频`,
        },
        {
            type: jsPsychSurveyLikert,
            preamble: function () {
                new_audio_path = "<audio controls src=" + '"' + jsPsych.timelineVariable('stimulus') + '"' + ">";
                return `<p>按播放键再次聆听音频。</p>
              <p>${new_audio_path}</p>
              <p>您有多同意以下的说法？1表示完全不同意，6代表完全同意。</p>`
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
// timeline.push(trials);

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
const language_background_survey = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>您会说哪些语言或方言（比如台山话，粤语，客家话，普通话）？</p>
               <p>请按您<b>使用的自如程度</b>将它们进行排序，将您最自如的语言或方言放在第一位。</p>`,
    html: ` <p>
                <input name="lang1" type="text" placeholder="" required><BR><BR>
                <input name="lang2" type="text" placeholder=""><BR><BR>
                <input name="lang3" type="text" placeholder=""><BR><BR>
                <input name="lang4" type="text" placeholder=""><BR><BR>
                <input name="lang5" type="text" placeholder="">
            </p>`
};
timeline.push(language_background_survey);

const language_use_survey = {
    type: jsPsychSurveyLikert,
    preamble: `您有多经常在以下场景使用粤语？1代表从不使用，6代表您在此场合只使用粤语。`,
    questions: [
        { prompt: "与家人。", name: 'family', labels: likert_scale, required: true },
        { prompt: "与朋友", name: 'friends', labels: likert_scale, required: true },
        { prompt: "在学校或工作场所", name: 'study/work', labels: likert_scale, required: true },
    ],
    randomize_question_order: true,
};
timeline.push(language_use_survey);

// language attitude survey
const language_attitude_survey = {
    type: jsPsychSurveyLikert,
    preamble: `您有多同意以下的观点？1代表完全不同意，6代表完全同意。`,
    questions: [
        { prompt: "粤语是广州文化重要的一部分。", name: 'likert_culture', labels: likert_scale, required: true },
        { prompt: "把粤语传承给广州的年轻一代非常重要", name: 'likert_young', labels: likert_scale, required: true },
        { prompt: "在广州，粤语已经不再被规范使用", name: 'likert_proper', labels: likert_scale, required: true },
        { prompt: "粤语对我的身份认同感很重要。", name: 'likert_identity', labels: likert_scale, required: true },
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

/* thank u */
const thankyou = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
            <p>感谢您完成本次实验！</p>
            <p>我们将尽快将您的酬劳转给您.</p>
            <p>请按"提交"按钮正式完成本实验。</p>
      `,
    choices: ["提交"],
};
timeline.push(thankyou);

jsPsych.run(timeline);