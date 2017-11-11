
var request = {
    parseBody: function(body){
        /***** Add Parse Body Functions Here */
        if(body!=null)
        {
            return body;
        }
    },
    converToJson: function(str){
            return JSON.parse(str);
    }
}

module.exports = request;