const Adventure = require("../models/Adventure");
const Profile = require("../models/Profile");

module.exports = class User {
    static getUserProfile = async (userId) => {
        var result;

        try {
            var profileResult = await Profile.findOne({ userId });
            if (!profileResult) {
                result = {
                    code: 404,
                    message: "User Profile not found"
                }
            }
            else {
                var adventuresResult = await Adventure.find({ owner: userId });
                var adventures = [];
                adventuresResult.forEach(adventure => adventures.push(adventure));
                var profile = { 
                    userId: profileResult.userId,
                    name: profileResult.name,
                    biography: profileResult.biography,
                    categories: profileResult.categories,
                    image: profileResult.image,
                    adventuresCreated: adventures 
                };

                result = {
                    code: 200,
                    message: "User Profile found",
                    payload: profile
                }
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }

        return result;
    };
    
    static createUser = async (profile) => {
        var result;
        var user = new Profile(profile);
        var exists = await Profile.findOne({ userId: profile.userId });
        if (!exists) {
            try {
                var profileResult = await user.save();

                result = {
                    code: 200,
                    message: "Profile created successfully",
                    payload: profileResult
                };
            }
            catch (err) {
                result = {
                    code: 400,
                    message: err._message
                };
            }
        }
        else {
            result = {
                code: 400,
                message: "Profile exists for userId",
                payload: result
            };
        }

        return result;
    };
    
    static updateUser = async (userId, profile) => {
        var result;

        try {
            var profileResult = await Profile.findOneAndUpdate(
                                { userId },
                                { $set: profile },
                                {new: true, runValidators: true }
                            );
    
            if (profileResult) {
                result = {
                    code: 200,
                    message: "User Profile updated successfully",
                    payload: profileResult
                }
            }
            else {
                result = {
                    code: 404,
                    message: "User Profile not found"
                }
            }
        }
        catch (err) {
            result = {
                code: 500,
                message: err
            };
        }

        return result;
    };
};
