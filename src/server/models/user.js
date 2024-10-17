class user{
    constructor(userid,username,email,phonenumber,location,profileimage,foodarray=[{
        foodid
    }]){
        this.userid = userid,
        this.username = username,
        this.email = email,
        this.phonenumber = phonenumber,
        this.loaction = location,
        this.profileimage = profileimage
        this.foodarray = foodarray

    }

}

module.exports = user;