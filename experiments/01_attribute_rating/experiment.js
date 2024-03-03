const jsPsych = initJsPsych({
    show_progress_bar: true,
    auto_update_progress_bar: false,
    message_progress_bar: "实验进度",
    on_finish: function () {
        //jsPsych.data.displayData('csv');
        window.location = "https://tinglinn.github.io/cantonese-social/experiments/01_attribute_rating/thanks.html";
        proliferate.submit({ "trials": jsPsych.data.get().values() });
    }
});

let timeline = [];

// preload audio
let all_objects = trial_objects.concat(attention_check_objects)
const preload_array = all_objects; // defined in trial
const preload_trial = {
    type: jsPsychPreload,
    audio: preload_array  
};

// irb
const irb = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p style="width: 1000px; margin-bottom: -250px">
    您被邀请参加一项斯坦福大学的研究。
    <BR><BR>在此实验中，您会完成一项跟语言有关的任务，例如读或听一些字、描述图片或场景、造句、或完成简单的语言游戏。
    <BR><BR>本研究中没有已知的风险、成本或不适。
    <BR><BR>
    如果您同意参与这项研究，请继续。
    <BR><BR>
    <BR><BR>
    </p>
    <p style="width: 1000px; font-size: 9pt; position: relative; top: 330px; padding-bottom: 30px; text-align: justify">
    如果您已读完此表格并决定参与此项目，请明白您的参与是自愿的，您有权随时撤回您的同意或停止参与，而不会受到惩罚或失去您原本可以享有的利益有权。 您有权拒绝回答任何问题。 您的个人隐私将在研究产生的所有已发布和书面数据中得到保护。
    <BR><BR>联系信息：问题、疑虑或投诉：如果您对本研究、其程序、风险和益处有任何问题、疑虑或投诉，请用邮箱联系Ting Lin(linting@stanford.edu)或者Judith Degen教授(jdegen@stanford.edu)。如果您对这项研究的进行方式不满意，或者如果您对研究或您作为参与者的权利有任何疑虑、投诉或一般问题，请联系斯坦福机构审查委员会 (IRB) 发言与独立于研究团队的人联系 +1(650)-723-2480 或拨打免费电话 1-866-680-2906。 您也可以致函 Stanford IRB, Stanford University, Stanford, CA 94305-5401 或发送电子邮件至 irbnonmed@stanford.edu。
    </p>`,
    choices: ['继续'],
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
};
timeline.push(irb);

// instructions
const intro1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
            <p>本研究的调查对象为母语为粤语的的广州人。您可以将此链接分享给其他符合条件的人，但请不要多次参与本研究，您只会获得一次酬劳。</p>
            <p>本实验将用时大约15分钟，完成后您将获得25元人民币酬劳，会以支付宝转账的形式支付。</p>
            <p>请点击 "继续"。</p>`,
    choices: ['继续'],
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
};
timeline.push(intro1);

const intro2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
            <p>请确保您在安静的房间中用电脑完成本实验。</p>
            <p>在本实验中，您将聆听简短的音频片段，每段音频都是一名志愿者朗读的一个语段。</p>
            <p>听完每段音频后，您需要回答一些判断题。</p>`,
    choices: ['继续'],
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
};
timeline.push(intro2);

const soundcheck = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>实验开始前，请调整音量，确保您可以非常清楚地听到以下音频。</p>
    <p><audio controls><source src="./audio/soundcheck.mp3" type="audio/mp3"></audio></p>
    <br><p>此外，以下音频将于实验过程中会出现数次，请遵守音频中的指示，<br>那一轮的每一道判断题<b>都请选择音频中的数字</b>。</p>
    <p><audio controls><source src="./audio/attention_check_1.mp3" type="audio/mp3"></audio></p`,
    choices: ['继续'],
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
}
timeline.push(soundcheck)

var likert_scale = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6"
];

// create array of critical trials, add attention check and filler trials, then shuffle
let critical_trials_array = selectCriticalTrials(trial_objects);
let trials_array = critical_trials_array.concat(attention_check_objects);
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
    timeline: [],
};

stimuli.forEach((stimulus) => {
    trials.timeline.push(
        {
            type: jsPsychAudioKeyboardResponse,
            choices: ['NO_KEYS'],
            stimulus: stimulus.stimulus,
            response_allowed_while_playing: false,
            trial_ends_after_audio: true,
            prompt: `请注意聆听音频`,
        },
        {
            type: jsPsychSurveyLikert,
            preamble: function () {
                new_audio_path = "<audio controls src=" + '"' + stimulus.stimulus + '"' + ">";
                return `<p>按播放键再次聆听音频。</p>
              <p>${new_audio_path}</p>
              <p>您有多同意以下的说法？1表示完全不同意，6代表完全同意。</p>
              <p>以“友好”为例，1-这位朗读者一点都不友好，6-这位朗读者非常友好。</p>`
            },
            questions: attributes,
            on_finish: function (data) {
                jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
            },
            data: stimulus.data,
            button_label_finish: '继续',
        }
    );
});
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
                options: ['男', '女', '非二元性别', '不想回答'],
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
                options: ['未完成小学', '小学', '初中', '高中或中专', '大专', '本科', '硕士', '博士', '不想回答'],
                required: false,
            }
        ]
    ],
    button_label_finish: '继续',
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
};
// timeline.push(demographic_survey);

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
            </p>`,
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
    button_label_finish: '继续',
};
// timeline.push(language_background_survey);

const language_use_survey = {
    type: jsPsychSurveyLikert,
    preamble: `您有多经常在以下场景使用粤语？1代表从不使用，6代表您在此场合只使用粤语。`,
    questions: [
        { prompt: "与家人", name: 'family', labels: likert_scale, required: true },
        { prompt: "与朋友", name: 'friends', labels: likert_scale, required: true },
        { prompt: "在学校或工作场所", name: 'study/work', labels: likert_scale, required: true },
    ],
    randomize_question_order: true,
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
    button_label_finish: '继续',
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
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
    button_label_finish: '继续',
};
timeline.push(language_attitude_survey);

// free response
var free_response = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'multi-choice',
                prompt: "您听过懒音这个概念吗?",
                name: 'have_heard',
                options: ['是', '否'],
                required: true,
            },
            {
                type: 'text',
                prompt: "如果听过懒音这个概念，您对懒音的使用有什么看法吗？",
                name: 'attitude',
                required: false,
            },
        ]
    ],
    button_label_finish: '继续',
}
timeline.push(free_response)

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
    ],
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
    button_label_finish: '继续',
};
timeline.push(payment);

/* thank u */
const thankyou = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
            <p>感谢您完成本次实验！</p>
            <p>我们将尽快将您的酬劳转给您。如有问题，可以微信联系tinglin_22。</p>
            <p>请按"提交"按钮正式完成本实验。</p>
      `,
    choices: ["提交"],
    on_finish: function (data) {
        jsPsych.setProgressBar(data.trial_index / 76) // adjust total num of trials
    },
};
timeline.push(thankyou);

jsPsych.run(timeline);