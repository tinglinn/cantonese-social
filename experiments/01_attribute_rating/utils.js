// shuffle clips
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// select clips
function selectCriticalTrials(trial_objects, countPerGroup) {
    // Define arrays to hold selected clips for each group
    let selectedNL = [];
    let selectedNGG = [];
    let selectedNGN = [];

    // Function to select random clips from a group
    function selectRandomClipsFromGroup(group, count) {
        let selected = [];
        while (selected.length < count) {
            let randomClip = group[Math.floor(Math.random() * group.length)];
            // Check if the selected clip's pair is not already in the selected array
            if (!selected.find(clip => clip.clip.slice(0, -2) === randomClip.clip.slice(0, -2))) {
                selected.push(randomClip);
            }
        }
        return selected;
    }

    // Randomly select clips from each group
    selectedNL = selectRandomClipsFromGroup(trial_objects.filter(obj => obj.clip.startsWith('NL')), countPerGroup);
    selectedNGG = selectRandomClipsFromGroup(trial_objects.filter(obj => obj.clip.startsWith('NGG')), countPerGroup);
    selectedNGN = selectRandomClipsFromGroup(trial_objects.filter(obj => obj.clip.startsWith('NGN')), countPerGroup);

    // Concatenate selected clips from all groups
    let selectedClips = selectedNL.concat(selectedNGG, selectedNGN);
    return selectedClips;
}
