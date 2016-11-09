

// Connects to the MongoDB
var Database = function(url) {
    
    var db = {};
    
    var nextID = 0;
    
    /** Adds an URL into the database.*/
    this.add = function(url) {
        db[nextID] = url;
        ++nextID;
    };
    
    /** Returns the original URL for given ID, or -1 if there's no URL.*/
    this.get = function(id) {
        if (db.hasOwnProperty(id)) {
            return db[id];
        }
        else {
            return -1;
        }
        
    };
    
};

module.exports = Database;