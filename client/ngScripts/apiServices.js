app.factory('resistorService', ['$http', function ($http) {
    var randomNumberBetween0and19 = Math.floor(Math.random() * 20);
    var randomWholeNum = function randomWholeNum() {
        // Only change code below this line.
        return Math.random();
    }

    return {
        GetResistance: function (nlpText) {
            return $http.post("/api/v1/resistance/get", { "textMessage": nlpText, "sessionId":randomWholeNum()});
        },
        SubmitFeedback:function(feed){
            return $http.post("/api/v1/user/feedback", feed);            
        }
    };
}]);