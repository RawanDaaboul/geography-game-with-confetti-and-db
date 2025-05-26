export async function saveScores(userId, highscoreP, highscoreA, highscoreGDP) {
    try {
        const data = { 
            user_id: userId, 
            highscore_p: highscoreP, 
            highscore_a: highscoreA, 
            highscore_GDP: highscoreGDP 
        };
        
        const response = await fetch('saveScores.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        console.log('Scores saved successfully!');
        return true;
    } catch (error) {
        console.error('Error saving scores:', error);
        return false;
    }
}

export async function getScores(userId) {
    try {
        const response = await fetch(`getScores.php?user_id=${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const scores = await response.json();
        console.log('User scores:', scores);
        return scores;
    } catch (error) {
        console.error('Error getting scores:', error);
        return null;
    }
}