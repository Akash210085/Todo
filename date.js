
exports.getDay= function (){
const options = {
    weekday:"long",
    month: "long",
    day: "numeric",
}

const today = new Date();
const day = today.toLocaleDateString("en-us",options);
return day;
}