const AdventureStore = require("../store/AdventureStore");

module.exports = class FilterService {
    static getNearbyAdventures = async (cityName) => {
        const nearbyFilter = [{city: cityName}];
        try {
            const adventures = await AdventureStore.findAdventuresByFilter(nearbyFilter);
            if (adventures.code !== 200) {
                return {
                    code: adventures.code,
                    message: adventures.message
                }
            }
            var adventureThumbnails = adventures.payload.map(adventure => {
                return {
                    adventureId: adventure._id,
                    title: adventure.title,
                    category: adventure.category,
                    image: adventure.image,
                    location: adventure.location
                };
            });
            return {
                code: 200,
                message: "Nearby adventures found",
                payload: adventureThumbnails
            };
        }
        catch (err) {
            return {
                code: 500,
                message: err
            };
        }
    };
};