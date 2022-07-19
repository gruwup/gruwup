const AdventureStore = require("../store/AdventureStore");
const UserStore = require("../store/UserStore");

module.exports = class FilterService {
    static getNearbyAdventures = async (cityName) => {
        if (!cityName) {
            return {
                code: 400,
                message: "City name is required"
            }
        }
        const nearbyFilter = {city: cityName};
        try {
            const adventures = await AdventureStore.findAdventuresByFilter(nearbyFilter);
            if (adventures.code !== 200) {
                return {
                    code: adventures.code,
                    message: adventures.message
                }
            }
            return {
                code: 200,
                message: "Nearby adventures found",
                payload: adventures.payload
            }
        }
        catch (err) {
            return {
                code: 500,
                message: err._message
            };
        }
    };

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
                message: err._message
            };
        }
    };

    static findAdventuresByFilter = async (filter) => {
        try {
            var adventureFilter = filter.city ? 
            {
                $and: [
                    { category: { $in: filter.categories } },
                    { dateTime: { $lte: filter.maxTimeStamp } },
                    { city: filter.city }
                ]
            } : {
                $and: [
                    { category: { $in: filter.categories } },
                    { dateTime: { $lte: filter.maxTimeStamp } }
                ]
            };
            var searchResult = await AdventureStore.findAdventuresByFilter(adventureFilter);
            var arr = searchResult.payload.reduce((acc, adventure) => {
                if (adventure.peopleGoing.length <= filter.maxPeopleGoing) {
                    acc.push(adventure);
                }
                return acc;
            }
            , []);
            return {
                code: searchResult.code,
                message: "Adventure found",
                payload: arr
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err._message
            };
        }
    }
};