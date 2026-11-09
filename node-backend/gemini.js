async function analyzeNewsText(newsText) {
    return {
        prediction: "Needs Verification",
        confidence: 75,
        explanation: "This is a sample analysis. Gemini AI connection is not active yet."
    };
}

module.exports = { analyzeNewsText };