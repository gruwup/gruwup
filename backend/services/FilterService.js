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
            await AdventureStore.findAdventuresByFilter(nearbyFilter).then(adventures => {
                if (adventures.code === 200) {
                    result = {
                        code: 200,
                        message: "Nearby adventures found",
                        payload: adventures.payload
                    };
                }
                else {
                    result = {
                        code: adventures.code,
                        message: adventures.message
                    };
                }
            }, err => {
                result = {
                    code: 500,
                    message: err._message
                    };
            });
        }
        return result;
    };

    static getRecommendationFeed = async (userId) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        var userProfile = {};
        await UserStore.getUserProfile(userId).then(async profile => {
            result = {
                code: profile.code,
                message: profile.message
            };
            if (profile.code === 200) {
                userProfile = profile.payload;
                const statusOpen = {status: "OPEN"};
                var recommendationFilter = { $and: [
                    statusOpen,
                    { category: { $in: userProfile.categories } },
                    { owner: { $ne: userId } },
                    { peopleGoing: { $nin: userId } },
                ]};
                await AdventureStore.findAdventuresByFilter(recommendationFilter).then(adventures => {
                    result = {
                        code: adventures.code,
                        message: adventures.message
                    };
                    if (adventures.code === 200) {
                        result = {
                            code: 200,
                            message: "Recommendation feed found",
                            payload: adventures.payload
                        };
                    }
                }, err => {
                    result = {
                        code: 500,
                        message: err._message
                        };
                });
            }
        }
        , err => {
            result = {
                code: 500,
                message: err._message
            };
        }); 

        return result;
    };

    static findAdventuresByFilter = async (filter) => {
        var result = {
            code: 500,
            message: "Server error"
        };

        if (!filter || !filter.categories || !filter.dateTime) {
            result = {
                code: 400,
                message: "Mandatory filter field missing"
            };
            return result;
        }

        var adventureFilter = filter.city ? 
        {
            $and: [
                { category: { $in: filter.categories } },
                { dateTime: { $lte: filter.maxTimeStamp } },
                { city: filter.city }
            ]
        } 
        : {
            $and: [
                { category: { $in: filter.categories } },
                { dateTime: { $lte: filter.maxTimeStamp } }
            ]
        };
        await AdventureStore.findAdventuresByFilter(adventureFilter).then(adventures => {
            result = {
                code: adventures.code,
                message: adventures.message
            };
            if (adventures.code === 200) {
                var arr = adventures.payload;
                if (filter.maxPeopleGoing && arr.length > 0) {
                    arr = adventures.payload.reduce((acc, adventure) => {
                        if (adventure.peopleGoing.length <= filter.maxPeopleGoing) {
                            acc.push(adventure);
                        }
                        return acc;
                    }
                    , []);
                }
                result = {
                    code: 200,
                    message: "Adventures found",
                    payload: arr
                };
            }
        }, err => {
            result = {
                code: 500,
                message: err._message
                };
        });
        return result;
    }
};