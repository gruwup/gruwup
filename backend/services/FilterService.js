const AdventureStore = require("../store/AdventureStore");
const UserStore = require("../store/UserStore");

module.exports = class FilterService {
    static getNearbyAdventures = async (cityName) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        if (!cityName) {
            result = {
                code: 400,
                message: "City name is required"
            }
        }
        else {
            const nearbyFilter = {city: cityName};
            try {
                const adventuresResult = await AdventureStore.findAdventuresByFilter(nearbyFilter);
                result = (adventures.code !== 200) ? adventuresResult : {
                    code: 200,
                    message: "Nearby adventures found",
                    payload: adventures.payload
                };
            }
            catch (err) {
                result = {
                    code: 500,
                    message: err._message
                };
            }
        }
        return result;
    };

    static getRecommendationFeed = async (userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        try {
            var userProfile = await UserStore.getUserProfile(userId);
            if (userProfile.code !== 200) {
                result = {
                    code: userProfile.code,
                    message: userProfile.message
                };
            }
            else {
                const statusOpen = {status: "OPEN"};
                var recommendationFilter = { $and: [
                    statusOpen,
                    { category: { $in: userProfile.payload.categories } },
                    { owner: { $ne: userId } },
                    { peopleGoing: { $nin: userId } },
                ]};
                var searchResult = await AdventureStore.findAdventuresByFilter(recommendationFilter);
                result = (searchResult.code !== 200) ? searchResult : {
                    code: searchResult.code,
                    message: "Recommendation feed generated",
                    payload: searchResult.payload
                };
            }
            
        }
        catch {
            result = {
                code: 500,
                message: err._message
            };
        }
        return result;
    };

    static findAdventuresByFilter = async (filter) => {
        var result = {
            code: 500,
            message: "Server error"
        };

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
            if (searchResult.code !== 200) {
                result = searchResult;
            }
            else {
                if (filter.maxPeopleGoing) {
                    var arr = searchResult.payload.reduce((acc, adventure) => {
                        if (adventure.peopleGoing.length <= filter.maxPeopleGoing) {
                            acc.push(adventure);
                        }
                        return acc;
                    }
                    , []);
                    result = {
                        code: searchResult.code,
                        message: "Adventure found",
                        payload: arr
                    };
                }
                else {
                    result = searchResult;
                }
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err._message
            };
        }
        return result;
    }
};