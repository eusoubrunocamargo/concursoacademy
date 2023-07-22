export const calcDaysUntilReview = (created_at, daysUntilReview) => {
        const createdDate = new Date(created_at);
        const reviewDate = new Date(createdDate.setDate(createdDate.getDate() + daysUntilReview));
        const currentDate = new Date();
        const remainingDays = Math.floor((reviewDate - currentDate) / (1000 * 60 * 60 * 24));
        return remainingDays;
    }

