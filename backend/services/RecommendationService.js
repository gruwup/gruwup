const AdventureStore = require("../store/AdventureStore");
const UserStore = require("../store/UserStore");

module.exports = class RecommendationService {
    static getRecommendationFeed = async (userId) => {
        try {
            var userProfile = await UserStore.getUserProfile(userId);
            if (userProfile.code !== 200) {
                return {
                    code: userProfile.code,
                    message: userProfile.message
                };
            }
            var recommendationFilter = { $and: [
                { status: "OPEN" },
                { category: { $in: userProfile.payload.categories } },
                { owner: { $ne: userId } },
                { peopleGoing: { $nin: userId } },
            ]};
            var searchResult = await AdventureStore.findAdventuresByFilter(recommendationFilter);
            return {
                code: searchResult.code,
                message: "Recommendation feed generated",
                payload: searchResult.payload
            };
        }
        catch {
            return {
                code: 500,
                message: err
            };
        }
    }
};