const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const { path } = require("express/lib/application");

// startup a collection of data to manage
db.serialize(() => {
    // create a fresh version of the table
    db.run("DROP TABLE IF EXISTS Inventory");
    db.run(
        "CREATE TABLE Inventory (animal TEXT, description TEXT, " +
            "age INTEGER, price REAL)"
    );
    // insert initial records into the table
    const stmt = db.prepare("INSERT INTO Inventory VALUES (?,?,?,?)");
    stmt.run("Dog", "Wags tail when happy", "2", "250.00");
    stmt.run("Cat", "Black colour, friendly with kids", "3", "50.00");
    stmt.run("Love Bird", "Blue with some yellow", "2", "100.00");
    stmt.finalize();
});

app.get("/", (req, res) => {
    res.send("Pet Store DB server is running!");
});

// Make the backend available
app.get("/api", (req, res) => {
    // log to console that an api request has been received
    console.log("API REQUEST RECEIVED");

    // return all of the animals in the inventory as a JSON array
    if (req.query.act == "getall") {
        db.all(
            "SELECT rowid as id, animal, description, age, price FROM Inventory",
            function (err, results) {
                if (err) {
                    // console log error, return JSON error message
                    console.log(err);
                    res.json({ error: "Could not get inventory" });
                } else {
                    // send debug info to console
                    console.log(JSON.stringify(results));

                    // send back table data as JSON data
                    res.json(results);
                }
            }
        );
    }

    // add an animal to the inventory
    else if (req.query.act == "add") {
        db.run(
            "INSERT INTO Inventory(animal,description,age,price) VALUES (?,?,?,?)",
            [
                req.query.animal,
                req.query.description,
                req.query.age,
                req.query.price,
            ],
            function (err, results) {
                if (err) {
                    // console log error, return JSON error message
                    console.log(err);
                    res.json({ error: "Could not insert animal" });
                } else {
                    console.log(results);
                    res.json({ status: "Add animal successful" });
                }
            }
        );
    }

    // delete an animal from the inventory
    else if (req.query.act == "delete") {
        db.run(
            "DELETE FROM Inventory WHERE rowid=?",
            [req.query.id],
            function (err, results) {
                if (err) {
                    // console log error, return JSON error message
                    console.log(err);
                    res.json({ error: "Could not delete animal" });
                } else {
                    console.log(results);
                    res.json({ status: "Delete animal successful" });
                }
            }
        );
    }

    // update an animal in the inventory
    else if (req.query.act == "update") {
        db.run(
            "UPDATE Inventory SET animal=(?), description=(?), " +
                "age=(?), price=(?) WHERE rowid=?",
            [
                req.query.animal,
                req.query.description,
                req.query.age,
                req.query.price,
                req.query.id,
            ],
            function (err, results) {
                if (err) {
                    // console log error, return JSON error message
                    console.log(err);
                    res.json({ error: "Could not update animal" });
                } else {
                    console.log(results);
                    res.json({ status: "Update animal successful" });
                }
            }
        );
    }

    // search the inventory... search all fields that contain a provided term
    else if (req.query.act == "search") {
        db.all(
            "SELECT rowid as id, animal, description, age, price FROM Inventory " +
                "WHERE rowid LIKE '%" +
                req.query.term +
                "%' OR animal LIKE '%" +
                req.query.term +
                "%' OR description LIKE '%" +
                req.query.term +
                "%' OR " +
                "age LIKE '%" +
                req.query.term +
                "%' OR price LIKE '%" +
                req.query.term +
                "%'",
            function (err, results) {
                if (err) {
                    console.log(err);
                    res.json({ error: "Could not search inventory" });
                } else {
                    // send debug info to console
                    console.log(JSON.stringify(results));

                    // send back table data as JSON data
                    res.json(results);
                }
            }
        );
    }

    // if no act is found
    else {
        res.json({ error: "act not found" });
    }
});

// run the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Pet Store Server running on port: ${port} `);
});
