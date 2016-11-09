
var mongo = require("mongodb").MongoClient;

// Connects to the MongoDB
var Database = function(db_url, base_url) {
    
    var db_url = db_url;
    var base_url = base_url;
    
    var db = {};
    
    var nextID = 0;
    
    this.getID = function() {
        return nextID;
    };
    
    /** Adds an URL into the database.*/
    this.add = function(url, func) {
        db[nextID] = url;
        mongo.connect(db_url, (err, db) => {
            if (err) throw err;
            
            var collection = db.collection("urls");
            
            var short_id = nextID;
            var newDoc = {original_url: url, short_id: short_id};
    
            collection.insert(newDoc, function(err, data) {
                if (err) throw err;
                ++nextID;
                console.log("Inserted URL " + url + " into the DB");
                db.close();
                func(short_id);
            });
            
        });
    };
    
    /** Returns the original URL for given ID, or -1 if there's no URL.*/
    this.get = function(id, func) {
        console.log("db.get query ID " + id);
        mongo.connect(db_url, (err, db) => {
            if (err) throw err;
            var collection = db.collection("urls");
            var query = {short_id: parseInt(id)};
            collection.find(query).toArray((err, docs) => {
                if (err) throw err;
                console.log("DB init check Next ID is " + nextID);
                
                console.log("Docs: " + JSON.stringify(docs));
                var orig_url = docs[0].original_url;
                
                db.close();
                func(orig_url);
            });
        });
        
    };
    
    // DB must be checked for existing links
    mongo.connect(db_url, (err, db) => {
        if (err) throw err;
        
        var collection = db.collection("urls");
        
        collection.find().toArray((err, docs) => {
            if (err) throw err;
            nextID = docs.length;
            console.log("DB init check Next ID is " + nextID);
            
            db.close();
        });
    });
    
};

module.exports = Database;