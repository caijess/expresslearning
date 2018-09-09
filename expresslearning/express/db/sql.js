let weddingSql={
    insert:'INSERT INTO guestList VALUES(null,?,?,?)',
    queryAll:'SELECT * FROM guestList',
    getHostById:'SELECT * FROM guestList WHERE id=?'
}

module.exports=weddingSql;