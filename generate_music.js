const { SunoAI } = require('suno-ai');
const fs = require('fs');
const path = require('path');

const SUNO_COOKIE = 'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3MzEyNDg5OTcsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvY2xlcmtfaWQiOiJ1c2VyXzJvZjIwUktOTHZ1TmEzUFhxdU5melB2U09waCIsImh0dHBzOi8vc3Vuby5haS9jbGFpbXMvZW1haWwiOiJhc2hkZWVwa2F1ci4xNUBnbWFpbC5jb20iLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL3Bob25lIjpudWxsLCJpYXQiOjE3MzEyNDg5MzcsImlzcyI6Imh0dHBzOi8vY2xlcmsuc3Vuby5jb20iLCJqdGkiOiI5NzllNTBmYjgxZGU3YTFlMmZhYiIsIm5iZiI6MTczMTI0ODkyNywic2lkIjoic2Vzc18yb2YyMFJvYkxEQW9mTUxWaUc1SWFyQk1NbFQiLCJzdWIiOiJ1c2VyXzJvZjIwUktOTHZ1TmEzUFhxdU5melB2U09waCJ9.P2k_gM3gUCl1I9Ehw-8dBpGN5Mu1TU3FFbeabLiLSPlB750_NjfJzh6_jnNZKAdpb-u0KsbodS2Pp1J7K6xDMdXpRhBwQ38uwkoRcW5A4yrUNmam7NJPGLhoXuXIP--eGzCq7SIn8sSA7PetMioNlWdsezP64BPLCwqtiNDpVrO7-tK2qyMntucChv0cq-NusMRFjqDcaKys3k915SVh0q3_J95I06RsL7H847fJWLQt4XFSkALQwqnKwqkGXvLBwXkSbAs-LPGCZ4anKvldfRjYXF0p40lpwni5_V4OqCaDewmg6ckxIB6gqVD28JubYzomBH-3mN83D0VCoi2baw'; // Replace with your actual cookie
const OUTPUT_DIR = './output';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'generated_music.mp3');

async function initializeSunoAI() {
    try {
        console.log('Initializing SunoAI with the provided cookie...');
        const suno = new SunoAI(SUNO_COOKIE);
        await suno.init();
        console.log('SunoAI initialized successfully.');
        return suno;
    } catch (error) {
        console.error('Failed to initialize SunoAI:', error.message);
        console.error('Error stack:', error.stack);
        throw error; // Rethrow the error for further handling
    }
}

async function generateSong(suno, description) {
    const payload = {
        gpt_description_prompt: description,
        mv: 'chirp-v3-0',
        prompt: '',
        make_instrumental: false
    };

    try {
        console.log('Generating song...');
        const songInfo = await suno.generateSongs(payload);
        return songInfo;
    } catch (error) {
        console.error('Error generating song:', error);
        throw error; // Rethrow the error for further handling
    }
}

async function saveSong(suno, songInfo) {
    try {
        console.log('Saving song...');
        await suno.saveSongs(songInfo, OUTPUT_DIR);
        console.log('Song saved successfully to', OUTPUT_DIR);
        
        // If the song is saved as a separate file, you can rename or move it here if needed
        // Assuming the songInfo contains the necessary data to identify the generated file
        // You might need to adjust this based on how the library saves the files
        const generatedFilePath = path.join(OUTPUT_DIR, songInfo.fileName); // Adjust based on actual file name
        fs.renameSync(generatedFilePath, OUTPUT_FILE); // Rename to desired output file
        console.log(`File renamed to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error saving song:', error);
        throw error; // Rethrow the error for further handling
    }
}

async function main() {
    try {
        const suno = await initializeSunoAI();
        const description = 'a blues song about always being by your side';
        
        const songInfo = await generateSong(suno, description);
        await saveSong(suno, songInfo);

        const ids = songInfo.ids;
        const songsMetadata = await suno.getMetadata(ids);
        console.log('Generated song metadata:', songsMetadata);

    } catch (error) {
        console.error('An error occurred during the music generation process:', error.message);
    }
}

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Run the main function
main();