const recommendations = {
    getClothingRecommendation: function(temperature) {
        if (temperature < 0) {
            return "Wear a heavy coat, gloves, and a hat.";
        } else if (temperature < 10) {
            return "A warm jacket and layers are recommended.";
        } else if (temperature < 20) {
            return "A light jacket or sweater should be fine.";
        } else {
            return "Dress lightly, a t-shirt and shorts are perfect.";
        }
    },

    getActivityRecommendation: function(weatherCondition) {
        switch (weatherCondition) {
            case 'Clear':
                return "Great day for outdoor activities like hiking or biking!";
            case 'Rain':
                return "Consider indoor activities like visiting a museum or watching a movie.";
            case 'Cloudy':
                return "A good day for a walk or a visit to a café.";
            case 'Snow':
                return "Perfect for skiing or building a snowman!";
            default:
                return "Check the weather and plan accordingly.";
        }
    },

    getUVProtectionAdvice: function(uvIndex) {
        if (uvIndex < 3) {
            return "Low risk. No protection needed.";
        } else if (uvIndex < 6) {
            return "Moderate risk. Wear sunscreen and sunglasses.";
        } else if (uvIndex < 8) {
            return "High risk. Seek shade and wear protective clothing.";
        } else {
            return "Very high risk. Avoid the sun between 10 AM and 4 PM.";
        }
    }
};

export default recommendations;