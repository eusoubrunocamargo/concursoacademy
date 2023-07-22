export const calculatePerformance = (
    confidenceLevel, 
    errorType, 
    index,
    questions,
    setQuestions,
    ) => {

    let score = 0;
    
    if(questions[index].is_answered_correctly === true) 
    {
        if(confidenceLevel === '1') {
            score = 1;
        } else if(confidenceLevel === '2') {
            score = 0.8;
        } else if(confidenceLevel === '3') {
            score = 0;
        }
    } else if (questions[index].is_answered_correctly === false) {
        if(confidenceLevel === '1') {
            if(errorType === '1') {
                score = -0.5;
            } else if(errorType === '2' || errorType === '3') {
                score = 0.2;
            }
        } else if(confidenceLevel === '2') {
            if(errorType === '1') {
                score = 0;  
            } else if(errorType === '2' || errorType === '3') {
                score = 0.4;
            } 
        } else if(confidenceLevel === '3') {
            if(errorType === '1' || errorType === '2' || errorType === '3') {
                score = 0;
            }
        }
    } else {
        return -1;
    }

    const copyQuestions = [...questions];
    copyQuestions[index].performance = score;
    setQuestions(copyQuestions);

    return score;

}