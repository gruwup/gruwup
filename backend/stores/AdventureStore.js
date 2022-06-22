const Adventure = require("../models/Adventure");

module.exports = class AdventureStore {
    static createAdventure = async (req, res) => {
        var dateTimeArray = req.body.dateTime.split(/-|\s|:/);
        var dateTime = new Date(dateTimeArray[0], dateTimeArray[1] -1, dateTimeArray[2], dateTimeArray[3], dateTimeArray[4], dateTimeArray[5]);
        var adventure = new Adventure({
            owner: req.body.owner,
            title: req.body.title,
            description: req.body.description,
            peopleGoing: [req.body.owner],
            dateTime: dateTime.toString(),
            location: req.body.location,
            category: req.body.category,
            status: "OPEN",
            image: req.body.image ? new Buffer(req.body.image.split(",")[1],"base64") : null,
            city: req.body.location.split(", ")[1] ?? "unknown"
        });
    
        adventure.save((err, adventureAdded) => {
            console.log("err " + err);
            console.log("adventure added " + adventureAdded);
            if (err) {
                res.status(500).send(err);
            }
            else {
                adventure.adventureId = adventureAdded._id;
                res.status(200).send(adventure);
            }
        });
    };
};