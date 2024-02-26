// shuffle clips, select only one (lazy, non-lazy) per sentence pair, determine trial order
function shuffle_array(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// select clips
function select_clips() {

}