// shuffle clips
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// select clips
function selectCriticalTrials(trial_objects) {
    // Define arrays to hold selected clips for each group
    const pairs = {};

    // Group clips into pairs based on common clip identifier (i.e. "NL_01")
    trial_objects.forEach(obj => {
        const clipIdentifier = obj.clip.substring(0, obj.clip.lastIndexOf('_'));
        console.log(clipIdentifier);
        if (!pairs[clipIdentifier]) {
            pairs[clipIdentifier] = [];
        }
        pairs[clipIdentifier].push(obj);
    });

    // Randomly select one clip from each pair
    const selectedClips = [];
    for (const clipIdentifier in pairs) {
        const pair = pairs[clipIdentifier];
        const randomIndex = Math.floor(Math.random() * pair.length);
        selectedClips.push(pair[randomIndex]);
    }
    console.log(selectedClips.length)
    return selectedClips;
}
